import React, { useState } from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';
import './Alert.css';

const DEFAULT_ICONS = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  danger: <AlertCircle size={18} />,
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  icon,
  dismissible = false,
  onDismiss,
  action,
  className = '',
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  const alertIcon = icon || DEFAULT_ICONS[variant] || DEFAULT_ICONS.info;

  return (
    <div className={`df-alert df-alert--${variant} ${className}`} role="alert">
      <div className="df-alert__icon" aria-hidden="true">
        {alertIcon}
      </div>

      <div className="df-alert__body">
        {title && <h5 className="df-alert__title">{title}</h5>}
        {children && <div className="df-alert__content">{children}</div>}
      </div>

      {action && <div className="df-alert__action">{action}</div>}

      {dismissible && (
        <button
          type="button"
          className="df-alert__dismiss-btn"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
