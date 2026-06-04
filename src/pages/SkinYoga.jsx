import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, CheckCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './SkinYoga.css';

const POINTS = [
  { 
    id: "thirdeye", 
    x: 50, y: 22, 
  },
  { 
    id: "temple", 
    x: 24, y: 30, 
  },
  { 
    id: "cheek", 
    x: 35, y: 46, 
  },
  { 
    id: "jaw", 
    x: 22, y: 72, 
  },
  { 
    id: "chin", 
    x: 50, y: 84, 
  }
];

export default function SkinYoga() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedPointId, setSelectedPointId] = useState(POINTS[0].id);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setCompleted(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleStart = () => {
    setTimeLeft(15);
    setCompleted(false);
    setTimerActive(true);
  };

  const handleStop = () => {
    setTimerActive(false);
  };

  const handleSelectPoint = (id) => {
    setSelectedPointId(id);
    setTimerActive(false);
    setTimeLeft(15);
    setCompleted(false);
  };

  const currentPoint = POINTS.find(p => p.id === selectedPointId) || POINTS[0];
  
  const pointName = t(`point_${selectedPointId}_name`);
  const pointBenefits = t(`point_${selectedPointId}_benefits`);
  const pointAction = t(`point_${selectedPointId}_action`);

  return (
    <div className="pad-screen fade-in yoga-container" style={{ minHeight: '100vh', paddingTop: '40px', display: 'flex', flexDirection: 'column' }}>
      <div className="login-header spacing-md">
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">{t('yogaTitle')}</h2>
        <p>{t('yogaSubtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', flex: 1 }}>
        
        {/* Silhouette Mapping Section */}
        <div className="glass-panel silhouette-box card-3d" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '280px', position: 'relative' }}>
          {/* Symmetrical AI Face Photo mapping container */}
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', justifyContent: 'center' }}>
            {/* AI Face Image Graphic */}
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid var(--glass-border)', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
              <img 
                src="/skin_yoga_face.png" 
                alt="AI Acupressure Guide" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Clickable Nodes overlay */}
            {POINTS.map(pt => {
              const active = selectedPointId === pt.id;
              const name = t(`point_${pt.id}_name`);
              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt.id)}
                  className={`node-btn ${active ? 'active' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                  title={name}
                >
                  <div className="node-ripple"></div>
                  <div className="node-core"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Acupressure Details Panel */}
        <div className="glass-panel stack-y card-3d" style={{ padding: '24px', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="env-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 750, width: 'max-content' }}>
                {t('acupressurePoint')}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{pointName}</h3>
            </div>
            <Sparkles size={24} color="var(--accent)" className="pulse-slow" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{t('benefits')}</strong>
              <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{pointBenefits}</p>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{t('technique')}</strong>
              <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{pointAction}</p>
            </div>
          </div>

          {/* Interactive Massage Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '20px', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              {/* Circular breathing ring */}
              <div className={`timer-ring ${timerActive ? 'breathing' : ''}`} style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '4px solid var(--glass-border)' }}>
                {completed ? (
                  <CheckCircle size={36} color="var(--success)" className="scale-in" />
                ) : (
                  <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{timeLeft}s</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t('massagePaceAssist')}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '180px', lineHeight: 1.3 }}>
                  {timerActive ? t('activeMessage') : completed ? t('completedMessage') : t('readyMessage')}
                </span>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              {timerActive ? (
                <button className="btn-secondary" onClick={handleStop} style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', flex: 1 }}>
                  <Square size={16} /> {t('stopTimer')}
                </button>
              ) : (
                <button className="btn-primary" onClick={handleStart} style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', minHeight: 'unset', flex: 1 }}>
                  <Play size={16} /> {completed ? t('restartRitual') : t('startMassageTimer')}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
