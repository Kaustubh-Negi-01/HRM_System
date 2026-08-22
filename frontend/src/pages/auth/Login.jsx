import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Sparkles,
  Mail,
  Lock,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  Users,
  X,
  UserPlus,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@dayflow.internal');
  const [password, setPassword] = useState('Password123!');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google Modal States
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [signingGoogleUser, setSigningGoogleUser] = useState(null);

  // Forgot Password Modal States
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePersonaSelect = (role, demoEmail, demoPass) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword(demoPass || 'Password123!');
    setError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password, role: selectedRole });
      const userRole = (res?.user?.role || res?.role || selectedRole || 'admin').toLowerCase();
      if (userRole === 'admin' || userRole === 'hr') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAccountLogin = async (acc) => {
    setSigningGoogleUser(acc.email);
    setTimeout(async () => {
      const role = acc.role || (acc.email.includes('admin') || acc.name.includes('Saksham') ? 'admin' : 'employee');
      const googleUser = {
        name: acc.name,
        email: acc.email,
        role,
        department: acc.department || 'Human Resources',
        title: acc.title || (role === 'admin' ? 'HR Director' : 'Lead Engineer'),
        avatarUrl: acc.avatarUrl,
        provider: 'google',
      };
      await login(googleUser);
      setGoogleModalOpen(false);
      setSigningGoogleUser(null);
      if (role === 'admin' || role === 'hr') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    }, 600);
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) return;
    const namePart = customGoogleEmail.split('@')[0];
    const derivedName = namePart.split('.').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') || 'Google User';
    handleGoogleAccountLogin({
      name: derivedName,
      email: customGoogleEmail.trim(),
      role: customGoogleEmail.toLowerCase().includes('admin') ? 'admin' : 'employee',
      department: 'Engineering',
      title: 'Member of Technical Staff',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=0284C7&color=fff`,
    });
  };

  const handlePasswordResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim() || !newPassword.trim()) return;
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setResetSuccess(true);
      setPassword(newPassword);
      setEmail(resetEmail);
      setTimeout(() => {
        setForgotModalOpen(false);
        setResetSuccess(false);
      }, 1500);
    }, 800);
  };

  const GOOGLE_ACCOUNTS = [
    {
      name: 'Saksham Singh',
      email: 'saksham.singh@gmail.com',
      role: 'admin',
      department: 'Human Resources',
      title: 'HR Director',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Alex Chen',
      email: 'alex.chen.dev@gmail.com',
      role: 'employee',
      department: 'Engineering',
      title: 'Lead Fullstack Engineer',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma.hq@gmail.com',
      role: 'employee',
      department: 'Customer Support',
      title: 'Support Operations Lead',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        padding: '1.5rem',
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56, 189, 248, 0.12), transparent),
          radial-gradient(ellipse 50% 30% at 80% 80%, rgba(6, 182, 212, 0.08), transparent)
        `,
      }}
    >
      <div style={{ width: '100%', maxWidth: '460px' }} className="animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 30px rgba(2, 132, 199, 0.4)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={28} />
          </div>
          <h1
            className="text-3xl font-black text-primary"
            style={{
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DAYFLOW
          </h1>
          <p
            className="text-xs font-semibold text-secondary"
            style={{ marginTop: '0.35rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Intelligent Workforce Operating System
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Google 1-Click Sign-In Button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              color: '#1F2937',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 150ms ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              margin: '1.25rem 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
            <span className="text-xs text-muted" style={{ textTransform: 'uppercase', fontSize: '0.6875rem' }}>
              Or choose demo persona
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Quick Demo Persona Switcher */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePersonaSelect('admin', 'admin@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.625rem 0.5rem',
                  borderRadius: '10px',
                  border: `1px solid ${selectedRole === 'admin' ? '#38BDF8' : 'rgba(255, 255, 255, 0.08)'}`,
                  backgroundColor:
                    selectedRole === 'admin' ? 'rgba(56, 189, 248, 0.12)' : 'rgba(16, 16, 23, 0.8)',
                  color: selectedRole === 'admin' ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck size={14} style={{ color: '#38BDF8' }} />
                  <span className="text-xs font-bold text-primary" style={{ fontSize: '0.6875rem' }}>
                    Saksham
                  </span>
                </div>
                <span className="text-xs text-muted" style={{ fontSize: '0.625rem' }}>
                  Admin / HR
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('employee', 'alex.chen@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.625rem 0.5rem',
                  borderRadius: '10px',
                  border: `1px solid ${selectedRole === 'employee' && email.includes('alex') ? '#06B6D4' : 'rgba(255, 255, 255, 0.08)'}`,
                  backgroundColor:
                    selectedRole === 'employee' && email.includes('alex')
                      ? 'rgba(6, 182, 212, 0.15)'
                      : 'rgba(16, 16, 23, 0.8)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <UserCheck size={14} style={{ color: '#22D3EE' }} />
                  <span className="text-xs font-bold text-primary" style={{ fontSize: '0.6875rem' }}>
                    Alex Chen
                  </span>
                </div>
                <span className="text-xs text-muted" style={{ fontSize: '0.625rem' }}>
                  Engineer
                </span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('employee', 'priya.sharma@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.625rem 0.5rem',
                  borderRadius: '10px',
                  border: `1px solid ${email.includes('priya') ? '#10B981' : 'rgba(255, 255, 255, 0.08)'}`,
                  backgroundColor: email.includes('priya')
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(16, 16, 23, 0.8)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Users size={14} style={{ color: '#34D399' }} />
                  <span className="text-xs font-bold text-primary" style={{ fontSize: '0.6875rem' }}>
                    Priya
                  </span>
                </div>
                <span className="text-xs text-muted" style={{ fontSize: '0.625rem' }}>
                  Manager
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {error && (
              <div
                className="text-xs font-semibold animate-fade-in"
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#F87171',
                }}
              >
                {error}
              </div>
            )}

            <div>
              <label
                className="text-xs font-semibold text-secondary"
                style={{ display: 'block', marginBottom: '0.375rem' }}
              >
                Work Email
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#060609',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.625rem 0.875rem',
                }}
              >
                <Mail size={16} style={{ color: '#64748B' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@dayflow.internal"
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#F8FAFC',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.375rem' }}>
                <label className="text-xs font-semibold text-secondary">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setForgotModalOpen(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#060609',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.625rem 0.875rem',
                }}
              >
                <Lock size={16} style={{ color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#F8FAFC',
                    fontSize: '0.875rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.75rem',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(2, 132, 199, 0.4)',
                transition: 'all 150ms ease',
              }}
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Enter DayFlow OS</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div
            className="flex items-center justify-between text-xs text-muted"
            style={{
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span>Internal Hackathon Build</span>
            <span className="flex items-center gap-1 text-emerald font-semibold">
              <CheckCircle size={12} /> Supabase Cloud Connected
            </span>
          </div>
        </div>
      </div>

      {/* Google Account Picker Modal */}
      {googleModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#0A0A0F',
              color: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <div className="flex items-center gap-2">
                <svg width="22" height="22" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <h3 className="text-base font-bold text-primary">
                  Sign in with Google
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted" style={{ marginBottom: '1rem', lineHeight: 1.4 }}>
              Choose an account to continue to <strong>DayFlow Workforce OS</strong>:
            </p>

            {/* List of Google Accounts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleGoogleAccountLogin(acc)}
                  disabled={Boolean(signingGoogleUser)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: signingGoogleUser === acc.email ? 'rgba(56, 189, 248, 0.15)' : '#111116',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#181820')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      signingGoogleUser === acc.email ? 'rgba(56, 189, 248, 0.15)' : '#111116')
                  }
                >
                  <img
                    src={acc.avatarUrl}
                    alt={acc.name}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary">
                        {acc.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '999px',
                          backgroundColor: acc.role === 'admin' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                          color: acc.role === 'admin' ? '#38BDF8' : '#22D3EE',
                          fontWeight: 700,
                        }}
                      >
                        {acc.role === 'admin' ? 'Admin' : 'Employee'}
                      </span>
                    </div>
                    <span className="text-xs text-muted" style={{ fontSize: '0.75rem' }}>
                      {acc.email}
                    </span>
                  </div>
                  {signingGoogleUser === acc.email && (
                    <div
                      className="pulse-indicator"
                      style={{ width: '8px', height: '8px', backgroundColor: '#38BDF8' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Google Account Form */}
            {showCustomInput ? (
              <form onSubmit={handleCustomGoogleSubmit} style={{ marginTop: '0.75rem' }}>
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="Enter your Gmail address..."
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '8px',
                    backgroundColor: '#060609',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    fontSize: '0.8125rem',
                    outline: 'none',
                    marginBottom: '0.5rem',
                    color: '#F8FAFC',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Continue with this Account
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem',
                  borderRadius: '8px',
                  border: '1px dashed rgba(255, 255, 255, 0.15)',
                  background: 'none',
                  color: '#94A3B8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <UserPlus size={14} />
                <span>Use another Google account</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Forgot / Reset Password Modal */}
      {forgotModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            className="animate-scale-in"
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#0A0A0F',
              color: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
              <div className="flex items-center gap-2">
                <KeyRound size={20} style={{ color: 'var(--primary)' }} />
                <h3 className="text-base font-bold text-primary">Reset Account Password</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setResetSuccess(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {resetSuccess ? (
              <div
                className="flex flex-col items-center text-center animate-fade-in"
                style={{ padding: '1.5rem 0' }}
              >
                <CheckCircle2 size={42} style={{ color: 'var(--success)', marginBottom: '0.75rem' }} />
                <h4 className="text-sm font-bold text-primary">Password Reset Successfully!</h4>
                <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                  Your password has been updated. Logging in with new credentials...
                </p>
              </div>
            ) : (
              <form onSubmit={handlePasswordResetSubmit} className="flex flex-col gap-3">
                <p className="text-xs text-secondary" style={{ lineHeight: 1.5 }}>
                  Enter your work email and choose a new password to restore access to your DayFlow account.
                </p>

                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.375rem' }}>
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@dayflow.internal"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      backgroundColor: '#060609',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#F8FAFC',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.375rem' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (e.g. Password123!)"
                    required
                    style={{
                      width: '100%',
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      backgroundColor: '#060609',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#F8FAFC',
                      fontSize: '0.8125rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                    color: '#FFFFFF',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: resetLoading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {resetLoading ? 'Updating Credentials...' : 'Save New Password & Continue'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
