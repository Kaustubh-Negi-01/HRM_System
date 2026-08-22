import React from 'react';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './WorkforceMetricCard.css';

export const WorkforceMetricCard = ({
  title,
  value,
  target,
  status = 'good', // 'good' | 'warning' | 'danger'
  trend,
  trendDirection = 'up',
  statusLabel,
  description,
  icon,
  className = '',
}) => {
  const statusBadgeVariant = status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'danger';

  return (
    <Card className={`df-pulse-metric-card df-pulse-metric-card--${status} ${className}`}>
      <div className="df-pulse-metric-card__header">
        <div className="df-pulse-metric-card__title-row">
          {icon && <span className="df-pulse-metric-card__icon">{icon}</span>}
          <span className="df-pulse-metric-card__title">{title}</span>
        </div>
        {statusLabel && (
          <Badge variant={statusBadgeVariant} size="sm">
            {statusLabel}
          </Badge>
        )}
      </div>

      <div className="df-pulse-metric-card__body">
        <div className="df-pulse-metric-card__value table-num">{value}</div>
        
        {target && (
          <div className="df-pulse-metric-card__target">
            <span>Target: </span>
            <strong className="table-num">{target}</strong>
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="df-pulse-metric-card__footer">
          {trend && (
            <span className={`df-pulse-metric-card__trend df-pulse-metric-card__trend--${trendDirection}`}>
              {trendDirection === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              <span className="table-num">{trend}</span>
            </span>
          )}
          {description && (
            <span className="df-pulse-metric-card__desc">{description}</span>
          )}
        </div>
      )}
    </Card>
  );
};

export default WorkforceMetricCard;
