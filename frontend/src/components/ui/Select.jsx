import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import Field from './Field';
import './Select.css';

export const Select = React.forwardRef(({
  id: customId,
  label,
  helper,
  error,
  required = false,
  options = [],
  placeholder,
  size = 'md',
  disabled = false,
  className = '',
  wrapperClassName = '',
  children,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = customId || (label ? generatedId : undefined);

  const selectElement = (
    <div className={`df-select-container df-select-container--${size} ${error ? 'df-select-container--error' : ''} ${disabled ? 'df-select-container--disabled' : ''} ${className}`}>
      <select
        ref={ref}
        id={selectId}
        disabled={disabled}
        className="df-select__native"
        {...props}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options && options.length > 0 ? (
          options.map((opt, idx) => {
            if (typeof opt === 'object' && opt !== null) {
              return (
                <option key={opt.value ?? idx} value={opt.value} disabled={opt.disabled}>
                  {opt.label ?? opt.value}
                </option>
              );
            }
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            );
          })
        ) : (
          children
        )}
      </select>
      <span className="df-select__icon" aria-hidden="true">
        <ChevronDown size={16} />
      </span>
    </div>
  );

  if (label || helper || error) {
    return (
      <Field
        id={selectId}
        label={label}
        helper={helper}
        error={error}
        required={required}
        className={wrapperClassName}
      >
        {selectElement}
      </Field>
    );
  }

  return selectElement;
});

Select.displayName = 'Select';
export default Select;
