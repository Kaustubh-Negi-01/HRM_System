const Payroll = require('../models/Payroll');
const PayrollRun = require('../models/PayrollRun');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const { ATTENDANCE_STATUS, LEAVE_STATUS } = require('../utils/constants');

const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthLabel = (monthStr) => {
  const [year, m] = String(monthStr).split('-').map(Number);
  return `${MONTH_LABELS[(m || 1) - 1]} ${year}`;
};

/** Weekday count (Mon-Fri) for a YYYY-MM month */
const workingDaysInMonth = (monthStr) => {
  const [year, m] = String(monthStr).split('-').map(Number);
  const days = new Date(year, m, 0).getDate();
  let count = 0;
  for (let d = 1; d <= days; d++) {
    const day = new Date(year, m - 1, d).getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
};

const getMePayroll = async (employeeId) => {
  let payroll = await Payroll.findOne({ employeeId });
  if (!payroll) {
    // If none exists, create default
    payroll = await Payroll.create({
      employeeId,
      basicSalary: 50000,
      allowances: 5000,
      deductions: 2000
    });
  }
  return payroll;
};

const getAllPayroll = async () => {
  const users = await User.find();
  const employeeIds = users.map((u) => u.employeeId);

  const payrolls = await Payroll.find({ employeeId: { $in: employeeIds } });
  const profiles = await EmployeeProfile.find({ employeeId: { $in: employeeIds } });

  const payrollMap = new Map(payrolls.map((p) => [p.employeeId, p]));
  const profileMap = new Map(profiles.map((p) => [p.employeeId, p]));

  return users.map((u) => {
    let p = payrollMap.get(u.employeeId);
    const prof = profileMap.get(u.employeeId);
    return {
      id: u._id,
      employeeId: u.employeeId,
      name: u.name,
      employeeName: u.name,
      department: u.department,
      designation: prof ? prof.designation : 'Associate',
      basicSalary: p ? p.basicSalary : 50000,
      bonuses: 0,
      allowances: p ? p.allowances : 5000,
      deductions: p ? p.deductions : 2000,
      netSalary: p ? p.netSalary : 53000,
      month: monthLabel(new Date().toISOString().slice(0, 7)),
      status: 'draft',
      updatedAt: p ? p.updatedAt : u.createdAt
    };
  });
};

const updatePayroll = async (employeeId, { basicSalary, allowances, deductions }) => {
  let payroll = await Payroll.findOne({ employeeId: employeeId.toUpperCase() });

  if (!payroll) {
    payroll = new Payroll({ employeeId: employeeId.toUpperCase() });
  }

  if (basicSalary !== undefined) payroll.basicSalary = Number(basicSalary);
  if (allowances !== undefined) payroll.allowances = Number(allowances);
  if (deductions !== undefined) payroll.deductions = Number(deductions);

  await payroll.save();
  return payroll;
};

/**
 * Generate a monthly payroll cycle for every employee.
 * Deductions are derived from REAL attendance: unpaid-leave days and
 * unapproved-absence days reduce net pay by the employee's daily rate.
 */
const generatePayrollCycle = async ({ month, adminUser }) => {
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(targetMonth)) {
    const err = new Error('month must be in YYYY-MM format.');
    err.code = 'VALIDATION_ERROR';
    err.status = 400;
    throw err;
  }

  const workDays = workingDaysInMonth(targetMonth);
  const users = await User.find({ role: { $ne: 'ADMIN' } });

  const results = [];
  let totalDisbursed = 0;

  for (const user of users) {
    const config =
      (await Payroll.findOne({ employeeId: user.employeeId })) ||
      { basicSalary: 50000, allowances: 5000, deductions: 2000 };

    const dailyRate = workDays > 0 ? config.basicSalary / workDays : 0;

    // Absent days recorded in attendance for this month
    const monthPrefix = `${targetMonth}-`;
    const records = await Attendance.find({
      employeeId: user.employeeId,
      date: { $regex: `^${monthPrefix}` }
    });
    const absentDays = records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;

    // Approved UNPAID leave days overlapping this month
    const unpaidLeaves = await LeaveRequest.find({
      employeeId: user.employeeId,
      status: LEAVE_STATUS.APPROVED,
      leaveType: 'UNPAID',
      startDate: { $lte: `${targetMonth}-31` },
      endDate: { $gte: `${targetMonth}-01` }
    });
    let unpaidDays = 0;
    unpaidLeaves.forEach((l) => {
      const s = new Date(l.startDate < `${targetMonth}-01` ? `${targetMonth}-01` : l.startDate);
      const e = new Date(l.endDate > `${targetMonth}-31` ? `${targetMonth}-31` : l.endDate);
      unpaidDays += Math.round((e - s) / 86400000) + 1;
    });

    const existingOtherDeductions = config.deductions || 0;

    let run = await PayrollRun.findOne({ employeeId: user.employeeId, month: targetMonth });
    if (!run) {
      run = new PayrollRun({ employeeId: user.employeeId, month: targetMonth });
    }

    run.baseSalary = config.basicSalary;
    run.allowances = config.allowances || 0;
    run.bonus = 0;
    run.otherDeductions = existingOtherDeductions;
    run.absentDeduction = Number((absentDays * dailyRate).toFixed(2));
    run.unpaidLeaveDeduction = Number((unpaidDays * dailyRate).toFixed(2));
    run.workingDays = workDays;
    run.paidDays = Math.max(0, workDays - absentDays - unpaidDays);
    run.generatedBy = adminUser ? adminUser.name || adminUser.employeeId : 'system';
    run.status = 'PROCESSING';

    await run.save();
    totalDisbursed += run.netSalary;
    results.push(run);
  }

  return {
    month: targetMonth,
    monthLabel: monthLabel(targetMonth),
    count: results.length,
    totalDisbursed: Number(totalDisbursed.toFixed(2)),
    runs: results
  };
};

/**
 * Aggregate payroll stats for the admin dashboard.
 */
const getPayrollStats = async () => {
  const latestRun = await PayrollRun.findOne().sort({ createdAt: -1 });
  const month = latestRun ? latestRun.month : new Date().toISOString().slice(0, 7);

  const runs = await PayrollRun.find({ month });
  const configs = await Payroll.find();

  const source = runs.length > 0 ? runs : null;
  const totalMonthlyPayout = source
    ? source.reduce((s, r) => s + (r.netSalary || 0), 0)
    : configs.reduce((s, c) => s + (c.netSalary || 0), 0);
  const headcount = source ? source.length : configs.length;
  const averageSalary = headcount ? Math.round(totalMonthlyPayout / headcount) : 0;
  const taxDeductionsTotal = source
    ? source.reduce((s, r) => s + (r.taxes || 0), 0)
    : Math.round(totalMonthlyPayout * 0.1);

  return {
    month,
    monthLabel: monthLabel(month),
    totalMonthlyPayout: Number(totalMonthlyPayout.toFixed(2)),
    averageSalary,
    totalEmployeesProcessed: headcount,
    pendingApprovalsCount: source
      ? source.filter((r) => r.status === 'PROCESSING').length
      : 0,
    taxDeductionsTotal: Number(taxDeductionsTotal.toFixed(2)),
    isLiveCycle: Boolean(source && source.length > 0)
  };
};

/**
 * Payslip history for one employee (frontend dialect shape).
 */
const getMyPayslips = async (employeeId) => {
  const runs = await PayrollRun.find({ employeeId }).sort({ month: -1 });

  if (runs.length > 0) {
    return runs.map((r) => ({
      id: r.id,
      month: monthLabel(r.month),
      monthKey: r.month,
      payDate: `${r.month}-28`,
      baseSalary: r.baseSalary,
      allowances: r.allowances,
      bonus: r.bonus || 0,
      grossSalary: r.grossSalary,
      deductions: Number(
        ((r.unpaidLeaveDeduction || 0) + (r.absentDeduction || 0) + (r.otherDeductions || 0)).toFixed(2)
      ),
      taxes: r.taxes,
      netSalary: r.netSalary,
      status: String(r.status).toLowerCase()
    }));
  }

  // Fallback: current configuration as a single draft payslip
  const config = await getMePayroll(employeeId);
  const now = new Date();
  return [
    {
      id: config.id,
      month: monthLabel(now.toISOString().slice(0, 7)),
      monthKey: now.toISOString().slice(0, 7),
      payDate: null,
      baseSalary: config.basicSalary,
      allowances: config.allowances,
      bonus: 0,
      grossSalary: config.basicSalary + config.allowances,
      deductions: config.deductions,
      taxes: 0,
      netSalary: config.netSalary,
      status: 'draft'
    }
  ];
};

/**
 * All payroll records for a month (admin view).
 */
const getAllRunRecords = async (month) => {
  const targetMonth = month || new Date().toISOString().slice(0, 7);
  const runs = await PayrollRun.find({ month: targetMonth });

  if (runs.length === 0) {
    return getAllPayroll(); // config-based fallback
  }

  const users = await User.find();
  const profiles = await EmployeeProfile.find();
  const userMap = new Map(users.map((u) => [u.employeeId, u]));
  const profileMap = new Map(profiles.map((p) => [p.employeeId, p]));

  return runs.map((r) => {
    const u = userMap.get(r.employeeId);
    const prof = profileMap.get(r.employeeId);
    return {
      id: r.id,
      employeeId: r.employeeId,
      employeeName: u ? u.name : r.employeeId,
      name: u ? u.name : r.employeeId,
      department: u ? u.department : 'General',
      designation: prof ? prof.designation : 'Associate',
      month: monthLabel(r.month),
      monthKey: r.month,
      baseSalary: r.baseSalary,
      bonuses: r.bonus || 0,
      deductions: Number(
        ((r.unpaidLeaveDeduction || 0) + (r.absentDeduction || 0) + (r.otherDeductions || 0)).toFixed(2)
      ),
      netSalary: r.netSalary,
      status: String(r.status).toLowerCase()
    };
  });
};

const updateRunStatus = async (id, status) => {
  const run = await PayrollRun.findById(id);
  if (!run) {
    const err = new Error('Payroll record not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }
  const normalized = String(status || '').toUpperCase();
  if (!['DRAFT', 'PROCESSING', 'PAID', 'FAILED'].includes(normalized)) {
    const err = new Error('status must be one of DRAFT, PROCESSING, PAID, FAILED.');
    err.code = 'VALIDATION_ERROR';
    err.status = 400;
    throw err;
  }
  run.status = normalized;
  await run.save();
  return run;
};

module.exports = {
  getMePayroll,
  getAllPayroll,
  updatePayroll,
  generatePayrollCycle,
  getPayrollStats,
  getMyPayslips,
  getAllRunRecords,
  updateRunStatus
};
