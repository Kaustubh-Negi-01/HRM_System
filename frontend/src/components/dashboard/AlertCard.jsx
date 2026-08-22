import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import './AlertCard.css';

const ALERT_ICONS = {
  warning: <AlertTriangle size={20} />,
  danger: <AlertCircle size={20} />,
  info: <Info size={20} />,
  success: <CheckCircle2 size={20} />,
  pulse: <Zap size={20} style={{ color: 'var(--pulse-cyan)' }} />,
};

export const AlertCard = ({
  variant = 'warning',
  type,
  title,
  description,
  message,
  actionLabel,
  actionText,
  actionLink,
  onAction,
  icon,
  className = '',
}) => {
  const navigate = useNavigate();
  const alertVariant = type || variant;
  const alertText = message || description;
  const alertActionLabel = actionText || actionLabel;

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionLink) {
      navigate(actionLink);
    }
  };

  return (
    <div className={`df-alert-card df-alert-card--${alertVariant} ${className}`}>
      <div className="df-alert-card__icon">
        {icon || ALERT_ICONS[alertVariant] || ALERT_ICONS.warning}
      </div>

      <div className="df-alert-card__content">
        {title && <h4 className="df-alert-card__title">{title}</h4>}
        {alertText && <p className="df-alert-card__desc">{alertText}</p>}
      </div>

      {alertActionLabel && (onAction || actionLink) && (
        <div className="df-alert-card__action">
          <Button
            variant={alertVariant === 'danger' ? 'danger' : 'secondary'}
            size="sm"
            onClick={handleAction}
          >
            {alertActionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
