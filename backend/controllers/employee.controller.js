const employeeService = require('../services/employee.service');
const { sendSuccess, sendError } = require('../utils/response');

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
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getEmployeeProfile
};
