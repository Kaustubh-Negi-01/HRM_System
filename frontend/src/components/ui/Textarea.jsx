import React, { useId } from 'react';
import Field from './Field';
import './Textarea.css';

export const Textarea = React.forwardRef(({
  id: customId,
  label,
  helper,
  error,
  required = false,
  rows = 3,
  disabled = false,
  className = '',
  wrapperClassName = '',
  ...props
}, ref) => {
  const generatedId = useId();
  const textareaId = customId || (label ? generatedId : undefined);

  const textareaElement = (
    <div className={`df-textarea-container ${error ? 'df-textarea-container--error' : ''} ${disabled ? 'df-textarea-container--disabled' : ''} ${className}`}>
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className="df-textarea__native"
        {...props}
      />
    </div>
  );

  if (label || helper || error) {
    return (
      <Field
        id={textareaId}
        label={label}
        helper={helper}
        error={error}
        required={required}
        className={wrapperClassName}
      >
        {textareaElement}
      </Field>
    );
  }

  return textareaElement;
});

Textarea.displayName = 'Textarea';
export default Textarea;
