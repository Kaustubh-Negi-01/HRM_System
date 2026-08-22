import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  CalendarDays,
  CreditCard,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { useAuth } from '../hooks/useAuth';
import './EmployeeLayout.css';

const EMPLOYEE_NAV_SECTIONS = [
  {
    title: 'MY WORKSPACE',
    items: [
      { label: 'Dashboard', to: '/employee', icon: <LayoutDashboard size={18} />, end: true },
      { label: 'My Profile', to: '/employee/profile', icon: <User size={18} /> },
      { label: 'My Attendance', to: '/employee/attendance', icon: <CalendarCheck size={18} /> },
      { label: 'My Leave', to: '/employee/leave', icon: <CalendarDays size={18} /> },
      { label: 'My Payslips', to: '/employee/payroll', icon: <CreditCard size={18} /> },
    ],
  },
];

export const EmployeeLayout = ({
  user: propUser,
}) => {
  const { user: authUser, logout } = useAuth();
  const activeUser = propUser || authUser || { name: 'Employee', role: 'Staff Member', email: 'alex.chen@dayflow.internal' };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Employee Portal', to: '/employee' },
    ...pathSegments.slice(1).map((segment, idx) => ({
      label: segment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
      to: idx === pathSegments.length - 2 ? `/employee/${segment}` : undefined,
    })),
  ];

  return (
    <div className="df-employee-shell">
      <Sidebar
        sections={EMPLOYEE_NAV_SECTIONS}
        user={activeUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <div className="df-employee-main">
        <Topbar
          user={activeUser}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
          showSearch={false}
        />
        
        <div className="df-employee-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;
