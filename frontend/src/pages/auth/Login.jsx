import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '../../components/ui';

export const Login = () => {
  const [email, setEmail] = useState('admin@dayflow.io');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState('admin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = {
        name: role === 'admin' ? 'Alex Morgan' : 'Sarah Jenkins',
        role: role,
        email: email,
      };
      localStorage.setItem('dayflow_user', JSON.stringify(user));
      localStorage.setItem('token', 'mock_jwt_token');
      setLoading(false);
      navigate(role === 'admin' ? '/admin' : '/employee');
    }, 400);
  };

  return (
    <form onSubmit={handleLogin} className="stack">
      <Input
        label="Work Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="alex.morgan@dayflow.io"
        required
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        required
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)' }}>
          ROLE DEMO SWITCHER
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <Button
            type="button"
            variant={role === 'admin' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              setRole('admin');
              setEmail('admin@dayflow.io');
            }}
          >
            HR Admin
          </Button>
          <Button
            type="button"
            variant={role === 'employee' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => {
              setRole('employee');
              setEmail('sarah.j@dayflow.io');
            }}
          >
            Employee
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        fullWidth
        style={{ marginTop: '8px' }}
      >
        Sign In to Dayflow
      </Button>
    </form>
  );
};

export default Login;
