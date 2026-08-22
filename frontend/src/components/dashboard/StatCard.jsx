import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Loader';
import './StatCard.css';

export const StatCard = ({
  label,
  value,
  delta,
  deltaDirection = 'up', // 'up' | 'down' | 'flat'
  deltaText,
  icon,
  iconVariant = 'primary', // 'primary' | 'success' | 'warning' | 'danger' | 'info'
  loading = false,
  subtitle,
  onClick,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`df-stat-card ${className}`}>
        <div className="df-stat-card__top">
          <Skeleton width="60%" height="14px" />
          <Skeleton width="36px" height="36px" radius="md" />
        </div>
        <div className="df-stat-card__body">
          <Skeleton width="50%" height="28px" />
          <Skeleton width="70%" height="12px" />
        </div>
      </Card>
    );
  }

  const renderDeltaIcon = () => {
    if (deltaDirection === 'up') return <ArrowUpRight size={14} />;
    if (deltaDirection === 'down') return <ArrowDownRight size={14} />;
    return <Minus size={14} />;
  };

  return (
    <Card
      className={`df-stat-card ${onClick ? 'df-stat-card--clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="df-stat-card__top">
        <span className="df-stat-card__label">{label}</span>
        {icon && (
          <div className={`df-stat-card__icon-wrap df-stat-card__icon-wrap--${iconVariant}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="df-stat-card__body">
        <div className="df-stat-card__value table-num">{value}</div>
        
        {(delta !== undefined || deltaText || subtitle) && (
          <div className="df-stat-card__footer-row">
            {delta !== undefined && (
              <span className={`df-stat-card__delta df-stat-card__delta--${deltaDirection}`}>
                {renderDeltaIcon()}
                <span className="table-num">{delta}</span>
              </span>
            )}
            {(deltaText || subtitle) && (
              <span className="df-stat-card__footer-text">
                {deltaText || subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
