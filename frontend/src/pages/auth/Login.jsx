import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Sparkles, Mail, Lock, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@dayflow.internal');
  const [password, setPassword] = useState('Password123!');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePersonaSelect = (role, demoEmail, demoPass) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword(demoPass || 'Password123!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password, role: selectedRole });
      const role = res?.user?.role || res?.role || selectedRole;
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
        backgroundColor: 'var(--bg-canvas, #090D16)',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-in">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg, 16px)',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.3)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-primary" style={{ letterSpacing: '-0.03em' }}>
            DAYFLOW
          </h1>
          <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
            Intelligent Workforce Operating System
          </p>
        </div>

        {/* Login Card */}
        <Card hoverable style={{ padding: '2rem' }}>
          {/* Persona Demo Switcher */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="text-xs font-semibold text-muted" style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Quick Demo Persona
            </label>
            <div className="grid grid-cols-2 gap-2" style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handlePersonaSelect('admin', 'admin@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md, 10px)',
                  border: `1px solid ${selectedRole === 'admin' ? 'var(--primary, #6366F1)' : 'var(--border-subtle, rgba(255,255,255,0.1))'}`,
                  backgroundColor: selectedRole === 'admin' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                  color: selectedRole === 'admin' ? 'var(--text-primary, #F8FAFC)' : 'var(--text-secondary, #94A3B8)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 150ms ease',
                }}
              >
                <ShieldCheck size={16} style={{ color: 'var(--primary, #6366F1)' }} />
                <span>HR / Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handlePersonaSelect('employee', 'alex.chen@dayflow.internal', 'Password123!')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  borderRadius: 'var(--radius-md, 10px)',
                  border: `1px solid ${selectedRole === 'employee' ? 'var(--pulse-cyan, #06B6D4)' : 'var(--border-subtle, rgba(255,255,255,0.1))'}`,
                  backgroundColor: selectedRole === 'employee' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                  color: selectedRole === 'employee' ? 'var(--text-primary, #F8FAFC)' : 'var(--text-secondary, #94A3B8)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 150ms ease',
                }}
              >
                <UserCheck size={16} style={{ color: 'var(--pulse-cyan, #06B6D4)' }} />
                <span>Alex (Employee)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                className="text-xs font-medium"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md, 10px)',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--danger, #EF4444)',
                }}
              >
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              prefix={<Mail size={16} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@dayflow.internal"
              required
            />

            <Input
              label="Password"
              type="password"
              prefix={<Lock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={<ArrowRight size={16} />}
              fullWidth
              style={{ marginTop: '0.5rem' }}
            >
              Sign In to DayFlow
            </Button>
          </form>

          <div
            className="flex items-center justify-between text-xs text-muted"
            style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.08))' }}
          >
            <span>Don't have an account?</span>
            <Link to="/signup" style={{ color: 'var(--primary, #6366F1)', textDecoration: 'none', fontWeight: 600 }}>
              Create Organization
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
