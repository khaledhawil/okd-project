import { useState } from 'react';
import { authAPI } from '../api/axiosConfig';

export default function LoginPage({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      // Save token and user info in localStorage so we stay logged in after refresh
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        name: res.data.name,
        email: res.data.email,
        userId: res.data.userId
      }));
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-branding">
            <h1>🚀 DevOps Manager</h1>
            <p>Manage your tasks & projects with your team.</p>
            <div className="auth-features">
              <div className="auth-feature">✅ Task Management</div>
              <div className="auth-feature">📁 Project Tracking</div>
              <div className="auth-feature">🔒 Secure Authentication</div>
              <div className="auth-feature">☁️ Cloud Ready (OKD)</div>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? '⏳ Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <span onClick={onSwitchToSignup} className="auth-link">Create one</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
