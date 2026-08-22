import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthProvider, { AuthContext } from './features/auth/auth.context';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeAttendance from './pages/employee/EmployeeAttendance';
import EmployeeLeave from './pages/employee/EmployeeLeave';
import EmployeePayroll from './pages/employee/EmployeePayroll';
import EmployeeProfile from './pages/employee/EmployeeProfile';

// Admin Pages & Key Differentiators
import AdminDashboard from './pages/admin/AdminDashboard';
import Employees from './pages/admin/Employees';
import EmployeeDetails from './pages/admin/EmployeeDetails';
import AdminAttendance from './pages/admin/AdminAttendance';
import LeaveApprovals from './pages/admin/LeaveApprovals';
import PayrollManagement from './pages/admin/PayrollManagement';
import WorkforcePulse from './pages/admin/WorkforcePulse';
import LeaveImpact from './pages/admin/LeaveImpact';
import HRCopilot from './pages/admin/HRCopilot';

// Master App Shell with Sidebar & Topbar
const AppLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
};

// Root index redirection helper
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = React.useContext(AuthContext);

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin' || user?.role === 'hr') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/employee/dashboard" replace />;
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Employee Workspace */}
          <Route element={<ProtectedRoute allowedRoles={['employee', 'admin', 'hr', 'manager']} />}>
            <Route element={<AppLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/attendance" element={<EmployeeAttendance />} />
              <Route path="/employee/leave" element={<EmployeeLeave />} />
              <Route path="/employee/payroll" element={<EmployeePayroll />} />
              <Route path="/employee/profile" element={<EmployeeProfile />} />
            </Route>
          </Route>

          {/* Protected Admin & Workforce Intelligence Suite */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'hr', 'manager']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/employees" element={<Employees />} />
              <Route path="/admin/employees/:id" element={<EmployeeDetails />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
              <Route path="/admin/leave-approvals" element={<LeaveApprovals />} />
              <Route path="/admin/payroll" element={<PayrollManagement />} />
              {/* 3 Key Differentiators */}
              <Route path="/admin/workforce-pulse" element={<WorkforcePulse />} />
              <Route path="/admin/leave-impact" element={<LeaveImpact />} />
              <Route path="/admin/copilot" element={<HRCopilot />} />
            </Route>
          </Route>

          {/* Root and Catch-All */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
