import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
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
  Zap,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@dayflow.internal');
  const [password, setPassword] = useState('Password123!');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const role = (res?.user?.role || res?.role || selectedRole).toLowerCase();
      if (role === 'admin' || role === 'hr') {
        navigate('/admin');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090D16',
        padding: '1.5rem',
        backgroundImage: `
          radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99, 102, 241, 0.2), transparent),
          radial-gradient(ellipse 50% 30% at 80% 80%, rgba(6, 182, 212, 0.12), transparent)
        `,
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-in">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={28} />
          </div>
          <h1
            className="text-3xl font-black text-primary"
            style={{ letterSpacing: '-0.04em', background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            DAYFLOW
          </h1>
          <p className="text-xs font-semibold text-secondary" style={{ marginTop: '0.35rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Intelligent Workforce Operating System
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '18px',
            padding: '2.25rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Quick Demo Persona Switcher */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '0.625rem' }}>
              <span className="text-xs font-bold text-muted flex items-center gap-1 uppercase" style={{ letterSpacing: '0.05em' }}>
                <Zap size={13} style={{ color: '#F59E0B' }} /> Select Demo Account
              </span>
              <span className="text-xs text-muted">1-Click Sign In</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePersonaSelect('admin', 'admin@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: `1px solid ${selectedRole === 'admin' ? '#6366F1' : 'rgba(255, 255, 255, 0.08)'}`,
                  backgroundColor: selectedRole === 'admin' ? 'rgba(99, 102, 241, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedRole === 'admin' ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} style={{ color: '#818CF8' }} />
                  <span className="text-xs font-bold text-primary">HR / Admin</span>
                </div>
                <span className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Executive Suite</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('employee', 'alex.chen@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  borderRadius: '12px',
                  border: `1px solid ${selectedRole === 'employee' ? '#06B6D4' : 'rgba(255, 255, 255, 0.08)'}`,
                  backgroundColor: selectedRole === 'employee' ? 'rgba(6, 182, 212, 0.18)' : 'rgba(15, 23, 42, 0.6)',
                  color: selectedRole === 'employee' ? '#FFFFFF' : '#94A3B8',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 150ms ease',
                }}
              >
                <div className="flex items-center gap-2">
                  <UserCheck size={16} style={{ color: '#22D3EE' }} />
                  <span className="text-xs font-bold text-primary">Alex Chen</span>
                </div>
                <span className="text-xs text-muted" style={{ fontSize: '0.6875rem' }}>Lead Engineer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                className="text-xs font-semibold animate-fade-in"
                style={{
                  padding: '0.875rem 1rem',
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
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.375rem' }}>
                Work Email
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
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
              <label className="text-xs font-semibold text-secondary" style={{ display: 'block', marginBottom: '0.375rem' }}>
                Password
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
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
                  style={{ color: '#64748B', display: 'flex', alignItems: 'center' }}
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
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
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
            style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}
          >
            <span>Internal Hackathon Build</span>
            <span className="flex items-center gap-1 text-emerald font-semibold">
              <CheckCircle size={12} /> Auto-Seeded DB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
