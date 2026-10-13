import { AppError } from "../utils/AppError.js";

/**
 * Wraps a Zod schema into Express middleware.
 * On failure, responds with 422 and a field-level error array —
 * never leaks Zod's internal error shape directly.
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return next(
      new AppError("Validation failed", 422, "VALIDATION_ERROR", errors)
    );
  }

  req.body = result.data;
  next();
};
