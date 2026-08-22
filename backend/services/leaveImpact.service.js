const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { LEAVE_STATUS } = require('../utils/constants');
const { dateRangesOverlap, safePercentage, getDaysBetween } = require('../utils/calculations');
const { evaluateLeaveImpactRisk } = require('../utils/riskEngine');
const { mapRiskLevel, mapLeaveType: mapDialectType } = require('../utils/dialect');

/**
 * Core coverage math shared by real and hypothetical impact calculations.
 */
const computeImpact = async ({ department, applicantName, startDate, endDate, excludeLeaveId = null }) => {
  const teamMembers = await User.find({ department });
  const teamSize = teamMembers.length || 1;
  const teamEmployeeIds = teamMembers.map((m) => m.employeeId);
  const teamUserMap = new Map(teamMembers.map((m) => [m.employeeId, m]));

  // Find all leaves in this department overlapping the window
  const departmentLeaves = await LeaveRequest.find({
    employeeId: { $in: teamEmployeeIds },
    status: { $in: [LEAVE_STATUS.APPROVED, LEAVE_STATUS.PENDING] }
  });

  const overlappingLeaves = departmentLeaves.filter(
    (l) =>
      (!excludeLeaveId || String(l._id) !== String(excludeLeaveId)) &&
      dateRangesOverlap(startDate, endDate, l.startDate, l.endDate)
  );

  const approvedOverlaps = overlappingLeaves.filter((l) => l.status === LEAVE_STATUS.APPROVED);
  const pendingOverlaps = overlappingLeaves.filter((l) => l.status === LEAVE_STATUS.PENDING);

  const alreadyUnavailableCount = new Set(approvedOverlaps.map((l) => l.employeeId)).size;

  const currentAvailable = Math.max(0, teamSize - alreadyUnavailableCount);
  const currentCoverage = safePercentage(currentAvailable, teamSize);

  const projectedUnavailableCount = Math.min(teamSize, alreadyUnavailableCount + 1);
  const projectedAvailable = Math.max(0, teamSize - projectedUnavailableCount);
  const projectedCoverage = safePercentage(projectedAvailable, teamSize);

  const { riskLevel, reason } = evaluateLeaveImpactRisk({
    department,
    teamSize,
    currentCoverage,
    projectedCoverage,
    overlappingLeaves: overlappingLeaves.length
  });

  const overlappingLeaveDetails = overlappingLeaves.map((l) => {
    const u = teamUserMap.get(l.employeeId);
    return {
      leaveId: l._id,
      employeeId: l.employeeId,
      employeeName: u ? u.name : l.employeeId,
      leaveType: mapDialectType(l.leaveType),
      startDate: l.startDate,
      endDate: l.endDate,
      status: String(l.status || '').toLowerCase()
    };
  });

  const coverageDrop = Math.max(0, currentCoverage - projectedCoverage);

  let recommendation = 'Approval is safe. Department maintains healthy coverage.';
  if (riskLevel === 'HIGH') {
    recommendation = `Reject or reschedule leave: approval drops ${department} coverage to ${projectedCoverage}%, below the critical operational threshold.`;
  } else if (riskLevel === 'MEDIUM') {
    recommendation = `Caution advised: approval lowers ${department} coverage to ${projectedCoverage}%. Ensure shift handovers are coordinated.`;
  }

  return {
    department,
    applicantName,
    teamSize,
    currentAvailable,
    projectedAvailable,
    currentCoverage,
    projectedCoverage,
    coverageDrop,
    unavailableCount: alreadyUnavailableCount,
    alreadyUnavailable: alreadyUnavailableCount,
    overlappingLeaves: overlappingLeaves.length,
    approvedOverlapsCount: approvedOverlaps.length,
    pendingOverlapsCount: pendingOverlaps.length,
    riskLevel,
    reason,
    recommendation,
    overlappingLeaveDetails
  };
};

/**
 * Calculate the projected staffing impact of approving a specific leave request
 */
const calculateLeaveImpact = async (leaveRequestId) => {
  const leave = await LeaveRequest.findById(leaveRequestId);
  if (!leave) {
    const err = new Error('Leave request not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const applicant = await User.findOne({ employeeId: leave.employeeId });
  const department = applicant ? applicant.department : 'General';

  const core = await computeImpact({
    department,
    applicantName: applicant ? applicant.name : leave.employeeId,
    startDate: leave.startDate,
    endDate: leave.endDate,
    excludeLeaveId: leave._id
  });

  return {
    leaveId: leave._id,
    leaveRequestId: leave._id,
    employee: core.applicantName,
    employeeName: core.applicantName,
    employeeId: leave.employeeId,
    team: core.department,
    department: core.department,
    leaveType: mapDialectType(leave.leaveType),
    startDate: leave.startDate,
    endDate: leave.endDate,
    days: getDaysBetween(leave.startDate, leave.endDate),
    reason: leave.reason,
    ...core,
    riskLevel: mapRiskLevel(core.riskLevel),
    riskReasons: [core.reason],
    impactSummary: core.reason
  };
};

/**
 * Hypothetical simulation — no leave request needs to exist yet.
 * Accepts { employeeId } OR { department }, plus optional startDate/endDate.
 */
const simulateLeaveImpact = async ({ employeeId, department, startDate, endDate }) => {
  let dept = department;
  let applicantName = null;

  if (employeeId) {
    const applicant = await User.findOne({ employeeId: String(employeeId).toUpperCase() });
    if (!applicant) {
      const err = new Error('Employee not found.');
      err.code = 'NOT_FOUND';
      err.status = 404;
      throw err;
    }
    dept = applicant.department;
    applicantName = applicant.name;
  }

  if (!dept) {
    const err = new Error('Provide either employeeId or department to simulate.');
    err.code = 'VALIDATION_ERROR';
    err.status = 400;
    throw err;
  }

  // Default window: next week, 3 days
  const start = startDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const end =
    endDate || new Date(new Date(start).getTime() + 2 * 86400000).toISOString().split('T')[0];

  const core = await computeImpact({
    department: dept,
    applicantName: applicantName || `Simulated employee (${dept})`,
    startDate: start,
    endDate: end
  });

  return {
    simulationId: `sim_${Date.now()}`,
    simulated: true,
    employeeName: core.applicantName,
    department: core.department,
    dates: `${start} to ${end} (${getDaysBetween(start, end)} days)`,
    startDate: start,
    endDate: end,
    days: getDaysBetween(start, end),
    ...core,
    riskLevel: mapRiskLevel(core.riskLevel)
  };
};

/**
 * Current staffing coverage snapshot for a department.
 */
const getDepartmentCoverage = async (department) => {
  const teamMembers = await User.find({ department });
  const teamSize = teamMembers.length || 0;
  const today = new Date().toISOString().split('T')[0];

  const approvedToday = await LeaveRequest.find({
    employeeId: { $in: teamMembers.map((m) => m.employeeId) },
    status: LEAVE_STATUS.APPROVED,
    startDate: { $lte: today },
    endDate: { $gte: today }
  });

  const unavailable = new Set(approvedToday.map((l) => l.employeeId)).size;
  const available = Math.max(0, teamSize - unavailable);
  const coverage = safePercentage(available, teamSize);

  return {
    department,
    teamSize,
    availableToday: available,
    onLeaveToday: unavailable,
    coveragePercentage: coverage,
    minimumRequiredPercent: 75,
    isUnderStaffed: coverage < 75
  };
};

module.exports = {
  calculateLeaveImpact,
  simulateLeaveImpact,
  getDepartmentCoverage
};
