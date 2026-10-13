// Wraps an async controller so any rejected promise is forwarded to
// Express's centralized error middleware instead of crashing the process.
export const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
