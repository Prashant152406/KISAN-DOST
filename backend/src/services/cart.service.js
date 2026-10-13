import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.model.js";
import { AppError } from "../utils/AppError.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

/**
 * Builds the cart response with LIVE product data — current price, current
 * stock, whether the product still exists/is active. This is what the
 * frontend renders; it is recomputed on every read, never cached.
 */
async function hydrateCart(cart) {
  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  let subtotal = 0;
  let hasChanges = false;

  for (const item of cart.items) {
    const product = productMap.get(String(item.product));

    if (!product || !product.isActive) {
      hasChanges = true; // product removed/deactivated after being added — drop it
      continue;
    }

    const quantity = Math.min(item.quantity, product.stock || 0);
    if (quantity !== item.quantity) hasChanges = true;
    if (quantity <= 0) {
      hasChanges = true;
      continue;
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    items.push({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0] || null,
      price: product.price, // current authoritative price
      priceWhenAdded: item.priceAtAddition,
      priceChanged: item.priceAtAddition !== product.price,
      quantity,
      availableStock: product.stock,
      lineTotal,
    });
  }

  return { items, subtotal, hasChanges };
}

/** Persist any auto-corrections (stock capped, removed items) made during hydration. */
async function reconcileCart(cart, hydrated) {
  if (!hydrated.hasChanges) return;
  const keepIds = new Set(hydrated.items.map((i) => String(i.productId)));
  cart.items = cart.items.filter((i) => keepIds.has(String(i.product)));
  for (const item of cart.items) {
    const match = hydrated.items.find((h) => String(h.productId) === String(item.product));
    if (match) item.quantity = match.quantity;
  }
  await cart.save();
}

export async function getCart(userId) {
  const cart = await getOrCreateCart(userId);
  const hydrated = await hydrateCart(cart);
  await reconcileCart(cart, hydrated);
  return hydrated;
}

export async function addItem(userId, productId, quantity = 1) {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }
  if (product.stock < 1) {
    throw new AppError("This product is out of stock.", 400, "OUT_OF_STOCK");
  }

  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find((i) => String(i.product) === String(productId));

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, product.stock);
  } else {
    cart.items.push({
      product: productId,
      quantity: Math.min(quantity, product.stock),
      priceAtAddition: product.price,
    });
  }

  await cart.save();
  return getCart(userId);
}

export async function updateItemQuantity(userId, productId, quantity) {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => String(i.product) === String(productId));
  if (!item) {
    throw new AppError("Item not found in cart.", 404, "CART_ITEM_NOT_FOUND");
  }

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
  } else {
    const product = await Product.findById(productId).lean();
    item.quantity = product ? Math.min(quantity, product.stock) : quantity;
  }

  await cart.save();
  return getCart(userId);
}

export async function removeItem(userId, productId) {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
  await cart.save();
  return getCart(userId);
}

export async function clearCart(userId) {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
}
