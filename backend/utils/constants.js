const ROLES = {
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN'
 };

const ATTENDANCE_STATUS = {
  PRESENT: 'PRESENT',
  ABSENT: 'ABSENT',
  HALF_DAY: 'HALF_DAY',
  LEAVE: 'LEAVE'
 };

const LEAVE_TYPE = {
  PAID: 'PAID',       // canonical name for Annual / Paid Leave
  ANNUAL: 'ANNUAL',   // alias accepted from frontend
  SICK: 'SICK',
  CASUAL: 'CASUAL',
  MATERNITY: 'MATERNITY',
  PATERNITY: 'PATERNITY',
  UNPAID: 'UNPAID'
};

// Annual entitlement (days/year) per leave type, keyed by frontend dialect
const LEAVE_BALANCE_DEFAULTS = {
  annual: { total: 20 },
  sick: { total: 10 },
  casual: { total: 8 },
  maternity: { total: 90 },
  paternity: { total: 15 },
  unpaid: { total: null } // unlimited, always counts against salary
};

const LEAVE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
 };

const RISK_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
 };

module.exports = {
  ROLES,
  ATTENDANCE_STATUS,
  LEAVE_TYPE,
  LEAVE_STATUS,
  RISK_LEVEL,
  LEAVE_BALANCE_DEFAULTS
 };
