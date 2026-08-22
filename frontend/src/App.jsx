import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AdminLayout, EmployeeLayout, AuthLayout } from './layout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import Styleguide from './pages/admin/Styleguide';
import PageContainer from './components/layout/PageContainer';
import { EmptyState } from './components/ui';

// Placeholder Component for Saksham to build onto
const PagePlaceholder = ({ title, subtitle }) => (
  <PageContainer title={title} subtitle={subtitle}>
    <EmptyState
      title={`${title} Module`}
      description={`This module is connected to the Dayflow design system and ready for feature implementation by Saksham.`}
    />
  </PageContainer>
);

export const App = () => {
  return (
    <Routes>
      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="design" element={<Styleguide />} />
        <Route
          path="employees"
          element={<PagePlaceholder title="Employees Directory" subtitle="Manage company workforce and role assignments" />}
        />
        <Route
          path="attendance"
          element={<PagePlaceholder title="Attendance Records" subtitle="Daily presence, check-in logs, and shift tracking" />}
        />
        <Route
          path="leave-approvals"
          element={<PagePlaceholder title="Leave Approvals" subtitle="Review incoming employee leave requests and impact scores" />}
        />
        <Route
          path="workforce-pulse"
          element={<PagePlaceholder title="Workforce Pulse" subtitle="Live analytics on workforce health, attendance rate, and leave load" />}
        />
        <Route
          path="leave-impact"
          element={<PagePlaceholder title="Smart Leave Impact" subtitle="Predictive team coverage simulator and risk analysis" />}
        />
        <Route
          path="hr-copilot"
          element={<PagePlaceholder title="HR Copilot" subtitle="Conversational workforce intelligence assistant" />}
        />
        <Route
          path="payroll"
          element={<PagePlaceholder title="Payroll Management" subtitle="Disbursements, salary structures, and tax deductions" />}
        />
      </Route>

      {/* Employee Protected Routes */}
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route
          index
          element={<PagePlaceholder title="My Dashboard" subtitle="Personal workforce overview and recent requests" />}
        />
        <Route
          path="profile"
          element={<PagePlaceholder title="My Profile" subtitle="Personal details, emergency contacts, and job information" />}
        />
        <Route
          path="attendance"
          element={<PagePlaceholder title="My Attendance" subtitle="Clock-in history and timesheets" />}
        />
        <Route
          path="leave"
          element={<PagePlaceholder title="My Leave Requests" subtitle="Apply for leave and track approval status" />}
        />
        <Route
          path="payroll"
          element={<PagePlaceholder title="My Payslips" subtitle="Monthly salary slips and tax breakdown" />}
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
