const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { ATTENDANCE_STATUS } = require('../utils/constants');
const { formatDate } = require('../utils/calculations');
const { mapRole } = require('../utils/dialect');
const { mapAttendanceStatus } = require('../utils/dialect');

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

/**
 * Own attendance status for today â€” shaped for the employee dashboard widget.
 */
const getMeToday = async (employeeId, dateStr = null) => {
  const date = dateStr || formatDate(new Date());
  const record = await Attendance.findOne({ employeeId, date });

  return {
    date,
    isCheckedIn: Boolean(record && record.checkIn),
    isCheckedOut: Boolean(record && record.checkOut),
    checkInTime: record && record.checkIn ? record.checkIn : null,
    checkOutTime: record && record.checkOut ? record.checkOut : null,
    hoursWorked: record ? record.workHours || 0 : 0,
    status: mapAttendanceStatus(record ? record.status : ATTENDANCE_STATUS.ABSENT)
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
      employeeName: u.name,
      name: u.name,
      department: u.department,
      date,
      checkIn: att ? att.checkIn : null,
      checkOut: att ? att.checkOut : null,
      status: mapAttendanceStatus(att ? att.status : ATTENDANCE_STATUS.ABSENT),
      workHours: att ? att.workHours : 0,
      hoursWorked: att ? att.workHours || 0 : 0
    };
  });
};

/**
 * Organization-wide attendance for a date (admin view).
 */
const getTodayAttendance = async (dateStr = null) => {
  const date = dateStr || formatDate(new Date());
  const users = await User.find();
  const records = await Attendance.find({ date });

  const recordMap = new Map(records.map((r) => [r.employeeId, r]));

  return users.map((u) => {
    const att = recordMap.get(u.employeeId);
    return {
      employeeId: u.employeeId,
      employeeName: u.name,
      name: u.name,
      department: u.department,
      role: mapRole(u.role),
      date,
      checkIn: att ? att.checkIn : null,
      checkOut: att ? att.checkOut : null,
      status: mapAttendanceStatus(att ? att.status : ATTENDANCE_STATUS.ABSENT),
      workHours: att ? att.workHours : 0,
      hoursWorked: att ? att.workHours || 0 : 0
    };
  });
};

/**
 * Admin manual attendance marking.
 */
const markManualAttendance = async ({ employeeId, dateStr = null, status, checkIn = null, checkOut = null }) => {
  const date = dateStr || formatDate(new Date());
  const upperEmployeeId = String(employeeId || '').toUpperCase();

  const user = await User.findOne({ employeeId: upperEmployeeId });
  if (!user) {
    const err = new Error(`Employee ${upperEmployeeId} not found.`);
    err.code = 'NOT_FOUND';
    err.status = 404;
    throw err;
  }

  // Map frontend dialect status back to canonical enum
  let canonicalStatus = ATTENDANCE_STATUS.PRESENT;
  switch (String(status || '').toLowerCase()) {
    case 'absent':
      canonicalStatus = ATTENDANCE_STATUS.ABSENT;
      break;
    case 'half_day':
      canonicalStatus = ATTENDANCE_STATUS.HALF_DAY;
      break;
    case 'on_leave':
    case 'leave':
      canonicalStatus = ATTENDANCE_STATUS.LEAVE;
      break;
    case 'present':
    default:
      canonicalStatus = ATTENDANCE_STATUS.PRESENT;
  }

  const record = await Attendance.findOneAndUpdate(
    { employeeId: upperEmployeeId, date },
    {
      employeeId: upperEmployeeId,
      date,
      status: canonicalStatus,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      workHours:
        checkIn && checkOut
          ? Number(Math.max(0, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60)).toFixed(2))
          : 0
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return record;
};

module.exports = {
  checkIn,
  checkOut,
  getMeAttendance,
  getMeToday,
  getTeamAttendance,
  getTodayAttendance,
  markManualAttendance
};
