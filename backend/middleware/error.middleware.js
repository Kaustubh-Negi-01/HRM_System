const { sendError } = require('../utils/response');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, messages.join('. '), 'VALIDATION_ERROR', 400);
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `A record with this ${field} already exists.`, 'DUPLICATE_RESOURCE', 409);
  }

  // CastError (invalid ObjectId or type)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid resource identifier: ${err.value}`, 'INVALID_ID', 400);
  }

  // Fallback internal error
  const message = env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message;
  return sendError(res, message, 'INTERNAL_SERVER_ERROR', 500);
};

module.exports = { errorHandler };
