import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export const AuthLayout = ({
  title = 'Welcome to Dayflow',
  subtitle = 'Intelligent Workforce OS',
  children,
}) => {
  return (
    <div className="df-auth-shell">
      <div className="df-auth-card">
        <div className="df-auth-header">
          <div className="df-auth-logo">
            <span className="df-auth-logo-icon">◈</span>
          </div>
          <h1 className="df-auth-title">{title}</h1>
          <p className="df-auth-subtitle">{subtitle}</p>
        </div>

        <div className="df-auth-body">
          {children || <Outlet />}
        </div>

        <div className="df-auth-footer">
          <span>Protected by Enterprise Role-Based Access Control</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
