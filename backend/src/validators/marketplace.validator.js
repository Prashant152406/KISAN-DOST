import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10),
  shortDescription: z.string().trim().max(300).optional(),
  brand: z.string().trim().optional(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  price: z.number().positive(),
  mrp: z.number().positive().optional(),
  stock: z.number().int().min(0),
  sku: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  cropTypes: z.array(z.string()).optional(),
  suitableFor: z.array(z.string()).optional(),
  applicationMethod: z.string().optional(),
  dosage: z.string().optional(),
  usageInstructions: z.string().optional(),
  composition: z.string().optional(),
  manufacturer: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().optional(),
  image: z.string().url().optional(),
  parent: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(999).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(999),
});

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  addressLine1: z.string().trim().min(3),
  addressLine2: z.string().trim().optional(),
  village: z.string().trim().optional(),
  city: z.string().trim().optional(),
  district: z.string().trim().optional(),
  state: z.string().trim().min(2),
  postalCode: z.string().trim().min(3),
  country: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const cancelOrderSchema = z.object({
  reason: z.string().trim().max(300).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ]),
  note: z.string().trim().max(300).optional(),
  trackingNumber: z.string().trim().optional(),
});
