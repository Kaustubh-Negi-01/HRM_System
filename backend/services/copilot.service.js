const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const Payroll = require('../models/Payroll');
const { getWorkforcePulse, getAttendanceTrend } = require('./workforce.service');
const { formatDate, safePercentage } = require('../utils/calculations');
const env = require('../config/env');

const SUGGESTED_PROMPTS = [
  'Which team has the lowest attendance?',
  'Who has the highest absence rate?',
  'Who is absent today?',
  'Which pending leaves affect staffing?',
  'Why is team coverage low?',
  'What is our total monthly payroll spend?'
];

/**
 * Return list of recommended HR prompts
 */
const getSuggestedPrompts = async () => {
  return {
    prompts: SUGGESTED_PROMPTS
  };
};

/**
 * Handle natural language questions by querying real HRMS records
 */
const askCopilot = async (question) => {
  const q = (question || '').toLowerCase().trim();
  const today = formatDate(new Date());

  let answer = '';
  let source = 'general_hrms';
  let supportingData = {};

  // Intent 1: Lowest attendance team / Worst attendance
  if (
    q.includes('lowest attendance') ||
    q.includes('worst attendance') ||
    q.includes('least attendance')
  ) {
    const pulse = await getWorkforcePulse();
    const sortedDepts = [...pulse.departmentBreakdown].sort((a, b) => a.coveragePercentage - b.coveragePercentage);
    const lowest = sortedDepts[0];

    source = 'attendance_and_department_data';
    supportingData = {
      team: lowest ? lowest.department : 'None',
      coveragePercentage: lowest ? lowest.coveragePercentage : 0,
      present: lowest ? lowest.present : 0,
      absent: lowest ? lowest.absent : 0,
      total: lowest ? lowest.totalEmployees : 0,
      allDepartments: pulse.departmentBreakdown
    };

    if (lowest) {
      answer = `${lowest.department} currently has the lowest workforce coverage at ${lowest.coveragePercentage}% (${lowest.present}/${lowest.totalEmployees} present, ${lowest.absent} absent).`;
    } else {
      answer = 'No department attendance data is currently available.';
    }
  }

  // Intent 2: Highest absence rate
  else if (q.includes('highest absence') || q.includes('most absent') || q.includes('frequently absent')) {
    const users = await User.find({ role: { $ne: 'ADMIN' } });
    const attendanceRecords = await Attendance.find();

    const empAbsenceMap = {};
    users.forEach((u) => {
      empAbsenceMap[u.employeeId] = { name: u.name, department: u.department, absentCount: 0, totalDays: 0 };
    });

    attendanceRecords.forEach((att) => {
      if (empAbsenceMap[att.employeeId]) {
        empAbsenceMap[att.employeeId].totalDays += 1;
        if (att.status === 'ABSENT') {
          empAbsenceMap[att.employeeId].absentCount += 1;
        }
      }
    });

    const sortedEmps = Object.values(empAbsenceMap).sort((a, b) => b.absentCount - a.absentCount);
    const topAbsent = sortedEmps[0];

    source = 'attendance_records';
    supportingData = {
      topAbsentEmployee: topAbsent,
      allEmployees: sortedEmps
    };

    if (topAbsent && topAbsent.absentCount > 0) {
      answer = `${topAbsent.name} in ${topAbsent.department} has the highest absences recorded with ${topAbsent.absentCount} day(s) absent.`;
    } else {
      answer = 'Absence rates across all employees are currently minimal with zero chronic absences.';
    }
  }

  // Intent 3: Absent employees today or on a date
  else if (q.includes('absent today') || q.includes('who is absent') || q.includes('missing today') || q.includes('how many employees are absent')) {
    const users = await User.find({ role: { $ne: 'ADMIN' } });
    const attendances = await Attendance.find({ date: today });
    const presentIds = new Set(
      attendances
        .filter((a) => a.status === 'PRESENT' || a.status === 'HALF_DAY')
        .map((a) => a.employeeId)
    );

    const absentUsers = users.filter((u) => !presentIds.has(u.employeeId));

    source = 'daily_attendance_records';
    supportingData = {
      count: absentUsers.length,
      absentEmployees: absentUsers.map((u) => ({
        employeeId: u.employeeId,
        name: u.name,
        department: u.department
      }))
    };

    if (absentUsers.length === 0) {
      answer = 'All employees are present today! There are zero unscheduled absences recorded.';
    } else {
      const names = absentUsers.map((u) => `${u.name} (${u.department})`).join(', ');
      answer = `There are ${absentUsers.length} employee(s) absent today: ${names}.`;
    }
  }

  // Intent 4: Pending leaves affecting staffing
  else if (q.includes('pending leave') || q.includes('leave requests') || q.includes('who applied for leave') || q.includes('affect staffing')) {
    const pendingLeaves = await LeaveRequest.find({ status: 'PENDING' });
    const empIds = pendingLeaves.map((l) => l.employeeId);
    const users = await User.find({ employeeId: { $in: empIds } });
    const userMap = new Map(users.map((u) => [u.employeeId, u]));

    const leaveDetails = pendingLeaves.map((l) => {
      const u = userMap.get(l.employeeId);
      return {
        id: l._id,
        employeeId: l.employeeId,
        name: u ? u.name : l.employeeId,
        department: u ? u.department : 'General',
        leaveType: l.leaveType,
        dates: `${l.startDate} to ${l.endDate}`,
        reason: l.reason
      };
    });

    source = 'leave_requests';
    supportingData = {
      count: pendingLeaves.length,
      leaves: leaveDetails
    };

    if (pendingLeaves.length === 0) {
      answer = 'There are currently no pending leave requests affecting staffing.';
    } else {
      answer = `There are ${pendingLeaves.length} pending leave request(s) awaiting review: ${leaveDetails
        .map((l) => `${l.name} in ${l.department} (${l.leaveType}, ${l.dates})`)
        .join('; ')}.`;
    }
  }

  // Intent 5: Why is team coverage low / Workforce health summary
  else if (
    q.includes('why is team coverage low') ||
    q.includes('why is coverage low') ||
    q.includes('team coverage') ||
    q.includes('workforce health') ||
    q.includes('workforce pulse')
  ) {
    const pulse = await getWorkforcePulse();
    source = 'workforce_pulse_engine';
    supportingData = {
      attendancePercentage: pulse.attendancePercentage,
      teamCoverage: pulse.teamCoverage,
      riskLevel: pulse.riskLevel,
      riskReasons: pulse.riskReasons,
      totalEmployees: pulse.totalEmployees,
      presentToday: pulse.presentToday,
      absentToday: pulse.absentToday,
      onLeaveToday: pulse.onLeaveToday
    };

    if (pulse.riskLevel === 'HIGH' || pulse.riskLevel === 'MEDIUM') {
      answer = `Team coverage is at ${pulse.teamCoverage}% (Risk: ${pulse.riskLevel}). Key factor: ${pulse.riskReasons[0] || 'Active leaves and absences are impacting operational thresholds.'}`;
    } else {
      answer = `Today's workforce attendance is healthy at ${pulse.attendancePercentage}% with ${pulse.teamCoverage}% team coverage. Total active: ${pulse.presentToday}/${pulse.totalEmployees}, on leave: ${pulse.onLeaveToday}. Workforce risk is assessed as ${pulse.riskLevel}.`;
    }
  }

  // Intent 6: Payroll / salary summary
  else if (q.includes('payroll') || q.includes('salary') || q.includes('compensation') || q.includes('spend')) {
    const payrolls = await Payroll.find();
    const totalNetSalary = payrolls.reduce((sum, p) => sum + (p.netSalary || 0), 0);
    const totalBasic = payrolls.reduce((sum, p) => sum + (p.basicSalary || 0), 0);

    source = 'payroll_ledger';
    supportingData = {
      totalEmployeesPaid: payrolls.length,
      totalNetSalary,
      totalBasicSalary: totalBasic,
      averageNetSalary: payrolls.length ? Math.round(totalNetSalary / payrolls.length) : 0
    };

    answer = `Total monthly payroll expenditure is $${totalNetSalary.toLocaleString()} across ${payrolls.length} employees (Average: $${supportingData.averageNetSalary.toLocaleString()}/employee).`;
  }

  // Generic / Default Intent: Overview
  else {
    const pulse = await getWorkforcePulse();
    source = 'workforce_pulse_engine';
    supportingData = {
      totalEmployees: pulse.totalEmployees,
      presentToday: pulse.presentToday,
      absentToday: pulse.absentToday,
      riskLevel: pulse.riskLevel,
      alertsCount: pulse.alerts.length
    };

    answer = `DayFlow is tracking ${pulse.totalEmployees} employees today. Current attendance is ${pulse.attendancePercentage}% (${pulse.presentToday} present, ${pulse.absentToday} absent) with ${pulse.riskLevel} workforce risk level.`;
  }

  // Optional AI enhancement if OpenAI API key is configured
  if (env.OPENAI_API_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are Dayflow HR Copilot. Provide a concise, professional 1-2 sentence answer to the HR question using ONLY the provided HR data context. Do not invent numbers.'
            },
            {
              role: 'user',
              content: `Question: ${question}\nHR Context: ${JSON.stringify(supportingData)}\nDirect Answer: ${answer}`
            }
          ],
          max_tokens: 150
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content?.trim();
        if (aiText) {
          answer = aiText;
        }
      }
    } catch (aiErr) {
      console.warn('[Copilot] Optional AI API call failed, falling back to deterministic answer:', aiErr.message);
    }
  }

  return {
    question,
    answer,
    source,
    supportingData
  };
};

module.exports = {
  askCopilot,
  getSuggestedPrompts
};
