import React from 'react';
import { Badge } from '../ui/Badge';

const RISK_MAP = {
  low: { variant: 'success', label: 'LOW RISK' },
  medium: { variant: 'warning', label: 'MEDIUM RISK' },
  moderate: { variant: 'warning', label: 'MODERATE RISK' },
  high: { variant: 'danger', label: 'HIGH RISK' },
  critical: { variant: 'danger', label: 'CRITICAL RISK' },
};

export const RiskBadge = ({
  level = 'low',
  size = 'md',
  dot = true,
  className = '',
}) => {
  const normalized = String(level).toLowerCase().trim();
  const config = RISK_MAP[normalized] || { variant: 'neutral', label: `${String(level).toUpperCase()} RISK` };

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot={dot}
      className={`df-risk-badge ${className}`}
    >
      {config.label}
    </Badge>
  );
};

export default RiskBadge;
