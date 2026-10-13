import { Product } from "../models/Product.model.js";
import { AppError } from "../utils/AppError.js";
import { slugify, uniqueSlug } from "../utils/slugify.js";

/**
 * Public product listing: search, filter, sort, paginate — all done in
 * MongoDB, never by shipping the whole catalog to the frontend.
 */
export async function listProducts(query) {
  const {
    search,
    category,
    subcategory,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort = "newest",
    page = 1,
    limit = 20,
  } = query;

  const filter = { isActive: true };

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (subcategory) filter.subcategory = subcategory;
  if (brand) filter.brand = brand;
  if (inStock === "true") filter.stock = { $gt: 0 };
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating: { rating: -1 },
    popularity: { sold: -1 },
  };

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export async function getProductBySlug(slug) {
  const product = await Product.findOne({ slug, isActive: true })
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate("seller", "name")
    .lean();

  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }
  return product;
}

/** Admin/seller-only lookup — includes inactive products, no auth filtering. */
export async function getProductByIdForAdmin(id) {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
  }
  return product;
}

export async function createProduct(sellerId, data) {
  const slug = data.slug ? slugify(data.slug) : slugify(data.name);
  const slugTaken = await Product.exists({ slug });

  const product = await Product.create({
    ...data,
    slug: slugTaken ? uniqueSlug(data.name) : slug,
    seller: sellerId,
  });
  return product;
}

export async function updateProduct(id, updates) {
  const product = await getProductByIdForAdmin(id);

  if (updates.name && updates.name !== product.name && !updates.slug) {
    const candidate = slugify(updates.name);
    const taken = await Product.exists({ slug: candidate, _id: { $ne: id } });
    updates.slug = taken ? uniqueSlug(updates.name) : candidate;
  }

  Object.assign(product, updates);
  await product.save();
  return product;
}

/** Soft delete — keeps historical order line-item references intact. */
export async function deactivateProduct(id) {
  const product = await getProductByIdForAdmin(id);
  product.isActive = false;
  await product.save();
  return product;
}

export async function listProductsForAdmin({ page = 1, limit = 20 } = {}) {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Product.find({})
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("category", "name slug")
      .lean(),
    Product.countDocuments({}),
  ]);

  return { items, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
}
