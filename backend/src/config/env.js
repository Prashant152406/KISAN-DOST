import "dotenv/config";

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,

  mongoUri: required("MONGO_URI"),

  sessionSecret: required("SESSION_SECRET"),
  cookieName: process.env.COOKIE_NAME || "session_token",
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS) || 30,

  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  emailHost: process.env.EMAIL_HOST,
  emailPort: Number(process.env.EMAIL_PORT) || 587,
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailFrom: process.env.EMAIL_FROM || "no-reply@farmermarketplace.com",

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES) || 10,
  otpMaxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 5,
  otpResendCooldownSeconds: Number(process.env.OTP_RESEND_COOLDOWN_SECONDS) || 60,
  otpMaxResendsPerWindow: Number(process.env.OTP_MAX_RESENDS_PER_WINDOW) || 5,
  pendingAccountTtlHours: Number(process.env.PENDING_ACCOUNT_TTL_HOURS) || 24,
  resetTokenExpiryMinutes: Number(process.env.RESET_TOKEN_EXPIRY_MINUTES) || 30,

  razorpayKeyId: process.env.RAZORPAY_KEY_ID || null,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || null,

  defaultShippingFee: Number(process.env.DEFAULT_SHIPPING_FEE) || 49,
  freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD) || 999,
  taxRatePercent: Number(process.env.TAX_RATE_PERCENT) || 0,
};
