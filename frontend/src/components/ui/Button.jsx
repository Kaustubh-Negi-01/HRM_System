import React from 'react';
import './Button.css';

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      className={`df-button df-button--${variant} df-button--${size} ${fullWidth ? 'df-button--full' : ''} ${loading ? 'df-button--loading' : ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="df-button__spinner" aria-hidden="true" />}
      {!loading && icon && <span className="df-button__icon">{icon}</span>}
      {children && <span className="df-button__content">{children}</span>}
      {!loading && iconRight && <span className="df-button__icon-right">{iconRight}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
