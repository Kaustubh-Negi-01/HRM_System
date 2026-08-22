import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import './Sidebar.css';

const renderIconProp = (icon, size = 18) => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && (icon.$$typeof || icon.render))) {
    const IconComp = icon;
    return <IconComp size={size} />;
  }
  return null;
};

export const Sidebar = ({
  sections = [],
  user = { name: 'Alex Morgan', role: 'HR Administrator', email: 'alex.morgan@dayflow.io' },
  onLogout,
  isOpen = false,
  onClose,
  collapsed = false,
  className = '',
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="df-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`df-sidebar ${isOpen ? 'df-sidebar--open' : ''} ${collapsed ? 'df-sidebar--collapsed' : ''} ${className}`}
        aria-label="Main Navigation"
      >
        {/* Brand Header */}
        <div className="df-sidebar__brand">
          <div className="df-sidebar__logo">
            <span className="df-sidebar__logo-icon">◈</span>
          </div>
          {!collapsed && (
            <div className="df-sidebar__brand-text">
              <span className="df-sidebar__brand-title">Dayflow</span>
              <span className="df-sidebar__brand-badge">Workforce OS</span>
            </div>
          )}
          {isOpen && (
            <button
              type="button"
              className="df-sidebar__close-mobile"
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="df-sidebar__nav">
          {sections.map((section, sIdx) => (
            <div key={section.title || sIdx} className="df-sidebar__section">
              {section.title && !collapsed && (
                <div className="df-sidebar__section-title">
                  {section.title}
                </div>
              )}
              <ul className="df-sidebar__list">
                {section.items.map((item) => (
                  <li key={item.to || item.label} className="df-sidebar__item">
                    <NavLink
                      to={item.to}
                      end={item.end !== undefined ? item.end : item.to.split('/').length <= 2}
                      className={({ isActive }) =>
                        `df-sidebar__link ${isActive ? 'df-sidebar__link--active' : ''}`
                      }
                      onClick={() => {
                        if (onClose) onClose();
                      }}
                      title={collapsed ? item.label : undefined}
                    >
                      {item.icon && <span className="df-sidebar__link-icon">{renderIconProp(item.icon)}</span>}
                      {!collapsed && <span className="df-sidebar__link-label">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="df-sidebar__link-badge">
                          <Badge variant={item.badgeVariant || 'primary'} size="sm">
                            {item.badge}
                          </Badge>
                        </span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="df-sidebar__footer">
          <div className="df-sidebar__user">
            <Avatar name={user.name} size={collapsed ? 'sm' : 'md'} status="online" />
            {!collapsed && (
              <div className="df-sidebar__user-info">
                <span className="df-sidebar__user-name">{user.name}</span>
                <span className="df-sidebar__user-role">{user.role}</span>
              </div>
            )}
          </div>
          {onLogout && !collapsed && (
            <button
              type="button"
              className="df-sidebar__logout-btn"
              onClick={onLogout}
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
