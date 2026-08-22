import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';
import './EmptyState.css';

export const EmptyState = ({
  icon,
  title = 'No data found',
  description = 'There are no records to display at this moment.',
  action,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`df-empty-state ${className}`}>
      <div className="df-empty-state__icon">
        {icon || <Inbox size={40} />}
      </div>
      <h4 className="df-empty-state__title">{title}</h4>
      {description && <p className="df-empty-state__desc">{description}</p>}
      {action ? (
        <div className="df-empty-state__action">{action}</div>
      ) : actionLabel && onAction ? (
        <div className="df-empty-state__action">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default EmptyState;
