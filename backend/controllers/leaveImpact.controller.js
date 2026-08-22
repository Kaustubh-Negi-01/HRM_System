const leaveImpactService = require('../services/leaveImpact.service');
const { sendSuccess, sendError } = require('../utils/response');

const getLeaveImpact = async (req, res, next) => {
  try {
    const leaveId = req.params.leaveId || req.params.leaveRequestId;
    const data = await leaveImpactService.calculateLeaveImpact(leaveId);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

const simulateImpact = async (req, res, next) => {
  try {
    const { employeeId, department, startDate, endDate } = req.body;

    if (!employeeId && !department) {
      return sendError(
        res,
        'Provide employeeId or department in the request body to run a simulation.',
        'VALIDATION_ERROR',
        400
      );
    }

    const data = await leaveImpactService.simulateLeaveImpact({
      employeeId,
      department,
      startDate,
      endDate
    });
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND' || error.code === 'VALIDATION_ERROR') {
      return sendError(res, error.message, error.code, error.status || 400);
    }
    next(error);
  }
};

const getCoverage = async (req, res, next) => {
  try {
    const department = req.query.department || req.user.department;
    if (!department) {
      return sendError(res, 'department query parameter is required.', 'VALIDATION_ERROR', 400);
    }
    const data = await leaveImpactService.getDepartmentCoverage(department);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaveImpact,
  simulateImpact,
  getCoverage
};
