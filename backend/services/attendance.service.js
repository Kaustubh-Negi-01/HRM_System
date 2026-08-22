const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { ATTENDANCE_STATUS } = require('../utils/constants');
const { formatDate } = require('../utils/calculations');

const checkIn = async (employeeId, dateStr = null) => {
  const date = dateStr || formatDate(new Date());

  // Check if attendance record already exists for today
  let record = await Attendance.findOne({ employeeId, date });

  if (record && record.checkIn) {
    const err = new Error('You have already checked in for today.');
    err.code = 'ALREADY_CHECKED_IN';
    err.status = 400;
    throw err;
  }

  const now = new Date();

  if (!record) {
    record = new Attendance({
      employeeId,
      date,
      checkIn: now,
      status: ATTENDANCE_STATUS.PRESENT
    });
  } else {
    record.checkIn = now;
    record.status = ATTENDANCE_STATUS.PRESENT;
  }

  await record.save();
  return record;
};

const checkOut = async (employeeId, dateStr = null) => {
  const date = dateStr || formatDate(new Date());

  const record = await Attendance.findOne({ employeeId, date });

  if (!record || !record.checkIn) {
    const err = new Error('Cannot check out without checking in first.');
    err.code = 'NOT_CHECKED_IN';
    err.status = 400;
    throw err;
  }

  if (record.checkOut) {
    const err = new Error('You have already checked out for today.');
    err.code = 'ALREADY_CHECKED_OUT';
    err.status = 400;
    throw err;
  }

  const checkOutTime = new Date();
  record.checkOut = checkOutTime;

  // Calculate work hours
  const hours = (checkOutTime.getTime() - new Date(record.checkIn).getTime()) / (1000 * 60 * 60);
  record.workHours = Number(Math.max(0, hours).toFixed(2));

  // Determine if half-day (< 4 hours)
  if (record.workHours > 0 && record.workHours < 4) {
    record.status = ATTENDANCE_STATUS.HALF_DAY;
  }

  await record.save();
  return record;
};

const getMeAttendance = async (employeeId, { limit = 30, startDate, endDate } = {}) => {
  const query = { employeeId };

  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  } else if (startDate) {
    query.date = { $gte: startDate };
  } else if (endDate) {
    query.date = { $lte: endDate };
  }

  const records = await Attendance.find(query).sort({ date: -1 }).limit(parseInt(limit, 10));

  // Summary stats
  const presentCount = records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
  const halfDayCount = records.filter((r) => r.status === ATTENDANCE_STATUS.HALF_DAY).length;
  const leaveCount = records.filter((r) => r.status === ATTENDANCE_STATUS.LEAVE).length;
  const absentCount = records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;

  return {
    records,
    summary: {
      total: records.length,
      present: presentCount,
      halfDay: halfDayCount,
      leave: leaveCount,
      absent: absentCount
    }
  };
};

const getTeamAttendance = async (department, dateStr = null) => {
  const date = dateStr || formatDate(new Date());
  const users = await User.find({ department });
  const employeeIds = users.map((u) => u.employeeId);

  const records = await Attendance.find({
    employeeId: { $in: employeeIds },
    date
  });

  const recordMap = new Map(records.map((r) => [r.employeeId, r]));

  return users.map((u) => {
    const att = recordMap.get(u.employeeId);
    return {
      employeeId: u.employeeId,
      name: u.name,
      department: u.department,
      date,
      checkIn: att ? att.checkIn : null,
      checkOut: att ? att.checkOut : null,
      status: att ? att.status : ATTENDANCE_STATUS.ABSENT,
      workHours: att ? att.workHours : 0
    };
  });
};

const getTodayAttendance = async (dateStr = null) => {
  const date = dateStr || formatDate(new Date());
  const users = await User.find();
  const records = await Attendance.find({ date });

  const recordMap = new Map(records.map((r) => [r.employeeId, r]));

  return users.map((u) => {
    const att = recordMap.get(u.employeeId);
    return {
      employeeId: u.employeeId,
      name: u.name,
      department: u.department,
      role: u.role,
      date,
      checkIn: att ? att.checkIn : null,
      checkOut: att ? att.checkOut : null,
      status: att ? att.status : ATTENDANCE_STATUS.ABSENT,
      workHours: att ? att.workHours : 0
    };
  });
};

module.exports = {
  checkIn,
  checkOut,
  getMeAttendance,
  getTeamAttendance,
  getTodayAttendance
};
