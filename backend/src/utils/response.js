export function sendSuccess(res, { statusCode = 200, message = "Success", data = {} } = {}) {
  return res.status(statusCode).json({ success: true, message, data });
}

export function sendError(res, { statusCode = 500, message = "Something went wrong", code = "INTERNAL_ERROR", errors = [] } = {}) {
  return res.status(statusCode).json({ success: false, message, code, errors });
}
