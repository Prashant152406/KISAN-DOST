import { catchAsync } from "../utils/catchAsync.js";
import { sendSuccess } from "../utils/response.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import * as authService from "../services/auth.service.js";
import * as otpService from "../services/otp.service.js";
import * as googleService from "../services/google.service.js";
import * as sessionService from "../services/session.service.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
    role: user.role,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    authProviders: user.authProviders,
    createdAt: user.createdAt,
  };
}

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.registerLocal({ name, email, password });

  return sendSuccess(res, {
    statusCode: 201,
    message: "Registration successful. Please check your email for a verification code.",
    data: { email: user.email },
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  const user = await authService.findPendingUserByEmail(email);

  await otpService.verifyOtp(user._id, otp);
  await authService.activateUser(user);

  const rawToken = await sessionService.createSession(user, req);
  res.cookie(env.cookieName, rawToken, sessionService.cookieOptions());

  return sendSuccess(res, {
    message: "Email verified successfully.",
    data: { user: publicUser(user) },
  });
});

export const resendOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await authService.findPendingUserByEmail(email);

  await otpService.issueOtp(user, { isResend: true });

  return sendSuccess(res, { message: "A new verification code has been sent." });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginLocal({ email, password });

  const rawToken = await sessionService.createSession(user, req);
  res.cookie(env.cookieName, rawToken, sessionService.cookieOptions());

  return sendSuccess(res, {
    message: "Logged in successfully.",
    data: { user: publicUser(user) },
  });
});

export const googleAuth = catchAsync(async (req, res) => {
  const { credential } = req.body;
  const googlePayload = await googleService.verifyGoogleIdToken(credential);

  const user = await authService.loginOrRegisterWithGoogle(googlePayload);

  const rawToken = await sessionService.createSession(user, req);
  res.cookie(env.cookieName, rawToken, sessionService.cookieOptions());

  return sendSuccess(res, {
    message: "Logged in with Google successfully.",
    data: { user: publicUser(user) },
  });
});

export const logout = catchAsync(async (req, res) => {
  const rawToken = req.cookies?.[env.cookieName];
  if (rawToken) {
    await sessionService.revokeSessionByRawToken(rawToken);
  }
  res.clearCookie(env.cookieName, { path: "/" });
  return sendSuccess(res, { message: "Logged out successfully." });
});

export const logoutAll = catchAsync(async (req, res) => {
  await sessionService.revokeAllSessionsForUser(req.user._id);
  res.clearCookie(env.cookieName, { path: "/" });
  return sendSuccess(res, { message: "Logged out from all devices." });
});

export const me = catchAsync(async (req, res) => {
  return sendSuccess(res, { data: { user: publicUser(req.user) } });
});

export const getSessions = catchAsync(async (req, res) => {
  const sessions = await sessionService.listActiveSessions(req.user._id);
  const data = sessions.map((s) => ({
    id: s._id,
    deviceInfo: s.deviceInfo,
    browser: s.browser,
    os: s.os,
    ipAddress: s.ipAddress,
    lastActiveAt: s.lastActiveAt,
    createdAt: s.createdAt,
    isCurrent: String(s._id) === String(req.session._id),
  }));
  return sendSuccess(res, { data: { sessions: data } });
});

export const revokeSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Session } = await import("../models/Session.model.js");
  const session = await Session.findOne({ _id: id, userId: req.user._id });

  if (!session) {
    throw new AppError("Session not found.", 404, "SESSION_NOT_FOUND");
  }

  session.revokedAt = new Date();
  await session.save();

  return sendSuccess(res, { message: "Session revoked." });
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.requestPasswordReset(email);

  // Always the same response, whether or not the account exists —
  // this prevents attackers from using this endpoint to enumerate emails.
  return sendSuccess(res, {
    message: "If an account exists for this email, a reset link has been sent.",
  });
});

export const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword({ rawToken: token, newPassword });

  return sendSuccess(res, {
    message: "Password reset successfully. Please log in with your new password.",
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword({
    user: req.user,
    currentPassword,
    newPassword,
    currentSessionId: req.session._id,
  });

  return sendSuccess(res, {
    message: "Password changed successfully. You have been logged out of other devices.",
  });
});
