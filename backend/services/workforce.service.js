const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const { ATTENDANCE_STATUS, LEAVE_STATUS } = require('../utils/constants');
const { formatDate, safePercentage } = require('../utils/calculations');
const { evaluateWorkforceRisk } = require('../utils/riskEngine');

/**
 * Real-time Workforce Pulse overview
 */
const getWorkforcePulse = async (targetDate = null) => {
  const date = targetDate || formatDate(new Date());

  const users = await User.find({ role: { $ne: 'ADMIN' } });
  const totalEmployees = users.length || 1; // avoid division by 0

  // Today's attendance
  const attendances = await Attendance.find({ date });
  const attMap = new Map(attendances.map((a) => [a.employeeId, a]));

  // Active approved leaves today
  const approvedLeaves = await LeaveRequest.find({
    status: LEAVE_STATUS.APPROVED,
    startDate: { $lte: date },
    endDate: { $gte: date }
  });
  const onLeaveEmpIds = new Set(approvedLeaves.map((l) => l.employeeId));

  let presentCount = 0;
  let halfDayCount = 0;
  let leaveCount = 0;
  let absentCount = 0;

  // Department mapping
  const deptMap = {};

  users.forEach((u) => {
    if (!deptMap[u.department]) {
      deptMap[u.department] = {
        name: u.department,
        total: 0,
        present: 0,
        absent: 0,
        onLeave: 0
      };
    }
    deptMap[u.department].total += 1;

    const att = attMap.get(u.employeeId);
    const isOnLeave = onLeaveEmpIds.has(u.employeeId) || (att && att.status === ATTENDANCE_STATUS.LEAVE);

    if (isOnLeave) {
      leaveCount += 1;
      deptMap[u.department].onLeave += 1;
    } else if (att && att.status === ATTENDANCE_STATUS.PRESENT) {
      presentCount += 1;
      deptMap[u.department].present += 1;
    } else if (att && att.status === ATTENDANCE_STATUS.HALF_DAY) {
      halfDayCount += 1;
      presentCount += 0.5;
      deptMap[u.department].present += 0.5;
    } else {
      absentCount += 1;
      deptMap[u.department].absent += 1;
    }
  });

  const attendancePercentage = safePercentage(presentCount, totalEmployees);
  const teamCoverage = safePercentage(totalEmployees - absentCount - leaveCount, totalEmployees);
  const leaveLoad = safePercentage(leaveCount, totalEmployees);
  const absenceRate = safePercentage(absentCount, totalEmployees);

  const { riskLevel, reasons } = evaluateWorkforceRisk(
    attendancePercentage,
    teamCoverage,
    absenceRate,
    leaveLoad
  );

  // Department breakdown
  const departmentBreakdown = Object.values(deptMap).map((d) => {
    const cov = safePercentage(d.total - d.absent - d.onLeave, d.total);
    return {
      department: d.name,
      totalEmployees: d.total,
      present: d.present,
      absent: d.absent,
      onLeave: d.onLeave,
      coveragePercentage: cov
    };
  });

  // Dynamic alerts based on real state
  const alerts = [];
  if (riskLevel === 'HIGH') {
    alerts.push({
      type: 'CRITICAL',
      title: 'Critical Workforce Coverage Risk',
      message: reasons[0] || 'Workforce coverage is currently below operational limits.'
    });
  } else if (riskLevel === 'MEDIUM') {
    alerts.push({
      type: 'WARNING',
      title: 'Workforce Coverage Alert',
      message: reasons[0] || 'Workforce metrics have reached advisory thresholds.'
    });
  }

  // Check department-level anomalies
  departmentBreakdown.forEach((dept) => {
    if (dept.coveragePercentage < 70) {
      alerts.push({
        type: 'WARNING',
        title: `Low Staffing in ${dept.department}`,
        message: `${dept.department} department is at ${dept.coveragePercentage}% active coverage.`
      });
    }
  });

  // Pending leaves alert
  const pendingLeavesCount = await LeaveRequest.countDocuments({ status: LEAVE_STATUS.PENDING });
  if (pendingLeavesCount > 0) {
    alerts.push({
      type: 'INFO',
      title: 'Pending Leave Approvals',
      message: `There are ${pendingLeavesCount} leave request(s) awaiting HR review.`
    });
  }

  return {
    date,
    totalEmployees,
    presentToday: Math.floor(presentCount),
    halfDayToday: halfDayCount,
    absentToday: absentCount,
    onLeaveToday: leaveCount,
    attendancePercentage,
    teamCoverage,
    leaveLoad,
    absenceRate,
    riskLevel,
    riskReasons: reasons,
    departmentBreakdown,
    alerts
  };
};

/**
 * Get workforce alerts only
 */
const getWorkforceAlerts = async () => {
  const pulse = await getWorkforcePulse();
  return pulse.alerts;
};

/**
 * 7-day or N-day historical attendance trend
 */
const getAttendanceTrend = async (days = 7) => {
  const users = await User.find({ role: { $ne: 'ADMIN' } });
  const totalEmployees = users.length || 1;

  const trend = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);

    const records = await Attendance.find({ date: dateStr });
    const present = records.filter(
      (r) => r.status === ATTENDANCE_STATUS.PRESENT || r.status === ATTENDANCE_STATUS.HALF_DAY
    ).length;
    const onLeave = records.filter((r) => r.status === ATTENDANCE_STATUS.LEAVE).length;
    const absent = Math.max(0, totalEmployees - present - onLeave);

    trend.push({
      date: dateStr,
      present,
      absent,
      onLeave,
      attendancePercentage: safePercentage(present, totalEmployees)
    });
  }

  return trend;
};

module.exports = {
  getWorkforcePulse,
  getWorkforceAlerts,
  getAttendanceTrend
};
