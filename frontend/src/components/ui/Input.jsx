import React, { useId } from 'react';
import Field from './Field';
import './Input.css';

const renderIconProp = (icon) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function') {
    const IconComp = icon;
    return <IconComp size={16} />;
  }
  return icon;
};

export const Input = React.forwardRef(({
  id: customId,
  label,
  helper,
  error,
  required = false,
  prefix,
  icon,
  suffix,
  size = 'md',
  disabled = false,
  className = '',
  wrapperClassName = '',
  type = 'text',
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = customId || (label ? generatedId : undefined);
  const leadingIcon = prefix || icon;

  const inputElement = (
    <div className={`df-input-container df-input-container--${size} ${error ? 'df-input-container--error' : ''} ${disabled ? 'df-input-container--disabled' : ''} ${className}`}>
      {leadingIcon && <span className="df-input__prefix">{renderIconProp(leadingIcon)}</span>}
      <input
        ref={ref}
        id={inputId}
        type={type}
        disabled={disabled}
        className="df-input__native"
        {...props}
      />
      {suffix && <span className="df-input__suffix">{renderIconProp(suffix)}</span>}
    </div>
  );

  if (label || helper || error) {
    return (
      <Field
        id={inputId}
        label={label}
        helper={helper}
        error={error}
        required={required}
        className={wrapperClassName}
      >
        {inputElement}
      </Field>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';
export default Input;
