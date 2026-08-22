import React from 'react';
import './CoverageIndicator.css';

export const CoverageIndicator = ({
  percentage = 100,
  label = 'Staffing Coverage',
  threshold = 75,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const safePercent = Math.min(100, Math.max(0, percentage));
  
  let statusColor = 'var(--success)';
  let statusClass = 'good';
  
  if (safePercent < threshold - 15) {
    statusColor = 'var(--danger)';
    statusClass = 'danger';
  } else if (safePercent < threshold) {
    statusColor = 'var(--warning)';
    statusClass = 'warning';
  }

  return (
    <div className={`df-coverage-indicator df-coverage-indicator--${size} df-coverage-indicator--${statusClass} ${className}`}>
      {showLabel && (
        <div className="df-coverage-indicator__header">
          <span className="df-coverage-indicator__label">{label}</span>
          <span className="df-coverage-indicator__value table-num">
            {safePercent}%
          </span>
        </div>
      )}
      
      <div className="df-coverage-indicator__track">
        <div
          className="df-coverage-indicator__bar"
          style={{
            width: `${safePercent}%`,
            backgroundColor: statusColor,
          }}
          role="progressbar"
          aria-valuenow={safePercent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        {threshold && (
          <div
            className="df-coverage-indicator__threshold"
            style={{ left: `${threshold}%` }}
            title={`Required Threshold: ${threshold}%`}
          />
        )}
      </div>
    </div>
  );
};

export default CoverageIndicator;
