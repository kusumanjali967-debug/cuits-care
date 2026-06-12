import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const result = await login(email);
    
    // Explicitly check if it's a freshly created user or an old user
    if (result) {
      if (result.isNew) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert("Login failed! The backend server might be offline.");
    }
  };

  return (
    <div className="login-container pad-screen fade-in">
      <div className="login-header spacing-lg slide-up" style={{ animationDelay: '0.1s' }}>
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">Welcome Back</h2>
        <p>Log in to CutisCare</p>
      </div>

      <form className="glass-panel login-form pad-screen stack-y slide-up hover-lift" style={{ animationDelay: '0.2s' }} onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input type="email" className="input-field with-icon" placeholder="hello@example.com" required />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper" style={{ position: 'relative' }}>
            <Lock size={20} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-field with-icon"
              placeholder="••••••••"
              required
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', padding: '4px',
                transition: 'color 0.2s'
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="forgot-password">
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="btn-primary hover-lift" style={{ marginTop: '16px' }}>
          <span>Log In</span>
        </button>
      </form>

      <div className="login-footer slide-up" style={{ animationDelay: '0.3s' }}>
        <p>Don't have an account? <span onClick={() => navigate('/onboarding')} className="text-accent hover-lift" style={{display: 'inline-block'}}>Sign up</span></p>
      </div>
    </div>
  );
}
