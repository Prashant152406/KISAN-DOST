import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // We NEVER store the raw session token — only a SHA-256 hash of it.
    // The raw token lives solely in the HTTP-only cookie on the client.
    sessionTokenHash: { type: String, required: true, unique: true },

    deviceInfo: { type: String, default: "Unknown device" },
    browser: { type: String, default: "Unknown browser" },
    os: { type: String, default: "Unknown OS" },
    userAgent: { type: String },
    ipAddress: { type: String },

    lastActiveAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model("Session", sessionSchema);
