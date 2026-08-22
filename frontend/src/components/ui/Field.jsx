import React from 'react';
import './Field.css';

export const Field = ({
  id,
  label,
  required = false,
  helper,
  error,
  children,
  className = '',
}) => {
  return (
    <div className={`df-field ${error ? 'df-field--has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="df-field__label">
          {label}
          {required && <span className="df-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="df-field__control">
        {children}
      </div>
      {error ? (
        <p className="df-field__error" role="alert">{error}</p>
      ) : helper ? (
        <p className="df-field__helper">{helper}</p>
      ) : null}
    </div>
  );
};

export default Field;
