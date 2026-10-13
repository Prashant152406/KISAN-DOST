import mongoose from "mongoose";

export const ORDER_STATUSES = [
  "pending", // created, awaiting payment
  "confirmed", // payment verified
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    // Snapshot at time of order — product price/name/image can change later,
    // but the order must always reflect what the customer actually bought.
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    note: { type: String, default: "" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const addressSnapshotSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    village: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
    landmark: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },

    items: [orderItemSchema],

    shippingAddress: { type: addressSnapshotSchema, required: true },

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "razorpay" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },

    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },
    statusHistory: [statusHistoryEntrySchema],

    trackingNumber: { type: String, default: null },
    cancelReason: { type: String, default: null },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);
