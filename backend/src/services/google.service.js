import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const client = new OAuth2Client(env.googleClientId);

/**
 * Verify a Google ID token (sent from the frontend's Google Sign-In button)
 * and return the trusted payload. Never trust a decoded-but-unverified JWT.
 */
export async function verifyGoogleIdToken(idToken) {
  if (!idToken) {
    throw new AppError("Google credential is missing.", 400, "GOOGLE_TOKEN_MISSING");
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload?.email_verified) {
      throw new AppError(
        "Google account email is not verified.",
        400,
        "GOOGLE_EMAIL_NOT_VERIFIED"
      );
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name,
      picture: payload.picture,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError("Invalid Google credential.", 401, "GOOGLE_TOKEN_INVALID");
  }
}
