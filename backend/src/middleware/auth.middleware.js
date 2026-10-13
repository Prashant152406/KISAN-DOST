import { User } from "../models/User.model.js";
import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";
import { findActiveSessionByRawToken, touchSession } from "../services/session.service.js";

/**
 * Reads the session cookie, resolves it to an active Session + User,
 * and attaches both to req. This is the SOLE source of truth for identity —
 * nothing from the request body is ever trusted for who the user is.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.[env.cookieName];
    const session = await findActiveSessionByRawToken(rawToken);

    if (!session) {
      return next(new AppError("Not authenticated.", 401, "NOT_AUTHENTICATED"));
    }

    const user = await User.findById(session.userId);
    if (!user || user.status !== "active") {
      return next(new AppError("Not authenticated.", 401, "NOT_AUTHENTICATED"));
    }

    // Fire-and-forget activity timestamp update — doesn't block the request.
    touchSession(session).catch(() => {});

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    next(err);
  }
};

/** Same as requireAuth, but never errors — just leaves req.user unset for guests. */
export const attachUserIfPresent = async (req, res, next) => {
  try {
    const rawToken = req.cookies?.[env.cookieName];
    const session = await findActiveSessionByRawToken(rawToken);
    if (session) {
      const user = await User.findById(session.userId);
      if (user && user.status === "active") {
        req.user = user;
        req.session = session;
      }
    }
    next();
  } catch {
    next();
  }
};

/** Role-based authorization — must run after requireAuth. */
export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to do this.", 403, "FORBIDDEN"));
    }
    next();
  };
