import React from 'react';
import './Card.css';

const renderIconProp = (icon) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function') {
    const IconComp = icon;
    return <IconComp size={18} />;
  }
  return icon;
};

export const Card = ({
  title,
  subtitle,
  icon,
  actions,
  action,
  footer,
  padded = true,
  hoverable = false,
  variant,
  className = '',
  children,
  onClick,
  style,
  ...props
}) => {
  const headerActions = actions || action;
  const hasHeader = title || subtitle || headerActions || icon;

  return (
    <div
      className={`df-card ${padded ? 'df-card--padded' : ''} ${hoverable ? 'df-card--hoverable' : ''} ${onClick ? 'df-card--clickable' : ''} ${variant ? `df-card--${variant}` : ''} ${className}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {hasHeader && (
        <div className="df-card__header">
          <div className="df-card__header-content">
            {icon && <span className="df-card__icon">{renderIconProp(icon)}</span>}
            <div className="df-card__titles">
              {title && <h3 className="df-card__title">{title}</h3>}
              {subtitle && <p className="df-card__subtitle">{subtitle}</p>}
            </div>
          </div>
          {headerActions && <div className="df-card__actions">{headerActions}</div>}
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
