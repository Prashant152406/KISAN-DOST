import rateLimit from "express-rate-limit";

const jsonHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many requests. Please try again later.",
    code: "RATE_LIMITED",
    errors: [],
  });
};

// General login/register abuse protection
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

// Tighter limit specifically for OTP-related endpoints (brute force / spam)
export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});

// Password reset requests — prevent email-bombing an inbox
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: jsonHandler,
});
