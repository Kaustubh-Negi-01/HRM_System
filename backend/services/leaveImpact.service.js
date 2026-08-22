const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { LEAVE_STATUS } = require('../utils/constants');
const { dateRangesOverlap, safePercentage } = require('../utils/calculations');
const { evaluateLeaveImpactRisk } = require('../utils/riskEngine');

/**
 * Calculate the projected staffing impact of approving a specific leave request
 * @param {string} leaveRequestId
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

  // Find all team members in the same department
  const teamMembers = await User.find({ department });
  const teamSize = teamMembers.length || 1;
  const teamEmployeeIds = teamMembers.map((m) => m.employeeId);
  const teamUserMap = new Map(teamMembers.map((m) => [m.employeeId, m]));

  // Find all leaves in this department
  const departmentLeaves = await LeaveRequest.find({
    employeeId: { $in: teamEmployeeIds },
    _id: { $ne: leave._id },
    status: { $in: [LEAVE_STATUS.APPROVED, LEAVE_STATUS.PENDING] }
  });

  // Filter overlapping leaves
  const overlappingLeaves = departmentLeaves.filter((l) =>
    dateRangesOverlap(leave.startDate, leave.endDate, l.startDate, l.endDate)
  );

  const approvedOverlaps = overlappingLeaves.filter((l) => l.status === LEAVE_STATUS.APPROVED);
  const pendingOverlaps = overlappingLeaves.filter((l) => l.status === LEAVE_STATUS.PENDING);

  // Distinct approved unavailable team members
  const alreadyUnavailableCount = new Set(approvedOverlaps.map((l) => l.employeeId)).size;

  // Current coverage before this leave is approved
  const currentAvailable = Math.max(0, teamSize - alreadyUnavailableCount);
  const currentCoverage = safePercentage(currentAvailable, teamSize);

  // Projected coverage if this leave is approved
  // (applicant becomes unavailable + already approved unavailable)
  const projectedUnavailableCount = Math.min(teamSize, alreadyUnavailableCount + 1);
  const projectedAvailable = Math.max(0, teamSize - projectedUnavailableCount);
  const projectedCoverage = safePercentage(projectedAvailable, teamSize);

  // Evaluate risk deterministically
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
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status
    };
  });

  const coverageDrop = Math.max(0, currentCoverage - projectedCoverage);

  let recommendation = 'Approval is safe. Department maintains healthy coverage.';
  const riskReasons = [reason];

  if (riskLevel === 'HIGH') {
    recommendation = `Reject or reschedule leave: approval drops ${department} coverage to ${projectedCoverage}%, below the critical operational threshold.`;
  } else if (riskLevel === 'MEDIUM') {
    recommendation = `Caution advised: approval lowers ${department} coverage to ${projectedCoverage}%. Ensure shift handovers are coordinated.`;
  }

  return {
    leaveId: leave._id,
    leaveRequestId: leave._id,
    employee: applicant ? applicant.name : leave.employeeId,
    employeeId: leave.employeeId,
    team: department,
    department,
    leaveType: leave.leaveType,
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason,
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
    riskReasons,
    reason,
    impactSummary: reason,
    recommendation,
    overlappingLeaveDetails
  };
};

module.exports = {
  calculateLeaveImpact
};
