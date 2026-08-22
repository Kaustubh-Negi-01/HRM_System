const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { LEAVE_STATUS, ATTENDANCE_STATUS, LEAVE_BALANCE_DEFAULTS } = require('../utils/constants');
const { formatDate, dateRangesOverlap, getDaysBetween } = require('../utils/calculations');
const { normalizeLeaveType, mapLeaveType } = require('../utils/dialect');

const createLeaveRequest = async ({ employeeId, leaveType, startDate, endDate, reason }) => {
  const canonicalType = normalizeLeaveType(leaveType);

  if (new Date(startDate) > new Date(endDate)) {
    const err = new Error('Start date must be on or before end date.');
    err.code = 'INVALID_DATE_RANGE';
    err.status = 400;
    throw err;
  }

  // Check for duplicate or overlapping pending/approved leave requests for this employee
  const existingLeaves = await LeaveRequest.find({
    employeeId,
    status: { $in: [LEAVE_STATUS.PENDING, LEAVE_STATUS.APPROVED] }
  });

  const hasOverlap = existingLeaves.some((l) =>
    dateRangesOverlap(startDate, endDate, l.startDate, l.endDate)
  );

  if (hasOverlap) {
    const err = new Error('You already have a pending or approved leave request covering these dates.');
    err.code = 'OVERLAPPING_LEAVE_REQUEST';
    err.status = 400;
    throw err;
  }

  const leave = await LeaveRequest.create({
    employeeId,
    leaveType: canonicalType,
    startDate,
    endDate,
    reason,
    status: LEAVE_STATUS.PENDING
  });

  return leave;
};

const getMeLeaves = async (employeeId) => {
  return LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });
};

/**
 * Leave balance for the logged-in employee, in frontend dialect:
 * { annual: {total, used, remaining}, sick: {...}, ... , unpaid: {used} }
 */
const getLeaveBalance = async (employeeId) => {
  const yearStart = `${new Date().getFullYear()}-01-01`;
  const yearEnd = `${new Date().getFullYear()}-12-31`;

  const approvedLeaves = await LeaveRequest.find({
    employeeId,
    status: LEAVE_STATUS.APPROVED,
    startDate: { $lte: yearEnd },
    endDate: { $gte: yearStart }
  });

  // used days per canonical type
  const usedByDialect = {};
  approvedLeaves.forEach((l) => {
    const dialectType = mapLeaveType(l.leaveType);
    usedByDialect[dialectType] =
      (usedByDialect[dialectType] || 0) + getDaysBetween(l.startDate, l.endDate);
  });

  const balance = {};
  Object.entries(LEAVE_BALANCE_DEFAULTS).forEach(([dialectType, def]) => {
    const used = usedByDialect[dialectType] || 0;
    if (def.total === null) {
      balance[dialectType] = { total: null, used, remaining: null };
    } else {
      balance[dialectType] = {
        total: def.total,
        used,
        remaining: Math.max(0, def.total - used)
      };
    }
  });

  return {
    year: new Date().getFullYear(),
    balances: balance,
    // Flat shape too, so either consumer style works
    ...balance
  };
};

const getAllLeaves = async (filters = {}) => {
  const query = {};
  if (filters.status) {
    query.status = filters.status;
  }

  const leaves = await LeaveRequest.find(query).sort({ createdAt: -1 });
  const employeeIds = [...new Set(leaves.map((l) => l.employeeId))];
  const users = await User.find({ employeeId: { $in: employeeIds } });
  const userMap = new Map(users.map((u) => [u.employeeId, u]));

  let enriched = leaves.map((l) => {
    const u = userMap.get(l.employeeId);
    return {
      ...l.toJSON(),
      employeeName: u ? u.name : l.employeeId,
      department: u ? u.department : 'General'
    };
  });

  if (filters.department) {
    enriched = enriched.filter((l) => l.department === filters.department);
  }

  return enriched;
};

const getLeaveById = async (id) => {
  const leave = await LeaveRequest.findById(id);
  if (!leave) {
    const err = new Error('Leave request not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const user = await User.findOne({ employeeId: leave.employeeId });
  return {
    ...leave.toJSON(),
    employeeName: user ? user.name : leave.employeeId,
    department: user ? user.department : 'General'
  };
};

const approveLeave = async (id, adminUser, comment = '') => {
  const leave = await LeaveRequest.findById(id);
  if (!leave) {
    const err = new Error('Leave request not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  leave.status = LEAVE_STATUS.APPROVED;
  leave.hrComment = comment;
  leave.reviewedBy = adminUser.name || adminUser.employeeId;
  leave.reviewedAt = new Date();
  await leave.save();

  // Sync approved leave to Attendance collection for those dates
  const start = new Date(leave.startDate);
  const end = new Date(leave.endDate);
  const current = new Date(start);

  while (current <= end) {
    const dateStr = formatDate(current);
    await Attendance.findOneAndUpdate(
      { employeeId: leave.employeeId, date: dateStr },
      {
        employeeId: leave.employeeId,
        date: dateStr,
        status: ATTENDANCE_STATUS.LEAVE
      },
      { upsert: true, new: true }
    );
    current.setDate(current.getDate() + 1);
  }

  return getLeaveById(leave._id.toString());
};

const rejectLeave = async (id, adminUser, comment = '') => {
  const leave = await LeaveRequest.findById(id);
  if (!leave) {
    const err = new Error('Leave request not found.');
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  leave.status = LEAVE_STATUS.REJECTED;
  leave.hrComment = comment;
  leave.reviewedBy = adminUser.name || adminUser.employeeId;
  leave.reviewedAt = new Date();
  await leave.save();

  return getLeaveById(leave._id.toString());
};

/**
 * Pending approvals enriched with LIVE Smart Leave Impact metrics so the HR
 * queue shows risk scores computed from real staffing data.
 */
const getPendingLeavesWithImpact = async () => {
  const pendingLeaves = await getAllLeaves({ status: LEAVE_STATUS.PENDING });

  // Lazy require to avoid any future circular dependency issues
  const { calculateLeaveImpact } = require('./leaveImpact.service');

  return Promise.all(
    pendingLeaves.map(async (l) => {
      try {
        const impact = await calculateLeaveImpact(l.id);
        // Score anchored to the risk band so score and label always agree.
        // calculateLeaveImpact returns dialect-mapped levels (critical/moderate/low),
        // so normalize to canonical bands before the lookups below.
        const canonBand =
          {
            CRITICAL: 'HIGH',
            HIGH: 'HIGH',
            MODERATE: 'MEDIUM',
            MEDIUM: 'MEDIUM',
            LOW: 'LOW'
          }[String(impact.riskLevel || '').toUpperCase()] || 'LOW';
        const baseByRisk = { HIGH: 85, MEDIUM: 55, LOW: 20 };
        const impactScore = Math.min(
          99,
          Math.max(
            1,
            Math.round((baseByRisk[canonBand] || 20) + (impact.overlappingLeaves || 0) * 3)
          )
        );
        const riskMap = { HIGH: 'critical', MEDIUM: 'moderate', LOW: 'low' };
        return {
          ...l,
          impactScore,
          impactRisk: riskMap[canonBand] || 'low',
          overlapCount: impact.overlappingLeaves || 0,
          projectedCoverage: impact.projectedCoverage,
          backupAssigned: null
        };
      } catch (e) {
        return { ...l, impactScore: null, impactRisk: 'unknown', overlapCount: 0 };
      }
    })
  );
};

module.exports = {
  createLeaveRequest,
  getMeLeaves,
  getLeaveBalance,
  getAllLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave,
  getPendingLeavesWithImpact
};
