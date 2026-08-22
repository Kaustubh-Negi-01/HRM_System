import React from 'react';
import './Button.css';

const renderIconProp = (icon, size = 16) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && (icon.$$typeof || icon.render))) {
    const IconComp = icon;
    return <IconComp size={size} />;
  }
  return null;
};

export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  isLoading = false,
  disabled = false,
  icon,
  iconRight,
  iconPosition,
  fullWidth = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const isSpinning = loading || isLoading;
  const isDisabled = disabled || isSpinning;

  // Support iconPosition="right" as alias for iconRight
  const leftIcon = iconPosition === 'right' ? null : icon;
  const rightIcon = iconPosition === 'right' ? icon : iconRight;

  return (
    <button
      ref={ref}
      type={type}
      className={`df-button df-button--${variant} df-button--${size} ${fullWidth ? 'df-button--full' : ''} ${isSpinning ? 'df-button--loading' : ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {isSpinning && <span className="df-button__spinner" aria-hidden="true" />}
      {!isSpinning && leftIcon && <span className="df-button__icon">{renderIconProp(leftIcon, size === 'sm' ? 14 : size === 'lg' ? 18 : 16)}</span>}
      {children && <span className="df-button__content">{children}</span>}
      {!isSpinning && rightIcon && <span className="df-button__icon-right">{renderIconProp(rightIcon, size === 'sm' ? 14 : size === 'lg' ? 18 : 16)}</span>}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
