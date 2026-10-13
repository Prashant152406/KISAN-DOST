import { EmailVerification } from "../models/EmailVerification.model.js";
import { env } from "../config/env.js";
import { generateOtp, sha256, safeCompare } from "../utils/crypto.js";
import { AppError } from "../utils/AppError.js";
import { sendOtpEmail } from "./email.service.js";

/**
 * Create (or refresh) the OTP record for a pending user and email it.
 * Enforces a resend cooldown and a max-resends-per-window limit.
 */
export async function issueOtp(user, { isResend = false } = {}) {
  const now = new Date();
  const existing = await EmailVerification.findOne({ userId: user._id });

  if (isResend && existing) {
    const secondsSinceLastSend = (now - existing.lastSentAt) / 1000;
    if (secondsSinceLastSend < env.otpResendCooldownSeconds) {
      const wait = Math.ceil(env.otpResendCooldownSeconds - secondsSinceLastSend);
      throw new AppError(
        `Please wait ${wait}s before requesting another code.`,
        429,
        "OTP_RESEND_COOLDOWN"
      );
    }

    const windowAgeHours = (now - existing.resendWindowStart) / 1000 / 3600;
    const windowExpired = windowAgeHours > 1;
    const nextResendCount = windowExpired ? 1 : existing.resendCount + 1;

    if (!windowExpired && existing.resendCount >= env.otpMaxResendsPerWindow) {
      throw new AppError(
        "Too many OTP requests. Please try again later.",
        429,
        "OTP_RESEND_LIMIT_EXCEEDED"
      );
    }

    existing.resendCount = nextResendCount;
    existing.resendWindowStart = windowExpired ? now : existing.resendWindowStart;
  }

  const otp = generateOtp();
  const otpHash = sha256(otp);
  const expiresAt = new Date(now.getTime() + env.otpExpiryMinutes * 60 * 1000);

  await EmailVerification.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      otpHash,
      attempts: 0,
      maxAttempts: env.otpMaxAttempts,
      lastSentAt: now,
      expiresAt,
      ...(isResend && existing
        ? { resendCount: existing.resendCount, resendWindowStart: existing.resendWindowStart }
        : { resendCount: 1, resendWindowStart: now }),
    },
    { upsert: true, new: true }
  );

  await sendOtpEmail(user.email, otp);
}

/**
 * Verify a submitted OTP against the stored hash.
 * Throws AppError with a specific code for each failure mode so the
 * frontend can show precise, actionable messages.
 */
export async function verifyOtp(userId, submittedOtp) {
  const record = await EmailVerification.findOne({ userId });

  if (!record) {
    throw new AppError(
      "No verification code found. Please request a new one.",
      400,
      "OTP_NOT_FOUND"
    );
  }

  if (record.expiresAt < new Date()) {
    throw new AppError(
      "This code has expired. Please request a new one.",
      400,
      "OTP_EXPIRED"
    );
  }

  if (record.attempts >= record.maxAttempts) {
    throw new AppError(
      "Too many incorrect attempts. Please request a new code.",
      429,
      "OTP_MAX_ATTEMPTS_EXCEEDED"
    );
  }

  const submittedHash = sha256(submittedOtp);
  const isMatch = safeCompare(submittedHash, record.otpHash);

  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    throw new AppError("Incorrect code. Please try again.", 400, "OTP_INCORRECT");
  }

  // One-time use: destroy the record immediately on success.
  await EmailVerification.deleteOne({ _id: record._id });
}
