import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Activity,
  Sparkles,
  Bot,
  Palette,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import './AdminLayout.css';

const ADMIN_NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', to: '/admin', icon: <LayoutDashboard size={18} />, end: true },
      { label: 'Employees', to: '/admin/employees', icon: <Users size={18} /> },
      { label: 'Attendance', to: '/admin/attendance', icon: <CalendarCheck size={18} /> },
      { label: 'Leave Approvals', to: '/admin/leave-approvals', icon: <CalendarDays size={18} />, badge: '12', badgeVariant: 'warning' },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'Workforce Pulse', to: '/admin/workforce-pulse', icon: <Activity size={18} />, badge: 'LIVE', badgeVariant: 'primary' },
      { label: 'Smart Leave Impact', to: '/admin/leave-impact', icon: <Sparkles size={18} /> },
      { label: 'HR Copilot', to: '/admin/hr-copilot', icon: <Bot size={18} /> },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Payroll', to: '/admin/payroll', icon: <CreditCard size={18} /> },
    ],
  },
  {
    title: 'DESIGN SYSTEM',
    items: [
      { label: 'UI Catalog', to: '/admin/design', icon: <Palette size={18} />, badge: 'DEV', badgeVariant: 'neutral' },
    ],
  },
];

export const AdminLayout = ({
  user = { name: 'Alex Morgan', role: 'HR Administrator', email: 'alex.morgan@dayflow.io' },
  customSections,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('dayflow_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Generate breadcrumb info from path
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Dayflow', to: '/admin' },
    ...pathSegments.slice(1).map((segment, idx) => ({
      label: segment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      to: idx === pathSegments.length - 2 ? `/admin/${segment}` : undefined,
    })),
  ];

  return (
    <div className="df-admin-shell">
      <Sidebar
        sections={customSections || ADMIN_NAV_SECTIONS}
        user={user}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="df-admin-main">
        <Topbar
          user={user}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />
        
        <div className="df-admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
