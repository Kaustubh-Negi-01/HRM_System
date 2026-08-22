import React from 'react';
import { Badge } from '../ui/Badge';

const STATUS_VARIANT_MAP = {
  // Leave statuses
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  cancelled: 'neutral',

  // Attendance statuses
  present: 'success',
  absent: 'danger',
  'half-day': 'warning',
  halfday: 'warning',
  late: 'warning',
  wfh: 'info',
  leave: 'warning',
  holiday: 'info',
  weekend: 'neutral',

  // Payroll statuses
  paid: 'success',
  processing: 'warning',
  failed: 'danger',
  unpaid: 'danger',

  // General statuses
  active: 'success',
  inactive: 'neutral',
  draft: 'neutral',
  completed: 'success',
};

export const StatusBadge = ({
  status = '',
  variant: explicitVariant,
  dot = true,
  size = 'md',
  className = '',
}) => {
  if (!status && status !== 0) return null;

  const normalizedStatus = String(status).toLowerCase().trim();
  const resolvedVariant = explicitVariant || STATUS_VARIANT_MAP[normalizedStatus] || 'neutral';

  return (
    <Badge
      variant={resolvedVariant}
      size={size}
      dot={dot}
      className={`df-status-badge ${className}`}
    >
      {String(status).toUpperCase()}
    </Badge>
  );
};

export default StatusBadge;
