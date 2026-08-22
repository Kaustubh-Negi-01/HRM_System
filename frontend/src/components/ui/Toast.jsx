import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const ICONS = {
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  danger: <AlertCircle size={18} />,
  info: <Info size={18} />,
};

export const Toast = ({
  id,
  variant = 'info',
  title,
  message,
  duration = 4000,
  onClose,
  className = '',
}) => {
  useEffect(() => {
    if (duration > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div className={`df-toast df-toast--${variant} ${className}`} role="status">
      <span className="df-toast__icon" aria-hidden="true">
        {ICONS[variant] || ICONS.info}
      </span>
      <div className="df-toast__body">
        {title && <h5 className="df-toast__title">{title}</h5>}
        {message && <p className="df-toast__message">{message}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          className="df-toast__close"
          onClick={() => onClose(id)}
          aria-label="Close notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Toast;
