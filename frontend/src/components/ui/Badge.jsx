import React from 'react';
import './Badge.css';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`df-badge df-badge--${variant} df-badge--${size} ${className}`}
      {...props}
    >
      {dot && <span className="df-badge__dot" aria-hidden="true" />}
      <span className="df-badge__label">{children}</span>
    </span>
  );
};

export default Badge;
