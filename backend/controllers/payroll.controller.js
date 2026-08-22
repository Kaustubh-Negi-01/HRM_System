const payrollService = require('../services/payroll.service');
const { sendSuccess, sendError } = require('../utils/response');

const getMePayroll = async (req, res, next) => {
  try {
    const data = await payrollService.getMePayroll(req.user.employeeId);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getAllPayroll = async (req, res, next) => {
  try {
    const data = await payrollService.getAllPayroll();
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const updatePayroll = async (req, res, next) => {
  try {
    const { employeeId } = req.params;
    const { basicSalary, allowances, deductions } = req.body;

    if (basicSalary !== undefined && isNaN(Number(basicSalary))) {
      return sendError(res, 'basicSalary must be a valid number.', 'VALIDATION_ERROR', 400);
    }
    if (allowances !== undefined && isNaN(Number(allowances))) {
      return sendError(res, 'allowances must be a valid number.', 'VALIDATION_ERROR', 400);
    }
    if (deductions !== undefined && isNaN(Number(deductions))) {
      return sendError(res, 'deductions must be a valid number.', 'VALIDATION_ERROR', 400);
    }

    const data = await payrollService.updatePayroll(employeeId, {
      basicSalary,
      allowances,
      deductions
    });

    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMePayroll,
  getAllPayroll,
  updatePayroll
};
