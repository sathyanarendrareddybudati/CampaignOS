import React, { useState } from 'react';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isLogin) {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      try {
        const res = await fetch('/api/v1/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });
        if (!res.ok) {
          throw new Error('Invalid credentials');
        }
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        onLogin(data.access_token);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        const res = await fetch('/api/v1/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Registration failed');
        }
        setIsLogin(true);
        setError('Registration successful! Please log in.');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F8FAFC' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0F172A' }}>{isLogin ? 'Login to Loyum' : 'Create an Account'}</h2>
        {error && <div style={{ padding: '0.75rem', marginBottom: '1rem', background: error.includes('successful') ? '#D1FAE5' : '#FEE2E2', color: error.includes('successful') ? '#065F46' : '#991B1B', borderRadius: '6px', fontSize: '0.85rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="input" />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748B' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={{ color: '#6366F1', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </div>
      </div>
    </div>
  );
}
