import React from 'react';
import { AlertCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';
import './ErrorMessage.css';

export const ErrorMessage = ({
  message,
  className = '',
}) => {
  if (!message) return null;

  return (
    <div className={`df-error-message ${className}`} role="alert">
      <AlertCircle size={16} className="df-error-message__icon" />
      <span className="df-error-message__text">{message}</span>
    </div>
  );
};

export const ErrorState = ({
  title = 'Failed to load data',
  description = 'An unexpected error occurred while fetching information. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  return (
    <div className={`df-error-state ${className}`}>
      <div className="df-error-state__icon">
        <AlertTriangle size={36} />
      </div>
      <h4 className="df-error-state__title">{title}</h4>
      <p className="df-error-state__desc">{description}</p>
      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={onRetry}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
