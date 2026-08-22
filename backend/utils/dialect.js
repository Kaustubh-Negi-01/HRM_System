/**
 * Dialect mappers — the backend stores canonical UPPERCASE values, while the
 * frontend design system consumes lowercase / snake_case values.
 * Every API output passes through these mappers so both sides stay in sync
 * without touching dozens of frontend files.
 */

const mapRole = (role) => String(role || '').toLowerCase();

const ATTENDANCE_STATUS_OUT = {
  PRESENT: 'present',
  ABSENT: 'absent',
  HALF_DAY: 'half_day',
  LEAVE: 'on_leave'
};

const mapAttendanceStatus = (status) => ATTENDANCE_STATUS_OUT[status] || String(status || '').toLowerCase();

const mapLeaveStatus = (status) => String(status || '').toLowerCase();

const LEAVE_TYPE_ALIASES = {
  PAID: 'annual',
  ANNUAL: 'annual',
  SICK: 'sick',
  CASUAL: 'casual',
  MATERNITY: 'maternity',
  PATERNITY: 'paternity',
  UNPAID: 'unpaid'
};

const mapLeaveType = (type) => LEAVE_TYPE_ALIASES[type] || String(type || '').toLowerCase();

const mapRiskLevel = (level) => {
  switch (level) {
    case 'HIGH':
      return 'critical';
    case 'MEDIUM':
      return 'medium';
    case 'LOW':
      return 'low';
    default:
      return String(level || '').toLowerCase();
  }
};

/**
 * Normalize any incoming value to the canonical uppercase enum stored in DB.
 * Accepts 'annual', 'ANNUAL', 'Annual' etc. Unknown values pass through uppercased.
 */
const normalizeLeaveType = (type) => {
  const t = String(type || '').toUpperCase();
  if (t === 'ANNUAL') return 'PAID'; // legacy canonical name
  return t;
};

const normalizeLeaveStatus = (status) => String(status || '').toUpperCase();

module.exports = {
  mapRole,
  mapAttendanceStatus,
  mapLeaveStatus,
  mapLeaveType,
  mapRiskLevel,
  normalizeLeaveType,
  normalizeLeaveStatus
};
