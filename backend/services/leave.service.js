const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { LEAVE_STATUS, ATTENDANCE_STATUS } = require('../utils/constants');
const { formatDate, dateRangesOverlap } = require('../utils/calculations');

const createLeaveRequest = async ({ employeeId, leaveType, startDate, endDate, reason }) => {
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
    leaveType,
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

module.exports = {
  createLeaveRequest,
  getMeLeaves,
  getAllLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave
};
