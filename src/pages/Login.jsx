import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowLeft } from 'lucide-react';
import { useUser } from '../context/UserContext.jsx';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUser();

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
      <div className="login-header spacing-lg">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h2>Welcome Back</h2>
        <p>Log in to Cuits Care</p>
      </div>

      <form className="glass-panel login-form pad-screen stack-y" onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <div className="input-wrapper">
            <User size={20} className="input-icon" />
            <input type="email" className="input-field with-icon" placeholder="hello@example.com" required />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-wrapper">
            <Lock size={20} className="input-icon" />
            <input type="password" className="input-field with-icon" placeholder="••••••••" required />
          </div>
        </div>

        <div className="forgot-password">
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>
          Log In
        </button>
      </form>

      <div className="login-footer">
        <p>Don't have an account? <span onClick={() => navigate('/onboarding')} className="text-accent">Sign up</span></p>
      </div>
    </div>
  );
}
