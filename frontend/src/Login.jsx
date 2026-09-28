export default function Login({ onLogin }) {
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <h2 className="logo">Loyum</h2>
        <h1 className="title">Welcome back</h1>
        <p className="subtitle">Run smarter campaigns for your customers.</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" defaultValue="owner@maisonlune.fr" className="input-field" autoComplete="username" required />
          </div>

          <div className="form-group">
            <div className="password-header">
              <label>Password</label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <input type="password" defaultValue="•••••••••" className="input-field" autoComplete="current-password" required />
          </div>

          <button type="submit" className="btn-primary">Sign in</button>
          
          <div className="divider"><span>or</span></div>
          
          <button type="button" className="btn-secondary" onClick={onLogin}>Continue with Google</button>
        </form>

        <p className="terms">By continuing, you agree to Loyum's merchant terms.</p>
      </div>
    </div>
  );
}
