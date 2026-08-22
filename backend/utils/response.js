/**
 * Uniform Success and Error response formatters
 */

const sendSuccess = (res, data = {}, statusCode = 200, meta = null) => {
  const response = {
    success: true,
    data
  };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'An unexpected error occurred.', code = 'INTERNAL_ERROR', statusCode = 500, details = null) => {
  const errorObj = {
    code,
    message
  };
  if (details) {
    errorObj.details = details;
  }
  return res.status(statusCode).json({
    success: false,
    error: errorObj
  });
};

module.exports = {
  sendSuccess,
  sendError
};
