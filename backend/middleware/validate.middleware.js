const { sendError } = require('../utils/response');

/**
 * Higher-order middleware to run a validation function against req.body
 */
const validateBody = (validatorFn) => {
  return (req, res, next) => {
    const error = validatorFn(req.body);
    if (error) {
      return sendError(res, error.message, error.code || 'VALIDATION_ERROR', 400);
    }
    next();
  };
};

module.exports = { validateBody };
