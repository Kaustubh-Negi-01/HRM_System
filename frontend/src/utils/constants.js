/**
 * Dayflow Design System & Shared Constants
 * (union of design-system + feature constants)
 */

export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

export const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual / Paid Leave' },
  { value: 'sick', label: 'Sick Leave' },
  { value: 'casual', label: 'Casual Leave' },
  { value: 'maternity', label: 'Maternity Leave' },
  { value: 'paternity', label: 'Paternity Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
];

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  LATE: 'late',
  HALF_DAY: 'half_day',
  ABSENT: 'absent',
  ON_LEAVE: 'on_leave',
  WFH: 'wfh',
};

export const DEPARTMENTS = [
  'Engineering',
  'Product & Design',
  'Human Resources',
  'Marketing',
  'Sales',
  'Finance',
  'Customer Support',
  'Operations',
];

export const PAYROLL_STATUS = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  UNPAID: 'unpaid',
};

export const RISK_LEVEL = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const COVERAGE_THRESHOLDS = {
  OPTIMAL: 85,
  WARNING: 75,
  CRITICAL: 60,
};
