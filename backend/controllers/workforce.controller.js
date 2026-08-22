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

module.exports = {
  getWorkforcePulse,
  getWorkforceAlerts,
  getAttendanceTrend
};
