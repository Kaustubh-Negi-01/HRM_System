import React, { useState, useRef, useEffect } from 'react';
import './Dropdown.css';

export const Dropdown = ({
  trigger,
  items = [],
  align = 'end', // 'start' | 'end' | 'center'
  className = '',
  menuClassName = '',
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleItemClick = (item) => {
    if (item.disabled) return;
    if (item.onClick) item.onClick();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`df-dropdown ${className}`}>
      <div
        className="df-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {isOpen && (
        <div className={`df-dropdown__menu df-dropdown__menu--align-${align} ${menuClassName}`}>
          {items && items.length > 0 ? (
            items.map((item, index) => {
              if (item.divider) {
                return <div key={`divider-${index}`} className="df-dropdown__divider" />;
              }

              return (
                <button
                  key={item.key || index}
                  type="button"
                  disabled={item.disabled}
                  className={`df-dropdown__item ${item.danger ? 'df-dropdown__item--danger' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon && <span className="df-dropdown__item-icon">{item.icon}</span>}
                  <span className="df-dropdown__item-label">{item.label}</span>
                  {item.badge && <span className="df-dropdown__item-badge">{item.badge}</span>}
                </button>
              );
            })
          ) : (
            children
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
