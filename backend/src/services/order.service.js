import { Order, ORDER_STATUSES } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { Cart } from "../models/Cart.model.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import * as paymentService from "./payment.service.js";

function generateOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KD-${datePart}-${randomPart}`;
}

function calculateTotals(items) {
  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const shippingFee = subtotal >= env.freeShippingThreshold || subtotal === 0 ? 0 : env.defaultShippingFee;
  const tax = Math.round((subtotal * env.taxRatePercent) / 100);
  const total = subtotal + shippingFee + tax;
  return { subtotal, shippingFee, tax, total };
}

/**
 * Validates the user's cart against LIVE product data (stock + current
 * price), builds order line-item snapshots, and creates a "pending" order
 * plus a matching Razorpay payment order. Nothing here trusts any price or
 * total the frontend might have sent — every number is recomputed here.
 */
export async function createOrderFromCart(userId, { shippingAddress, paymentMethod = "razorpay" }) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty.", 400, "CART_EMPTY");
  }

  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const orderItems = [];
  for (const cartItem of cart.items) {
    const product = productMap.get(String(cartItem.product));

    if (!product || !product.isActive) {
      throw new AppError(
        `A product in your cart is no longer available. Please review your cart.`,
        409,
        "PRODUCT_UNAVAILABLE"
      );
    }
    if (product.stock < cartItem.quantity) {
      throw new AppError(
        `Only ${product.stock} unit(s) of "${product.name}" left in stock.`,
        409,
        "INSUFFICIENT_STOCK"
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || null,
      price: product.price, // authoritative, live price
      quantity: cartItem.quantity,
      total: product.price * cartItem.quantity,
    });
  }

  const { subtotal, shippingFee, tax, total } = calculateTotals(orderItems);
  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    user: userId,
    orderNumber,
    items: orderItems,
    shippingAddress,
    subtotal,
    shippingFee,
    tax,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    orderStatus: "pending",
    statusHistory: [{ status: "pending", note: "Order created" }],
  });

  if (paymentMethod === "razorpay") {
    const razorpayOrder = await paymentService.createPaymentOrder({
      amountInRupees: total,
      receipt: orderNumber,
    });
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return {
      order,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: env.razorpayKeyId,
      },
    };
  }

  // Cash on delivery: reserve stock immediately, no payment step needed.
  await reserveStock(orderItems);
  order.orderStatus = "confirmed";
  order.statusHistory.push({ status: "confirmed", note: "Cash on delivery — order confirmed" });
  await order.save();
  await Cart.updateOne({ user: userId }, { items: [] });

  return { order, razorpay: null };
}

async function reserveStock(items) {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: -item.quantity, sold: item.quantity } }
    );
  }
}

/**
 * Called after Razorpay's checkout redirects back with a payment id + signature.
 * The signature is the ONLY proof of payment this backend accepts — a
 * frontend flag like `paymentSuccess: true` is never trusted.
 */
export async function verifyAndFinalizeOrder(userId, { orderId, razorpayPaymentId, razorpaySignature }) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");

  if (order.paymentStatus === "paid") {
    return order; // already finalized — safe to call twice (e.g. user refreshes)
  }

  const isValid = paymentService.verifyPaymentSignature({
    razorpayOrderId: order.razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });

  if (!isValid) {
    order.paymentStatus = "failed";
    order.statusHistory.push({ status: order.orderStatus, note: "Payment verification failed" });
    await order.save();
    throw new AppError("Payment verification failed.", 400, "PAYMENT_VERIFICATION_FAILED");
  }

  order.paymentStatus = "paid";
  order.razorpayPaymentId = razorpayPaymentId;
  order.orderStatus = "confirmed";
  order.statusHistory.push({ status: "confirmed", note: "Payment verified" });
  await order.save();

  await reserveStock(order.items);
  await Cart.updateOne({ user: userId }, { items: [] });

  return order;
}

export async function listOrdersForUser(userId, { page = 1, limit = 10 } = {}) {
  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Order.countDocuments({ user: userId }),
  ]);

  return { items, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
}

export async function getOrderForUser(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, user: userId }).lean();
  if (!order) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");
  return order;
}

const CANCELLABLE_STATUSES = ["pending", "confirmed", "processing"];

export async function cancelOrder(userId, orderId, reason) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");

  if (!CANCELLABLE_STATUSES.includes(order.orderStatus)) {
    throw new AppError(
      `Orders that are already "${order.orderStatus}" can no longer be cancelled.`,
      400,
      "ORDER_NOT_CANCELLABLE"
    );
  }

  // Restore stock for any items that had already been reserved (post-payment).
  if (order.paymentStatus === "paid") {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity, sold: -item.quantity } }
      );
    }
  }

  order.orderStatus = "cancelled";
  order.cancelReason = reason || "Cancelled by customer";
  order.statusHistory.push({ status: "cancelled", note: order.cancelReason });
  await order.save();
  return order;
}

// ---- Admin ----

export async function adminListOrders({ status, page = 1, limit = 20 } = {}) {
  const filter = {};
  if (status) filter.orderStatus = status;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("user", "name email")
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { items, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } };
}

/** The core of order-status tracking: every change is appended, never overwritten. */
export async function adminUpdateOrderStatus(orderId, { status, note, trackingNumber }) {
  if (!ORDER_STATUSES.includes(status)) {
    throw new AppError("Invalid order status.", 400, "INVALID_STATUS");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found.", 404, "ORDER_NOT_FOUND");

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory.push({ status, note: note || "" });
  await order.save();
  return order;
}
