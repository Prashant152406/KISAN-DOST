import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    village: { type: String, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    landmark: { type: String, trim: true },
    addressType: {
      type: String,
      enum: ["home", "farm", "office", "other"],
      default: "home",
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: { type: String, trim: true },
    profileImage: { type: String, default: null },

    // --- Authentication ---
    passwordHash: { type: String, select: false, default: null },
    googleId: { type: String, default: null, index: true, sparse: true },
    authProviders: {
      local: { type: Boolean, default: false },
      google: { type: Boolean, default: false },
    },
    isEmailVerified: { type: Boolean, default: false },

    // pending: created but not yet OTP-verified (local flow only)
    // active: usable account
    status: {
      type: String,
      enum: ["pending", "active", "suspended"],
      default: "pending",
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },

    addresses: [addressSchema],

    preferences: {
      language: { type: String, default: "en" },
      notifications: { type: Boolean, default: true },
    },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    lastLoginAt: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },

    // Only set while status === "pending". MongoDB TTL index removes the
    // document once this timestamp passes, cleaning up abandoned
    // registrations automatically. Cleared the moment the account becomes active.
    pendingExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.index({ status: 1 });
// TTL index: only documents that currently HAVE pendingExpiresAt set are ever
// candidates for deletion, so verified/active users are never touched.
userSchema.index({ pendingExpiresAt: 1 }, { expireAfterSeconds: 0 });

export const User = mongoose.model("User", userSchema);
