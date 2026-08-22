import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Calendar,
  X,
  Database,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown } from '../ui/Dropdown';
import { SearchBar } from '../ui/SearchBar';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import './Topbar.css';

export const Topbar = ({
  title,
  breadcrumbs = [],
  user = { name: 'Saksham Singh', role: 'HR Administrator', email: 'admin@dayflow.internal' },
  onMenuClick,
  onLogout,
  onSearch,
  actions,
  showSearch = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('dayflow_theme') || 'dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'New Leave Application',
      desc: 'Priya Sharma applied for 4 days Annual Leave.',
      time: '10m ago',
      icon: <Calendar size={16} className="text-primary" />,
      link: '/admin/leave-approvals',
      unread: true,
    },
    {
      id: 'n2',
      title: 'Workforce Pulse Alert',
      desc: 'High overtime detected in Engineering team.',
      time: '35m ago',
      icon: <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />,
      link: '/admin/workforce-pulse',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Payroll Disbursal Ready',
      desc: 'August 2026 cycle ready ($382,400 across 52 employees).',
      time: '1h ago',
      icon: <DollarSign size={16} style={{ color: 'var(--success)' }} />,
      link: '/admin/payroll',
      unread: true,
    },
  ]);
  const notifRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('dayflow_theme', theme);
  }, [theme]);

  // Click outside to close notifications popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

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
      label: 'System Settings',
      icon: <Settings size={15} />,
      onClick: () => setShowSettings(true),
    },
    {
      key: 'theme_toggle',
      label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />,
      onClick: toggleTheme,
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
    <>
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
            {Array.isArray(breadcrumbs) && breadcrumbs.length > 0 && (
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

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="df-topbar__icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              color: theme === 'dark' ? '#FBBF24' : '#6366F1',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Popover */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              className="df-topbar__icon-btn"
              aria-label="Notifications"
              title="Notifications"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="df-topbar__badge" aria-label={`${unreadCount} notifications`}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                className="glass-panel animate-scale-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '340px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-surface)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <span className="text-xs font-bold text-primary">System Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false);
                        if (n.link) navigate(n.link);
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        backgroundColor: n.unread ? 'rgba(99, 102, 241, 0.06)' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.12)')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = n.unread ? 'rgba(99, 102, 241, 0.06)' : 'transparent')
                      }
                    >
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">{n.title}</span>
                          <span className="text-xs text-muted">{n.time}</span>
                        </div>
                        <p className="text-xs text-secondary" style={{ marginTop: '2px', lineHeight: 1.4 }}>
                          {n.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

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

      {/* Interactive Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="DayFlow System & Workspace Settings"
        size="md"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Appearance Section */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface-elevated)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-primary">Interface Theme</h4>
                <p className="text-xs text-secondary" style={{ marginTop: '2px' }}>
                  Toggle between high-contrast Obsidian Dark and Crisp Slate Light theme.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={theme === 'dark' ? Sun : Moon}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>

          {/* Cloud Database Integration Status */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface-elevated)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database size={20} style={{ color: 'var(--success)' }} />
                <div>
                  <h4 className="text-sm font-bold text-primary">Supabase Cloud Database</h4>
                  <p className="text-xs text-muted">Connected to https://lfjtliopljgnrwklnvlu.supabase.co</p>
                </div>
              </div>
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  fontSize: '0.6875rem',
                  fontWeight: 'bold',
                }}
              >
                Active
              </span>
            </div>
          </div>

          {/* Gemini AI Intelligence Status */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface-elevated)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu size={20} style={{ color: 'var(--pulse-cyan)' }} />
                <div>
                  <h4 className="text-sm font-bold text-primary">Google Gemini 1.5 Flash Copilot</h4>
                  <p className="text-xs text-muted">Autonomous workforce telemetry synthesis</p>
                </div>
              </div>
              <span
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--pulse-cyan-bg)',
                  color: 'var(--pulse-cyan)',
                  fontSize: '0.6875rem',
                  fontWeight: 'bold',
                }}
              >
                Online
              </span>
            </div>
          </div>

          {/* Active User Session Details */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-surface-elevated)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
                <div>
                  <h4 className="text-sm font-bold text-primary">Signed In Account</h4>
                  <p className="text-xs text-muted">
                    {user?.name} ({user?.role}) • {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="primary" size="sm" onClick={() => setShowSettings(false)}>
            Close Settings
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Topbar;
