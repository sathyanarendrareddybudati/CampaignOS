import React, { useState } from 'react';
import LoyumLogo, { LoyumIcon } from '../components/common/LoyumLogo';

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
          throw new Error('Invalid email or password. Please try again.');
        }
        const data = await res.json();
        localStorage.setItem('token', data.access_token);
        if (email) localStorage.setItem('user_email', email);
        onLogin(data.access_token);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
        setError('Registration successful! Please sign in with your credentials.');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-ambient-glow"></div>
      
      <div className="auth-card-container">
        <div className="auth-brand-header">
          <LoyumLogo variant="vertical" theme="dark" size="lg" showSubtitle={true} />
          <p className="auth-tagline">Official Loyalty & Merchant Marketing Operating System</p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button 
              type="button"
              className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(null); }}
            >
              Merchant Sign In
            </button>
            <button 
              type="button"
              className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(null); }}
            >
              Register Node
            </button>
          </div>

          {error && (
            <div className={`auth-alert ${error.includes('successful') ? 'success' : 'error'}`}>
              <span className="alert-icon">
                {error.includes('successful') ? '✓' : '⚠'}
              </span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="auth-email">Merchant Email</label>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <input 
                  id="auth-email"
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@maisonlune.com"
                  required 
                  className="input-field" 
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-header">
                <label htmlFor="auth-password">Password</label>
                {isLogin && (
                  <span 
                    className="forgot-link" 
                    onClick={() => setError('To reset your password, please contact support or check your merchant security email.')}
                    style={{ cursor: 'pointer' }}
                  >
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="input-with-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <input 
                  id="auth-password"
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••••••"
                  required 
                  className="input-field" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-inline">Processing...</span>
              ) : (
                isLogin ? 'Sign In to Loyum' : 'Initialize Merchant Account'
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <span className="trust-badge">
              <LoyumIcon size={16} fill="#F2B12F" letterFill="#001F46" />
              Official Validation Seal • Mindsit 2024
            </span>
          </div>
        </div>

        <div className="auth-page-footer">
          <p>© 2024 MINDSIT • LOYUM Charte Graphique Standard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

