import { UAParser } from "ua-parser-js";
import { Session } from "../models/Session.model.js";
import { env } from "../config/env.js";
import { generateOpaqueToken, sha256 } from "../utils/crypto.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd, // HTTPS only in production
    sameSite: env.isProd ? "none" : "lax",
    maxAge: env.sessionTtlDays * DAY_MS,
    path: "/",
  };
}

/**
 * Create a new session for a user (i.e. one browser/device logging in).
 * Returns the RAW token — this is the only time it ever exists outside the cookie.
 */
export async function createSession(user, req) {
  const rawToken = generateOpaqueToken();
  const sessionTokenHash = sha256(rawToken);

  const parser = new UAParser(req.headers["user-agent"]);
  const uaResult = parser.getResult();

  await Session.create({
    userId: user._id,
    sessionTokenHash,
    deviceInfo: uaResult.device.model || uaResult.os.name || "Unknown device",
    browser: uaResult.browser.name || "Unknown browser",
    os: uaResult.os.name || "Unknown OS",
    userAgent: req.headers["user-agent"],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + env.sessionTtlDays * DAY_MS),
  });

  return rawToken;
}

/** Look up an active (non-revoked, non-expired) session from a raw cookie token. */
export async function findActiveSessionByRawToken(rawToken) {
  if (!rawToken) return null;
  const sessionTokenHash = sha256(rawToken);
  const session = await Session.findOne({
    sessionTokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
  return session;
}

export async function touchSession(session) {
  session.lastActiveAt = new Date();
  await session.save();
}

export async function revokeSessionByRawToken(rawToken) {
  const sessionTokenHash = sha256(rawToken);
  await Session.updateOne(
    { sessionTokenHash, revokedAt: null },
    { revokedAt: new Date() }
  );
}

export async function revokeAllSessionsForUser(userId, { exceptSessionId = null } = {}) {
  const filter = { userId, revokedAt: null };
  if (exceptSessionId) filter._id = { $ne: exceptSessionId };
  await Session.updateMany(filter, { revokedAt: new Date() });
}

export async function listActiveSessions(userId) {
  return Session.find({
    userId,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).sort({ lastActiveAt: -1 });
}
