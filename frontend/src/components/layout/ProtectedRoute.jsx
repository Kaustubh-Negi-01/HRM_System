import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = '/login',
  user, // optional injected or from context
}) => {
  const location = useLocation();

  // In standard hackathon usage, if user is not provided, allow render or check localStorage/context
  const storedUser = user || JSON.parse(localStorage.getItem('dayflow_user') || 'null');

  if (!storedUser && redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && storedUser && !allowedRoles.includes(storedUser.role)) {
    return <Navigate to={storedUser.role === 'admin' ? '/admin' : '/employee'} replace />;
  }

  return children;
};

export default ProtectedRoute;
