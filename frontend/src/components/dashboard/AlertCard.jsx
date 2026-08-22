import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import './AlertCard.css';

const ALERT_ICONS = {
  warning: <AlertTriangle size={20} />,
  danger: <AlertCircle size={20} />,
  info: <Info size={20} />,
  success: <CheckCircle2 size={20} />,
};

export const AlertCard = ({
  variant = 'warning',
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div className={`df-alert-card df-alert-card--${variant} ${className}`}>
      <div className="df-alert-card__icon">
        {icon || ALERT_ICONS[variant] || ALERT_ICONS.warning}
      </div>

      <div className="df-alert-card__content">
        {title && <h4 className="df-alert-card__title">{title}</h4>}
        {description && <p className="df-alert-card__desc">{description}</p>}
      </div>

      {actionLabel && onAction && (
        <div className="df-alert-card__action">
          <Button
            variant={variant === 'danger' ? 'danger' : 'secondary'}
            size="sm"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
