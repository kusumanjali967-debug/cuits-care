import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './SplashPage.css';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="logo-wrapper scale-in pulse-slow">
          <Sparkles size={48} color="var(--bg-primary)" />
        </div>
        <h1 className="splash-title slide-up text-gradient" style={{ animationDelay: '0.2s' }}>CUTISCARE</h1>
        <p className="splash-subtitle slide-up" style={{ animationDelay: '0.3s' }}>
          ADAPTIVE DERMATOLOGICAL PREVENTION PLATFORM
        </p>
      </div>
      
      <div className="splash-action slide-up" style={{ animationDelay: '0.5s' }}>
        <button className="btn-primary btn-large hover-lift" onClick={() => navigate('/login')}>
          <span>Get Started</span>
          <ArrowRight size={20} className="arrow-icon" />
        </button>
      </div>
    </div>
  );
}
