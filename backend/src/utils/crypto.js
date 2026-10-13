import crypto from "crypto";

/** Generate a cryptographically secure 6-digit numeric OTP as a string. */
export function generateOtp() {
  // 100000-999999 inclusive, using a secure random source (not Math.random).
  const n = crypto.randomInt(100000, 1000000);
  return String(n);
}

/** Generate a secure random opaque token (used for session tokens / reset tokens). */
export function generateOpaqueToken(bytes = 48) {
  return crypto.randomBytes(bytes).toString("hex");
}

/** One-way hash for values we must be able to compare later but never reveal (OTP, tokens). */
export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/** Constant-time comparison to avoid timing attacks when comparing hashes. */
export function safeCompare(a, b) {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
