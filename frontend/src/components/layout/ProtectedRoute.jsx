import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../ui/Loader';

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/login',
  user: propUser,
}) => {
  const location = useLocation();
  const { user: contextUser, loading } = useAuth();

  const currentUser = propUser || contextUser || (() => {
    try {
      return JSON.parse(localStorage.getItem('dayflow_user') || 'null');
    } catch {
      return null;
    }
  })();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-canvas, #090D16)',
          color: 'var(--primary, #6366F1)',
        }}
      >
        <Loader size="lg" text="Authenticating..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const role = (currentUser.role || 'employee').toLowerCase();
  if (allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
    if (!normalizedAllowed.includes(role)) {
      return <Navigate to={role === 'admin' || role === 'hr' ? '/admin' : '/employee'} replace />;
    }
  }

  return children || <Outlet />;
};

export default ProtectedRoute;
