import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  Moon,
  Sun,
  Shield,
  Settings,
  User,
  LogOut,
  Sparkles,
  CheckCircle,
  Calendar,
  AlertTriangle,
  Receipt,
  X,
  CreditCard,
  Building,
  CheckCheck,
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
      desc: 'High overtime detected in Engineering squad.',
      time: '35m ago',
      icon: <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />,
      link: '/admin/workforce-pulse',
      unread: true,
    },
    {
      id: 'n3',
      title: 'Department Budget Variance',
      desc: 'Engineering budget has reached 77% utilization for Q3.',
      time: '50m ago',
      icon: <Building size={16} style={{ color: 'var(--primary)' }} />,
      link: '/admin/payroll',
      unread: true,
    },
    {
      id: 'n4',
      title: 'Payroll Disbursal Ready',
      desc: 'August 2026 cycle ready (₹25,48,000 across 48 employees).',
      time: '1h ago',
      icon: <Receipt size={16} style={{ color: 'var(--success)' }} />,
      link: '/admin/payroll',
      unread: true,
    },
    {
      id: 'n5',
      title: 'Task Deliverable Completed',
      desc: 'Alex Chen marked "Q3 Cloud Security Compliance Audit" as Done.',
      time: '2h ago',
      icon: <CheckCheck size={16} style={{ color: 'var(--success)' }} />,
      link: '/admin',
      unread: false,
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
          navigate('/admin/profile');
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
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Sign Out of Session',
      icon: <LogOut size={15} />,
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <>
      <header className={`df-topbar ${className}`}>
        {/* Left Section: Mobile Menu + Title/Breadcrumbs */}
        <div className="df-topbar__left">
          {onMenuClick && (
            <button
              type="button"
              className="df-topbar__menu-btn"
              onClick={onMenuClick}
              aria-label="Toggle navigation menu"
            >
              <Menu size={20} />
            </button>
          )}

          {title && (
            <div className="df-topbar__headings">
              <h1 className="df-topbar__title">{title}</h1>
              {breadcrumbs.length > 0 && (
                <nav className="df-topbar__breadcrumbs" aria-label="Breadcrumb">
                  <ol className="df-topbar__breadcrumb-list">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={crumb.href || index} className="df-topbar__breadcrumb-item">
                        {index > 0 && <span className="df-topbar__breadcrumb-sep">/</span>}
                        {crumb.href ? (
                          <a href={crumb.href} className="df-topbar__breadcrumb-link">
                            {crumb.label}
                          </a>
                        ) : (
                          <span className="df-topbar__breadcrumb-current">{crumb.label}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          )}
        </div>

        {/* Center: Global Search Bar */}
        {showSearch && (
          <div className="df-topbar__center">
            <SearchBar
              placeholder="Search employees, payroll records, leave applications..."
              onSearch={onSearch}
              size="sm"
            />
          </div>
        )}

        {/* Right Section: Theme Toggle, Notifications, User Menu, Custom Actions */}
        <div className="df-topbar__right">
          {actions}

          {/* Theme Toggle Button */}
          <button
            type="button"
            className="df-topbar__icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
            style={{
              color: theme === 'dark' ? '#FBBF24' : '#38BDF8',
              transition: 'transform 0.2s ease',
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notifications Popover */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              className="df-topbar__icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications (${unreadCount} unread)`}
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--danger)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.8)',
                  }}
                />
              )}
            </button>

            {showNotifications && (
              <div
                className="animate-scale-in"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '320px',
                  backgroundColor: '#0A0A0F',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
                  zIndex: 200,
                  overflow: 'hidden',
                }}
              >
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span className="text-xs font-bold text-primary">System Notifications ({unreadCount})</span>
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
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        backgroundColor: n.unread ? 'rgba(56, 189, 248, 0.06)' : 'transparent',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = n.unread ? 'rgba(56, 189, 248, 0.06)' : 'transparent')
                      }
                    >
                      <div style={{ marginTop: '2px', flexShrink: 0 }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">{n.title}</span>
                          <span className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>{n.time}</span>
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
                <Avatar name={user?.name || 'Saksham Singh'} size="sm" />
                <span className="df-topbar__profile-name">{user?.name || 'Saksham Singh'}</span>
              </button>
            }
          />
        </div>
      </header>

      {/* System Settings Modal */}
      {showSettings && (
        <Modal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          title="System Settings & Infrastructure"
          subtitle="Configure platform parameters, cloud database, and intelligent telemetry."
        >
          <div className="flex flex-col gap-4">
            <div
              style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#040407',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-primary">Supabase Cloud PostgreSQL</h4>
                  <p className="text-xs text-muted">Direct browser & backend real-time database sync</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald">
                  <CheckCircle size={14} /> Connected
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-subtle">
                <div>
                  <h4 className="text-xs font-bold text-primary">Google Gemini AI Engine</h4>
                  <p className="text-xs text-muted">Natural-language HR Copilot & Workforce Pulse</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald">
                  <Sparkles size={14} /> Active
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-subtle">
                <div>
                  <h4 className="text-xs font-bold text-primary">Current Currency Standard</h4>
                  <p className="text-xs text-muted">All payroll and budget figures in INR (₹)</p>
                </div>
                <span className="text-xs font-mono font-bold text-primary">INR (₹)</span>
              </div>
            </div>

            <div className="flex justify-end gap-3" style={{ marginTop: '0.5rem' }}>
              <Button variant="primary" size="sm" onClick={() => setShowSettings(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Topbar;
