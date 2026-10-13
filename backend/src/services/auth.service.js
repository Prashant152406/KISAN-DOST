import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";
import { PasswordResetToken } from "../models/PasswordResetToken.model.js";
import { EmailVerification } from "../models/EmailVerification.model.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { generateOpaqueToken, sha256 } from "../utils/crypto.js";
import { issueOtp } from "./otp.service.js";
import { sendPasswordResetEmail } from "./email.service.js";
import { revokeAllSessionsForUser } from "./session.service.js";

const SALT_ROUNDS = 12;

/**
 * Register with email/password.
 * Handles the "unverified registration" problem: if a PENDING account
 * already exists for this email, we refresh it and resend an OTP instead
 * of creating a duplicate user.
 */
export async function registerLocal({ name, email, password }) {
  email = email.toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.status === "active") {
      throw new AppError(
        "An account with this email already exists. Please log in instead.",
        409,
        "EMAIL_ALREADY_REGISTERED"
      );
    }

    // Existing PENDING account -> update details & resend OTP, no duplicate user.
    existing.name = name;
    existing.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    existing.authProviders.local = true;
    existing.pendingExpiresAt = new Date(
      Date.now() + env.pendingAccountTtlHours * 60 * 60 * 1000
    );
    await existing.save();
    await issueOtp(existing, { isResend: false });
    return existing;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    name,
    email,
    passwordHash,
    authProviders: { local: true, google: false },
    isEmailVerified: false,
    status: "pending",
    pendingExpiresAt: new Date(
      Date.now() + env.pendingAccountTtlHours * 60 * 60 * 1000
    ),
  });

  await issueOtp(user, { isResend: false });
  return user;
}

/** Called after OTP is successfully verified: activates the account. */
export async function activateUser(user) {
  user.isEmailVerified = true;
  user.status = "active";
  user.pendingExpiresAt = null;
  await user.save();
  return user;
}

export async function findPendingUserByEmail(email) {
  const user = await User.findOne({ email: email.toLowerCase(), status: "pending" });
  if (!user) {
    throw new AppError("No pending registration found for this email.", 404, "USER_NOT_FOUND");
  }
  return user;
}

/** Email + password login. Only for users with local auth enabled and active status. */
export async function loginLocal({ email, password }) {
  email = email.toLowerCase();
  const user = await User.findOne({ email }).select("+passwordHash");

  if (!user || !user.authProviders.local) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  if (user.status === "pending") {
    throw new AppError(
      "Please verify your email before logging in.",
      403,
      "EMAIL_NOT_VERIFIED"
    );
  }

  if (user.status === "suspended") {
    throw new AppError("This account has been suspended.", 403, "ACCOUNT_SUSPENDED");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
  }

  user.lastLoginAt = new Date();
  await user.save();
  return user;
}

/**
 * Google login/registration + the critical account-linking edge case:
 * if a local (possibly unverified) account already exists with this email,
 * link Google to it instead of creating a second user.
 */
export async function loginOrRegisterWithGoogle({ googleId, email, name, picture }) {
  email = email.toLowerCase();

  let user = await User.findOne({ googleId });
  if (user) {
    user.lastLoginAt = new Date();
    await user.save();
    return user;
  }

  user = await User.findOne({ email });

  if (user) {
    // Link Google to the existing account (covers: pending local account,
    // active local-only account, or re-linking after email change).
    user.googleId = googleId;
    user.authProviders.google = true;
    user.isEmailVerified = true;
    user.status = "active";
    user.pendingExpiresAt = null;
    user.profileImage = user.profileImage || picture;
    user.lastLoginAt = new Date();
    await user.save();

    // Any pending OTP for this user is now irrelevant.
    await EmailVerification.deleteOne({ userId: user._id });
    return user;
  }

  // Brand new Google-only user.
  user = await User.create({
    name,
    email,
    profileImage: picture,
    googleId,
    authProviders: { local: false, google: true },
    isEmailVerified: true,
    status: "active",
    lastLoginAt: new Date(),
  });

  return user;
}

/** Forgot password — only meaningful for accounts with local auth enabled. */
export async function requestPasswordReset(email) {
  const user = await User.findOne({ email: email.toLowerCase() });

  // Do not reveal whether the email exists — respond the same way either way.
  if (!user || !user.authProviders.local) {
    return;
  }

  const rawToken = generateOpaqueToken();
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + env.resetTokenExpiryMinutes * 60 * 1000);

  // Invalidate any previous outstanding tokens for this user first.
  await PasswordResetToken.deleteMany({ userId: user._id, usedAt: null });
  await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

  const resetUrl = `${env.frontendUrl}/reset-password/${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);
}

export async function resetPassword({ rawToken, newPassword }) {
  const tokenHash = sha256(rawToken);
  const record = await PasswordResetToken.findOne({ tokenHash });

  if (!record) {
    throw new AppError("Invalid or expired reset link.", 400, "RESET_TOKEN_INVALID");
  }
  if (record.usedAt) {
    throw new AppError("This reset link has already been used.", 400, "RESET_TOKEN_USED");
  }
  if (record.expiresAt < new Date()) {
    throw new AppError("This reset link has expired.", 400, "RESET_TOKEN_EXPIRED");
  }

  const user = await User.findById(record.userId);
  if (!user) {
    throw new AppError("Account not found.", 404, "USER_NOT_FOUND");
  }

  user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.passwordChangedAt = new Date();
  await user.save();

  record.usedAt = new Date();
  await record.save();

  // Invalidate every existing session — force re-login everywhere.
  await revokeAllSessionsForUser(user._id);

  return user;
}

export async function changePassword({ user, currentPassword, newPassword, currentSessionId }) {
  if (!user.authProviders.local) {
    throw new AppError(
      "Your account uses Google Sign-In and has no password to change.",
      400,
      "NO_LOCAL_PASSWORD"
    );
  }

  const fullUser = await User.findById(user._id).select("+passwordHash");
  const isMatch = await bcrypt.compare(currentPassword, fullUser.passwordHash);
  if (!isMatch) {
    throw new AppError("Current password is incorrect.", 401, "INVALID_CURRENT_PASSWORD");
  }

  fullUser.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  fullUser.passwordChangedAt = new Date();
  await fullUser.save();

  // Keep the current session alive, revoke every other one.
  await revokeAllSessionsForUser(fullUser._id, { exceptSessionId: currentSessionId });

  return fullUser;
}
