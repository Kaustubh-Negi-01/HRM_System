const attendanceService = require('../services/attendance.service');
const { sendSuccess, sendError } = require('../utils/response');

const checkIn = async (req, res, next) => {
  try {
    const { date } = req.body;
    const employeeId = req.user.employeeId;
    const data = await attendanceService.checkIn(employeeId, date);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'ALREADY_CHECKED_IN') {
      return sendError(res, error.message, error.code, 400);
    }
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const { date } = req.body;
    const employeeId = req.user.employeeId;
    const data = await attendanceService.checkOut(employeeId, date);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_CHECKED_IN' || error.code === 'ALREADY_CHECKED_OUT') {
      return sendError(res, error.message, error.code, 400);
    }
    next(error);
  }
};

const getMeAttendance = async (req, res, next) => {
  try {
    const { limit, startDate, endDate } = req.query;
    const employeeId = req.user.employeeId;
    const data = await attendanceService.getMeAttendance(employeeId, { limit, startDate, endDate });
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getTeamAttendance = async (req, res, next) => {
  try {
    const department = req.query.department || req.user.department;
    const { date } = req.query;
    const data = await attendanceService.getTeamAttendance(department, date);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getTodayAttendance = async (req, res, next) => {
  try {
    const { date } = req.query;
    const data = await attendanceService.getTodayAttendance(date);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIn,
  checkOut,
  getMeAttendance,
  getTeamAttendance,
  getTodayAttendance
};
