const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication token is required.', 'UNAUTHORIZED', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return sendError(res, 'Authentication token is invalid.', 'UNAUTHORIZED', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 'The user belonging to this token no longer exists.', 'UNAUTHORIZED', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired or invalid token. Please log in again.', 'INVALID_TOKEN', 401);
    }
    return next(error);
  }
};

module.exports = { authenticate };
