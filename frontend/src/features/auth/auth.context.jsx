import React, { createContext, useState, useEffect } from 'react';
import authService from './auth.service';
import { isAdmin as checkIsAdmin, isManager as checkIsManager } from '../../utils/permissions';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dayflow_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const setUser = (newUser) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('dayflow_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('dayflow_user');
      localStorage.removeItem('dayflow_token');
    }
  };

  const initAuth = async () => {
    const token = localStorage.getItem('dayflow_token');
    if (!token) return;
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (err) {
      console.warn('Initial auth check resolved with cached user');
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
      const activeUser = response?.user || response?.data?.user || response;
      setUser(activeUser);
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
      title: role === 'admin' ? 'HR Director' : 'Lead Engineer',
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
