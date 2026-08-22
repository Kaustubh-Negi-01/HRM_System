import React, { createContext, useState, useEffect } from 'react';
import authService from './auth.service';
import { isAdmin as checkIsAdmin, isManager as checkIsManager } from '../../utils/permissions';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('dayflow:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('dayflow:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (role) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      role,
      title: role === 'admin' ? 'HR Director' : 'Senior Engineer',
    };
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: checkIsAdmin(user),
    isManager: checkIsManager(user),
    login,
    logout,
    switchRole,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
