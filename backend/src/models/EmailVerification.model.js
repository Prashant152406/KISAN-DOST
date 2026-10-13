import mongoose from "mongoose";

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one active OTP record per pending user at a time
      index: true,
    },
    otpHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, required: true },

    lastSentAt: { type: Date, default: Date.now },
    resendCount: { type: Number, default: 1 },
    resendWindowStart: { type: Date, default: Date.now },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL cleanup — once the OTP window fully expires, drop the doc.
// (A new one is created/reused on resend, refreshing expiresAt.)
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);
