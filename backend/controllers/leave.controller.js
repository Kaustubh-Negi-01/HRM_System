const leaveService = require('../services/leave.service');
const { sendSuccess, sendError } = require('../utils/response');

const createLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const employeeId = req.user.employeeId;

    if (!leaveType || !startDate || !endDate || !reason) {
      return sendError(res, 'leaveType, startDate, endDate, and reason are required.', 'VALIDATION_ERROR', 400);
    }

    const data = await leaveService.createLeaveRequest({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    });

    return sendSuccess(res, data, 201);
  } catch (error) {
    if (error.code === 'INVALID_DATE_RANGE' || error.code === 'OVERLAPPING_LEAVE_REQUEST') {
      return sendError(res, error.message, error.code, 400);
    }
    next(error);
  }
};

const getMeLeaves = async (req, res, next) => {
  try {
    const data = await leaveService.getMeLeaves(req.user.employeeId);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const { status, department } = req.query;
    const data = await leaveService.getAllLeaves({ status, department });
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getLeaveById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await leaveService.getLeaveById(id);

    // If regular employee, check they own this request
    if (req.user.role !== 'ADMIN' && data.employeeId !== req.user.employeeId) {
      return sendError(res, 'Access denied to this leave request.', 'FORBIDDEN', 403);
    }

    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const data = await leaveService.approveLeave(id, req.user, comment);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

const rejectLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const data = await leaveService.rejectLeave(id, req.user, comment);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return sendError(res, error.message, error.code, 404);
    }
    next(error);
  }
};

module.exports = {
  createLeave,
  getMeLeaves,
  getAllLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave
};
