export class AppError extends Error {
  /**
   * @param {string} message  Human-readable message safe to show to users
   * @param {number} statusCode  HTTP status code
   * @param {string} code  Machine-readable error code for the frontend
   * @param {any[]} errors  Optional array of field-level validation errors
   */
  constructor(message, statusCode = 400, code = "BAD_REQUEST", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
