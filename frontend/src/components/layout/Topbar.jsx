import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { SearchBar } from '../ui/SearchBar';
import './Topbar.css';

export const Topbar = ({
  title,
  breadcrumbs = [],
  user = { name: 'Alex Morgan', role: 'HR Administrator', email: 'alex.morgan@dayflow.io' },
  onMenuClick,
  onLogout,
  onSearch,
  notificationCount = 3,
  actions,
  showSearch = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const userMenuItems = [
    {
      key: 'profile',
      label: 'My Profile',
      icon: <User size={15} />,
      onClick: () => {
        const role = (user?.role || '').toLowerCase();
        if (role === 'admin' || role === 'hr') {
          navigate('/admin/employees');
        } else {
          navigate('/employee/profile');
        }
      },
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <Settings size={15} />,
      onClick: () => {
        const role = (user?.role || '').toLowerCase();
        if (role === 'admin' || role === 'hr') {
          navigate('/admin/settings');
        } else {
          navigate('/employee/profile');
        }
      },
    },
    {
      divider: true,
    },
    {
      key: 'logout',
      label: 'Sign Out',
      icon: <LogOut size={15} />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <header className={`df-topbar ${className}`}>
      <div className="df-topbar__left">
        {onMenuClick && (
          <button
            type="button"
            className="df-topbar__hamburger"
            onClick={onMenuClick}
            aria-label="Open sidebar navigation"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="df-topbar__titles">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="df-topbar__breadcrumbs" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, idx) => (
                <span key={crumb.label || idx} className="df-topbar__crumb">
                  {crumb.to ? (
                    <Link to={crumb.to} className="df-topbar__crumb-link">{crumb.label}</Link>
                  ) : (
                    <span className="df-topbar__crumb-current">{crumb.label}</span>
                  )}
                  {idx < breadcrumbs.length - 1 && (
                    <span className="df-topbar__crumb-sep">/</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          {title && <h1 className="df-topbar__title">{title}</h1>}
        </div>
      </div>

      <div className="df-topbar__right">
        {showSearch && (
          <div className="df-topbar__search">
            <SearchBar
              placeholder="Search employees, requests, metrics..."
              size="sm"
              onChange={onSearch}
            />
          </div>
        )}

        {actions && <div className="df-topbar__actions">{actions}</div>}

        {/* Notifications */}
        <button
          type="button"
          className="df-topbar__icon-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="df-topbar__badge" aria-label={`${notificationCount} notifications`}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          align="end"
          items={userMenuItems}
          trigger={
            <button
              type="button"
              className="df-topbar__profile-trigger"
              aria-label="User menu"
            >
              <Avatar name={user?.name || 'User'} size="sm" />
              <span className="df-topbar__profile-name">{user?.name || 'User'}</span>
            </button>
          }
        />
      </div>
    </header>
  );
};

export default Topbar;
