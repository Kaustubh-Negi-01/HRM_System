const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');

const signup = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role, department, designation, phone, address } = req.body;

    if (!employeeId || !name || !email || !password || !department) {
      return sendError(res, 'employeeId, name, email, password, and department are required.', 'VALIDATION_ERROR', 400);
    }

    if (password.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long.', 'VALIDATION_ERROR', 400);
    }

    const data = await authService.signup({
      employeeId,
      name,
      email,
      password,
      role,
      department,
      designation,
      phone,
      address
    });

    return sendSuccess(res, data, 201);
  } catch (error) {
    if (error.code === 'DUPLICATE_RESOURCE') {
      return sendError(res, error.message, error.code, 409);
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 'VALIDATION_ERROR', 400);
    }

    const data = await authService.login({ email, password });
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'INVALID_CREDENTIALS') {
      return sendError(res, error.message, error.code, 401);
    }
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const data = await authService.getMe(req.user._id);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getMe
};
