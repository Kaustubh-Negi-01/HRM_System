import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Loader';
import './StatCard.css';

export const StatCard = ({
  label,
  title,
  value,
  delta,
  change,
  deltaDirection = 'up',
  changeType,
  deltaText,
  subtitle,
  icon: IconProp,
  iconVariant = 'primary',
  iconColor,
  iconBg,
  loading = false,
  onClick,
  className = '',
}) => {
  const displayLabel = label || title;
  const displayDelta = delta !== undefined ? delta : change;
  const direction = changeType === 'negative' ? 'down' : (changeType === 'neutral' ? 'flat' : deltaDirection);

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
    if (direction === 'up') return <ArrowUpRight size={14} />;
    if (direction === 'down') return <ArrowDownRight size={14} />;
    return <Minus size={14} />;
  };

  const renderIcon = () => {
    if (!IconProp) return null;
    if (React.isValidElement(IconProp)) return IconProp;
    const IconComponent = IconProp;
    return <IconComponent size={20} />;
  };

  return (
    <Card
      hoverable
      className={`df-stat-card ${onClick ? 'df-stat-card--clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="df-stat-card__top">
        <span className="df-stat-card__label">{displayLabel}</span>
        {IconProp && (
          <div
            className={`df-stat-card__icon-wrap df-stat-card__icon-wrap--${iconVariant}`}
            style={{
              ...(iconBg ? { backgroundColor: iconBg } : {}),
              ...(iconColor ? { color: iconColor } : {}),
            }}
          >
            {renderIcon()}
          </div>
        )}
      </div>

      <div className="df-stat-card__body">
        <div className="df-stat-card__value table-num">{value}</div>

        {(displayDelta !== undefined || deltaText || subtitle) && (
          <div className="df-stat-card__footer-row">
            {displayDelta !== undefined && (
              <span className={`df-stat-card__delta df-stat-card__delta--${direction}`}>
                {renderDeltaIcon()}
                <span className="table-num">{displayDelta}</span>
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
