const workforceService = require('../services/workforce.service');
const { sendSuccess } = require('../utils/response');

const getWorkforcePulse = async (req, res, next) => {
  try {
    const { date } = req.query;
    const data = await workforceService.getWorkforcePulse(date);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getWorkforceAlerts = async (req, res, next) => {
  try {
    const data = await workforceService.getWorkforceAlerts();
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getAttendanceTrend = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days || '7', 10);
    const data = await workforceService.getAttendanceTrend(days);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getBurnoutRisks = async (req, res, next) => {
  try {
    const data = await workforceService.getBurnoutRisks();
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getDepartmentStats = async (req, res, next) => {
  try {
    const data = await workforceService.getDepartmentStats();
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkforcePulse,
  getWorkforceAlerts,
  getAttendanceTrend,
  getBurnoutRisks,
  getDepartmentStats
};
