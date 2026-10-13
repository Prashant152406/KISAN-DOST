import Razorpay from "razorpay";
import crypto from "crypto";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

let razorpayInstance = null;

function getClient() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) {
    throw new AppError(
      "Payments are not configured on this server yet.",
      503,
      "PAYMENTS_NOT_CONFIGURED"
    );
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }
  return razorpayInstance;
}

/** Create a Razorpay order for the given amount (in rupees). Amount is converted to paise. */
export async function createPaymentOrder({ amountInRupees, receipt }) {
  const client = getClient();
  try {
    return await client.orders.create({
      amount: Math.round(amountInRupees * 100),
      currency: "INR",
      receipt,
    });
  } catch (err) {
    throw new AppError("Failed to create payment order.", 502, "PAYMENT_ORDER_FAILED");
  }
}

/**
 * Verify the signature Razorpay's checkout returns to the frontend after payment.
 * This is the ONLY thing that may mark an order as paid — a frontend claim of
 * success is never trusted on its own.
 */
export function verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(razorpaySignature || "", "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function fetchPayment(paymentId) {
  const client = getClient();
  try {
    return await client.payments.fetch(paymentId);
  } catch (err) {
    throw new AppError("Failed to fetch payment details.", 502, "PAYMENT_FETCH_FAILED");
  }
}

export function isPaymentsConfigured() {
  return Boolean(env.razorpayKeyId && env.razorpayKeySecret);
}
