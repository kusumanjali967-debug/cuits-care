import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, authError, setAuthError } = useUser();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [localError, setLocalError]     = useState('');

  const error = localError || authError;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError('');

    // Basic client-side validation
    if (!email.trim()) { setLocalError('Please enter your email address.'); return; }
    if (!password)      { setLocalError('Please enter your password.'); return; }
    if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    const result = await login(email.trim().toLowerCase(), password);
    setLoading(false);

    if (result) {
      if (result.isNew) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
    // authError is set inside UserContext if login fails
  };

  return (
    <div className="login-container pad-screen fade-in">
      <div className="login-header spacing-lg slide-up" style={{ animationDelay: '0.1s' }}>
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">Welcome Back 👋</h2>
        <p>Log in to your Cuits Care account</p>
      </div>

      <form
        className="glass-panel login-form pad-screen stack-y slide-up"
        style={{ animationDelay: '0.2s' }}
        onSubmit={handleLogin}
        noValidate
      >
        {/* Error banner */}
        {error && (
          <div className="fade-in" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 14,
            background: 'rgba(244,67,54,0.08)',
            border: '1px solid rgba(244,67,54,0.25)',
            color: '#f44336', fontSize: '0.88rem', fontWeight: 600,
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Email */}
        <div className="input-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              className="input-field with-icon"
              placeholder="hello@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper" style={{ position: 'relative' }}>
            <Lock size={20} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field with-icon"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', padding: 4,
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="forgot-password">
          <span
            style={{ cursor: 'pointer', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}
            onClick={() => {
              const em = prompt('Enter your registered email to reset password:');
              if (em) alert(`If ${em} is registered, a reset link will be sent. (Email setup required in EmailJS)`);
            }}
          >
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          className="btn-primary hover-lift neon-glow"
          style={{ marginTop: 16 }}
          disabled={loading}
        >
          {loading
            ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Logging in...</>
            : '🔐 Log In'
          }
        </button>
      </form>

      <div className="login-footer slide-up" style={{ animationDelay: '0.3s' }}>
        <p>
          Don't have an account?{' '}
          <span
            onClick={() => { setAuthError(''); navigate('/onboarding'); }}
            className="text-accent hover-lift"
            style={{ display: 'inline-block', cursor: 'pointer', fontWeight: 700 }}
          >
            Sign up free →
          </span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
