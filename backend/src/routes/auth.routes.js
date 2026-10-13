import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { authLimiter, otpLimiter, passwordResetLimiter } from "../middleware/rateLimit.middleware.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  googleAuthSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../validators/auth.validator.js";

const router = Router();

// --- Registration / email verification ---
router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.post("/verify-email", otpLimiter, validate(verifyOtpSchema), authController.verifyEmail);
router.post("/resend-otp", otpLimiter, validate(resendOtpSchema), authController.resendOtp);

// --- Login ---
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/google", authLimiter, validate(googleAuthSchema), authController.googleAuth);

// --- Logout ---
router.post("/logout", requireAuth, authController.logout);
router.post("/logout-all", requireAuth, authController.logoutAll);

// --- Current user / sessions ---
router.get("/me", requireAuth, authController.me);
router.get("/sessions", requireAuth, authController.getSessions);
router.delete("/sessions/:id", requireAuth, authController.revokeSession);

// --- Password management ---
router.post(
  "/forgot-password",
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.patch(
  "/change-password",
  requireAuth,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
