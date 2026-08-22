import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Sparkles, Mail, Lock, User, Building2, ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '../../utils/constants';

export const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Engineering',
    role: 'employee',
    title: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In production calls authService.register then logins
      const res = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      if (formData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        backgroundColor: 'var(--bg-canvas)',
        padding: '1.5rem',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }} className="animate-fade-in">
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-glow)',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-primary" style={{ letterSpacing: '-0.03em' }}>
            Get Started with DayFlow
          </h1>
          <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
            Set up your workforce profile in seconds
          </p>
        </div>

        <Card variant="elevated" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div
                className="text-xs font-medium"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--danger-bg)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: 'var(--danger)',
                }}
              >
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              icon={User}
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Alex Mercer"
              required
            />

            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="alex@company.com"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                options={DEPARTMENTS}
              />
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                options={[
                  { value: 'employee', label: 'Employee' },
                  { value: 'admin', label: 'HR / Admin' },
                ]}
              />
            </div>

            <Input
              label="Job Title"
              icon={Building2}
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Minimum 6 characters"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              icon={ArrowRight}
              iconPosition="right"
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              Create Account & Enter
            </Button>
          </form>

          <div
            className="flex items-center justify-between text-xs text-muted"
            style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}
          >
            <span>Already have an account?</span>
            <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
