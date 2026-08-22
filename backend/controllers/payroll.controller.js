const payrollService = require('../services/payroll.service');
const { sendSuccess, sendError } = require('../utils/response');

const getMePayroll = async (req, res, next) => {
  try {
    const data = await payrollService.getMyPayslips(req.user.employeeId);
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const getAllPayroll = async (req, res, next) => {
  try {
    const { month } = req.query;
    const data = await payrollService.getAllRunRecords(month);
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

const generateCycle = async (req, res, next) => {
  try {
    const { month } = req.body;
    const data = await payrollService.generatePayrollCycle({ month, adminUser: req.user });
    return sendSuccess(
      res,
      { count: data.count, totalDisbursed: data.totalDisbursed, month: data.month, monthLabel: data.monthLabel },
      201
    );
  } catch (error) {
    if (error.code === 'VALIDATION_ERROR') {
      return sendError(res, error.message, error.code, 400);
    }
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const data = await payrollService.getPayrollStats();
    return sendSuccess(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const data = await payrollService.updateRunStatus(id, status);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error.code === 'NOT_FOUND' || error.code === 'VALIDATION_ERROR') {
      return sendError(res, error.message, error.code, error.status || 400);
    }
    next(error);
  }
};

module.exports = {
  getMePayroll,
  getAllPayroll,
  updatePayroll,
  generateCycle,
  getStats,
  updateStatus
};
