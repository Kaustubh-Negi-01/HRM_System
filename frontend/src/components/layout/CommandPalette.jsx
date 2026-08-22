import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Activity,
  Sparkles,
  Bot,
  User,
  Clock,
  Download,
  Sun,
  Moon,
  ArrowRight,
  Command,
  X,
} from 'lucide-react';

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const COMMANDS = [
    {
      id: 'cmd_dash',
      title: 'Executive Command Dashboard',
      subtitle: 'Overview of enterprise workforce KPIs and live metrics',
      icon: <LayoutDashboard size={18} style={{ color: 'var(--primary)' }} />,
      action: () => navigate('/admin'),
      category: 'Navigation',
    },
    {
      id: 'cmd_pulse',
      title: 'Workforce Pulse™ Telemetry',
      subtitle: 'Real-time burnout radar, health index, and capacity indicators',
      icon: <Activity size={18} style={{ color: 'var(--pulse-cyan)' }} />,
      action: () => navigate('/admin/workforce-pulse'),
      category: 'Intelligence',
    },
    {
      id: 'cmd_leave_impact',
      title: 'Smart Leave Impact™ Simulator',
      subtitle: 'Simulate team coverage and detect overlapping absences',
      icon: <Sparkles size={18} style={{ color: 'var(--primary)' }} />,
      action: () => navigate('/admin/leave-impact'),
      category: 'Intelligence',
    },
    {
      id: 'cmd_copilot',
      title: 'Ask AI HR Copilot',
      subtitle: 'Natural language queries over live workforce records',
      icon: <Bot size={18} style={{ color: 'var(--emerald)' }} />,
      action: () => navigate('/admin/copilot'),
      category: 'Intelligence',
    },
    {
      id: 'cmd_payroll',
      title: 'Payroll & Manager Budget Planner',
      subtitle: 'Compensation ledger and departmental headcount runways in INR (₹)',
      icon: <CreditCard size={18} style={{ color: 'var(--success)' }} />,
      action: () => navigate('/admin/payroll'),
      category: 'Management',
    },
    {
      id: 'cmd_employees',
      title: 'Workforce Directory',
      subtitle: 'Manage employee profiles, roles, and CSV exports',
      icon: <Users size={18} style={{ color: 'var(--primary)' }} />,
      action: () => navigate('/admin/employees'),
      category: 'Management',
    },
    {
      id: 'cmd_employee_portal',
      title: 'Employee Workspace & Punch Clock',
      subtitle: 'Live digital clock, shift punch in/out, and sprint tasks',
      icon: <Clock size={18} style={{ color: 'var(--pulse-cyan)' }} />,
      action: () => navigate('/employee'),
      category: 'Workspace',
    },
    {
      id: 'cmd_profile',
      title: 'My Profile & Identity',
      subtitle: 'Manage contact details, emergency numbers, and employment records',
      icon: <User size={18} style={{ color: 'var(--primary)' }} />,
      action: () => navigate('/admin/profile'),
      category: 'Account',
    },
  ];

  const filteredCommands = COMMANDS.filter((cmd) => {
    const text = (cmd.title + ' ' + cmd.subtitle + ' ' + cmd.category).toLowerCase();
    return text.includes(query.toLowerCase());
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new Event('dayflow_open_command_palette'));
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        zIndex: 9999,
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#0A0A0F',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.95)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search Bar Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Search size={20} style={{ color: 'var(--primary)' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page name, or query... (↑↓ to navigate, ↵ to run)"
            autoFocus
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F8FAFC',
              fontSize: '0.9375rem',
            }}
          />
          <div
            style={{
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              fontSize: '0.6875rem',
              color: '#94A3B8',
              fontFamily: 'monospace',
            }}
          >
            ESC
          </div>
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: '340px',
            overflowY: 'auto',
            padding: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B', fontSize: '0.8125rem' }}>
              No commands matching "{query}"
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.25)' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#040407',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: isSelected ? '#38BDF8' : '#F8FAFC' }}>
                          {cmd.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            padding: '0.1rem 0.375rem',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            color: '#94A3B8',
                          }}
                        >
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted" style={{ marginTop: '0.15rem' }}>
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && <ArrowRight size={16} style={{ color: '#38BDF8' }} />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          className="flex items-center justify-between text-xs text-muted"
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#060609',
            fontSize: '0.6875rem',
          }}
        >
          <span>DayFlow Global Command Palette</span>
          <span className="flex items-center gap-1 font-mono">
            <Command size={11} /> + K
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
