import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './SplashPage.css';

export default function SplashPage() {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <div className="splash-content fade-in">
        <div className="logo-wrapper">
          <Sparkles size={48} color="var(--bg-primary)" />
        </div>
        <h1 className="splash-title">Cuits Care</h1>
        <p className="splash-subtitle">Personalized skin health and daily routine companion.</p>
      </div>
      
      <div className="splash-action fade-in" style={{ animationDelay: '0.4s' }}>
        <button className="btn-primary btn-large" onClick={() => navigate('/login')}>
          Get Started <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
