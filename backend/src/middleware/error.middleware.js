import { AppError } from "../utils/AppError.js";
import { env } from "../config/env.js";

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404, "ROUTE_NOT_FOUND"));
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let code = err.code || "INTERNAL_ERROR";
  let errors = err.errors || [];

  // Mongoose duplicate key (e.g. race condition on unique email)
  if (err.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_KEY";
    message = "A record with this value already exists.";
  }

  // Mongoose cast errors (malformed ObjectId, etc.)
  if (err.name === "CastError") {
    statusCode = 400;
    code = "INVALID_ID";
    message = "Invalid identifier provided.";
  }

  if (!err.isOperational) {
    // Unexpected/programmer errors: log full detail server-side only,
    // never leak stack traces or internals to the client.
    console.error("[unhandled error]", err);
    if (env.isProd) message = "Something went wrong. Please try again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    errors,
    ...(env.isProd ? {} : { stack: err.stack }),
  });
};
