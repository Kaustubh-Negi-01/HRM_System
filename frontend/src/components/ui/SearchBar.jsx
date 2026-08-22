import React, { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = 'Search...',
  debounceTime = 300,
  size = 'md',
  onClear,
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(
    controlledValue !== undefined ? controlledValue : defaultValue
  );

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    if (debounceTime > 0 && onChange) {
      const timer = setTimeout(() => {
        onChange(internalValue);
      }, debounceTime);
      return () => clearTimeout(timer);
    }
  }, [internalValue, debounceTime, onChange]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInternalValue(val);
    if (debounceTime === 0 && onChange) {
      onChange(val);
    }
  };

  const handleClear = () => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
  };

  return (
    <div className={`df-searchbar df-searchbar--${size} ${className}`}>
      <span className="df-searchbar__icon" aria-hidden="true">
        <Search size={16} />
      </span>
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="df-searchbar__input"
        {...props}
      />
      {internalValue && (
        <button
          type="button"
          className="df-searchbar__clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
