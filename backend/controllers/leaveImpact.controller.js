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

module.exports = {
  getLeaveImpact
};
