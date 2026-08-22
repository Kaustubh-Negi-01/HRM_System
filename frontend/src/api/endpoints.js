export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },
  // Employees
  EMPLOYEES: {
    LIST: '/api/employees',
    DETAIL: (id) => `/api/employees/${id}`,
    ME_PROFILE: '/api/employees/me/profile',
    UPDATE_PROFILE: (id) => `/api/employees/${id}`,
    CREATE: '/api/employees',
  },
  // Attendance
  ATTENDANCE: {
    CHECK_IN: '/api/attendance/check-in',
    CHECK_OUT: '/api/attendance/check-out',
    MY_ATTENDANCE: '/api/attendance/me',
    TODAY_STATUS: '/api/attendance/today',
    ORGANIZATION_LOGS: '/api/attendance/all',
    MANUAL_MARK: '/api/attendance/mark',
  },
  // Leave Management
  LEAVE: {
    APPLY: '/api/leave/request',
    MY_REQUESTS: '/api/leave/me',
    MY_BALANCE: '/api/leave/balance',
    PENDING_APPROVALS: '/api/leave/pending',
    ALL_REQUESTS: '/api/leave/all',
    UPDATE_STATUS: (id) => `/api/leave/${id}/status`,
  },
  // Smart Leave Impact (Differentiator 2)
  LEAVE_IMPACT: {
    SIMULATE: '/api/leave-impact/simulate',
    GET_BY_LEAVE_ID: (id) => `/api/leave-impact/${id}`,
    DEPARTMENT_COVERAGE: (dept) => `/api/leave-impact/coverage?department=${encodeURIComponent(dept)}`,
  },
  // Payroll Management
  PAYROLL: {
    MY_PAYSLIPS: '/api/payroll/me',
    ALL_RECORDS: '/api/payroll/all',
    GENERATE_CYCLE: '/api/payroll/generate',
    UPDATE_STATUS: (id) => `/api/payroll/${id}/status`,
    SUMMARY_STATS: '/api/payroll/stats',
  },
  // Workforce Pulse (Differentiator 1)
  WORKFORCE: {
    PULSE: '/api/workforce/pulse',
    DEPARTMENT_STATS: '/api/workforce/department-stats',
    BURNOUT_RISKS: '/api/workforce/burnout-risk',
    RETENTION_ALERTS: '/api/workforce/retention-alerts',
  },
  // HR Copilot (Differentiator 3)
  COPILOT: {
    CHAT: '/api/copilot/query',
    CONVERSATIONS: '/api/copilot/conversations',
    SUGGESTIONS: '/api/copilot/suggestions',
  },
};
