const employeeService = require('../services/employee.service');
const authService = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response');

const createEmployee = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role, department, designation, phone, address } =
      req.body;

    if (!employeeId || !name || !email || !password || !department) {
      return sendError(
        res,
        'employeeId, name, email, password, and department are required.',
        'VALIDATION_ERROR',
        400
      );
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

const getOwnProfile = async (req, res, next) => {
  try {
    const data = await employeeService.getEmployeeProfile(req.user.employeeId);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const { department, role } = req.query;
    const data = await employeeService.getAllEmployees({ department, role });
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await employeeService.getEmployeeById(id);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check authorization: Employee can only update own profile unless admin
    if (req.user.role !== 'ADMIN' && req.user._id.toString() !== id && req.user.employeeId !== id.toUpperCase()) {
      return sendError(res, 'You are not authorized to update another employee record.', 'FORBIDDEN', 403);
    }

    const data = await employeeService.updateEmployee(id, req.body);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

const getEmployeeProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await employeeService.getEmployeeProfile(id);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

module.exports = {
  createEmployee,
  getOwnProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getEmployeeProfile
};
