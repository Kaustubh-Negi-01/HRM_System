const { sendError } = require('../utils/response');

/**
 * Middleware to require specific roles (e.g. requireRole(['ADMIN']))
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required before checking permissions.', 'UNAUTHORIZED', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        'FORBIDDEN',
        403
      );
    }

    next();
  };
};

module.exports = { requireRole };
