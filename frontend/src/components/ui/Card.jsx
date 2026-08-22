import React from 'react';
import './Card.css';

export const Card = ({
  title,
  subtitle,
  icon,
  actions,
  footer,
  padded = true,
  hoverable = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const hasHeader = title || subtitle || actions || icon;

  return (
    <div
      className={`df-card ${padded ? 'df-card--padded' : ''} ${hoverable ? 'df-card--hoverable' : ''} ${onClick ? 'df-card--clickable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {hasHeader && (
        <div className="df-card__header">
          <div className="df-card__header-content">
            {icon && <span className="df-card__icon">{icon}</span>}
            <div className="df-card__titles">
              {title && <h3 className="df-card__title">{title}</h3>}
              {subtitle && <p className="df-card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="df-card__actions">{actions}</div>}
        </div>
      )}
      
      <div className="df-card__body">
        {children}
      </div>

      {footer && (
        <div className="df-card__footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
