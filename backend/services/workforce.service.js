const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const { ATTENDANCE_STATUS, LEAVE_STATUS } = require('../utils/constants');
const { formatDate, safePercentage } = require('../utils/calculations');
const { evaluateWorkforceRisk } = require('../utils/riskEngine');
const { mapRiskLevel } = require('../utils/dialect');

/**
 * Real-time Workforce Pulse overview
 */
const getWorkforcePulse = async (targetDate = null) => {
  let date = targetDate || formatDate(new Date());

  // Non-working-day guard: if today is a weekend with no attendance and no
  // leaves on record, snapshot the most recent working day instead so the
  // dashboard never shows a fake 0% health on Saturdays/Sundays.
  if (!targetDate) {
    const dow = new Date().getDay();
    // Only real presence (check-ins) counts as "the day happened". Approved
    // leaves also write attendance rows with status LEAVE, so checking for
    // any record would defeat the fallback on weekends with someone on leave.
    const hasPresence = await Attendance.exists({
      date,
      status: { $in: [ATTENDANCE_STATUS.PRESENT, ATTENDANCE_STATUS.HALF_DAY] }
    });
    if ((dow === 0 || dow === 6) && !hasPresence) {
      const back = new Date();
      do {
        back.setDate(back.getDate() - 1);
      } while (back.getDay() === 0 || back.getDay() === 6);
      date = formatDate(back);
    }
  }

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

  // Dynamic alerts based on real state — shaped for the frontend AlertCard
  const alerts = [];
  if (riskLevel === 'HIGH') {
    alerts.push({
      id: `alt_${Date.now()}_1`,
      type: 'CRITICAL',
      level: 'danger',
      title: 'Critical Workforce Coverage Risk',
      description: reasons[0] || 'Workforce coverage is currently below operational limits.',
      message: reasons[0] || 'Workforce coverage is currently below operational limits.',
      recommendedAction: 'Review open leave requests and rebalance shifts today.'
    });
  } else if (riskLevel === 'MEDIUM') {
    alerts.push({
      id: `alt_${Date.now()}_1`,
      type: 'WARNING',
      level: 'warning',
      title: 'Workforce Coverage Alert',
      description: reasons[0] || 'Workforce metrics have reached advisory thresholds.',
      message: reasons[0] || 'Workforce metrics have reached advisory thresholds.',
      recommendedAction: 'Monitor attendance and hold off on non-critical leave approvals.'
    });
  }

  // Check department-level anomalies
  departmentBreakdown.forEach((dept) => {
    if (dept.coveragePercentage < 70) {
      alerts.push({
        id: `alt_${dept.department.replace(/\s+/g, '_')}_${Date.now()}`,
        type: 'WARNING',
        level: 'warning',
        title: `Low Staffing in ${dept.department}`,
        description: `${dept.department} department is at ${dept.coveragePercentage}% active coverage.`,
        message: `${dept.department} department is at ${dept.coveragePercentage}% active coverage.`,
        recommendedAction: `Redistribute workload or approve backup coverage for ${dept.department}.`
      });
    }
  });

  // Pending leaves alert
  const pendingLeavesCount = await LeaveRequest.countDocuments({ status: LEAVE_STATUS.PENDING });
  if (pendingLeavesCount > 0) {
    alerts.push({
      id: `alt_pending_${Date.now()}`,
      type: 'INFO',
      level: 'pulse',
      title: 'Pending Leave Approvals',
      description: `There are ${pendingLeavesCount} leave request(s) awaiting HR review.`,
      message: `There are ${pendingLeavesCount} leave request(s) awaiting HR review.`,
      recommendedAction: 'Open the Leave Approvals queue to review Smart Leave Impact scores.'
    });
  }

  return {
    date,
    totalEmployees,
    totalHeadcount: totalEmployees,
    presentToday: Math.floor(presentCount),
    activeToday: Math.floor(presentCount),
    halfDayToday: halfDayCount,
    absentToday: absentCount,
    unplannedAbsences: absentCount,
    onLeaveToday: leaveCount,
    attendancePercentage,
    healthIndex: Math.max(0, 100 - Math.round(absenceRate * 2 + leaveLoad * 0.5)),
    healthStatus:
      absenceRate < 10 && teamCoverage >= 85 ? 'Optimal' : teamCoverage >= 75 ? 'Stable' : 'At Risk',
    attendanceRate: attendancePercentage,
    teamCoverage,
    leaveLoad,
    absenceRate,
    riskLevel: mapRiskLevel(riskLevel),
    burnoutRiskLevel: mapRiskLevel(riskLevel) === 'critical' ? 'High' : mapRiskLevel(riskLevel) === 'medium' ? 'Moderate' : 'Low',
    riskReasons: reasons,
    departmentBreakdown,
    departmentHealth: departmentBreakdown.map((d) => ({
      name: d.department,
      headcount: d.totalEmployees,
      present: d.present,
      coveragePercent: d.coveragePercentage,
      status: d.coveragePercentage >= 85 ? 'optimal' : d.coveragePercentage >= 70 ? 'warning' : 'danger'
    })),
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
 * Real burnout risk computation from the last 30 days of attendance:
 * - overtime hours (time worked beyond 8h/day)
 * - consecutive days worked without a break
 */
const getBurnoutRisks = async () => {
  const users = await User.find({ role: { $ne: 'ADMIN' } });
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const sinceStr = formatDate(since);

  const records = await Attendance.find({
    date: { $gte: sinceStr },
    workHours: { $gt: 0 }
  }).sort({ date: 1 });

  const byEmployee = new Map();
  records.forEach((r) => {
    if (!byEmployee.has(r.employeeId)) byEmployee.set(r.employeeId, []);
    byEmployee.get(r.employeeId).push(r);
  });

  const risks = [];
  users.forEach((u) => {
    const recs = byEmployee.get(u.employeeId) || [];
    if (recs.length === 0) return;

    // Overtime: hours beyond 8 per day
    const overtimeHours = Number(
      recs.reduce((sum, r) => sum + Math.max(0, (r.workHours || 0) - 8), 0).toFixed(1)
    );

    // Longest consecutive run of worked days (calendar)
    let consecutive = 0;
    let maxConsecutive = 0;
    let prev = null;
    recs.forEach((r) => {
      const d = new Date(r.date);
      if (prev && (d - prev) / 86400000 === 1) {
        consecutive += 1;
      } else {
        consecutive = 1;
      }
      maxConsecutive = Math.max(maxConsecutive, consecutive);
      prev = d;
    });

    if (overtimeHours <= 4 && maxConsecutive < 7) return; // healthy — skip

    const riskScore = Math.min(
      100,
      Math.round(overtimeHours * 3 + maxConsecutive * 2.5)
    );

    risks.push({
      employeeId: u.employeeId,
      employeeName: u.name,
      name: u.name,
      role:
        u.department === 'Engineering'
          ? 'Engineer'
          : u.department,
      department: u.department,
      overtimeHours,
      daysWorked: recs.length,
      consecutiveDaysWithoutBreak: maxConsecutive,
      riskScore,
      flaggedReason: `${overtimeHours}h overtime across ${recs.length} active days with a longest unbroken stretch of ${maxConsecutive} days in the last 30 days.`
    });
  });

  return risks.sort((a, b) => b.riskScore - a.riskScore);
};

/**
 * Department-level stats snapshot.
 */
const getDepartmentStats = async () => {
  const pulse = await getWorkforcePulse();
  return pulse.departmentBreakdown;
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
  getAttendanceTrend,
  getBurnoutRisks,
  getDepartmentStats
};
