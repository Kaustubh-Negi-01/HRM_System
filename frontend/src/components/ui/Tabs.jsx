import React from 'react';
import './Tabs.css';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'line',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`df-tabs df-tabs--${variant} df-tabs--${size} ${className}`} role="tablist">
      {(Array.isArray(tabs) ? tabs : []).map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            className={`df-tab-item ${isActive ? 'df-tab-item--active' : ''}`}
            onClick={() => onChange && onChange(tab.id)}
          >
            {tab.icon && <span className="df-tab-item__icon">{tab.icon}</span>}
            <span className="df-tab-item__label">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="df-tab-item__badge">{tab.badge}</span>
            )}
            {tab.count !== undefined && (
              <span className="df-tab-item__count">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
