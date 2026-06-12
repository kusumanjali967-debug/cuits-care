import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, CheckCircle, Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './SkinYoga.css';

const DURATION = 15; // seconds per massage point

const POINTS = [
  { id: "thirdeye", x: 50, y: 22 },
  { id: "temple",   x: 24, y: 30 },
  { id: "cheek",    x: 35, y: 46 },
  { id: "jaw",      x: 22, y: 72 },
  { id: "chin",     x: 50, y: 84 }
];

export default function SkinYoga() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [selectedPointId, setSelectedPointId] = useState(POINTS[0].id);
  const [timerActive, setTimerActive]   = useState(false);
  const [timeLeft, setTimeLeft]         = useState(DURATION);
  const [completed, setCompleted]       = useState(false);

  // ── Timer countdown ──────────────────────────────────────────────────────────
  // NOTE: We use `prev` (not `t`) to avoid shadowing the translation function `t`.
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setTimerActive(false);
      setCompleted(true);
      return;
    }
    const id = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, timeLeft]);

  const handleStart = () => {
    setTimeLeft(DURATION);
    setCompleted(false);
    setTimerActive(true);
  };

  const handleStop = () => {
    setTimerActive(false);
  };

  const handleRestart = () => {
    setTimeLeft(DURATION);
    setCompleted(false);
    setTimerActive(true);
  };

  const handleSelectPoint = (id) => {
    setSelectedPointId(id);
    setTimerActive(false);
    setTimeLeft(DURATION);
    setCompleted(false);
  };

  const currentPoint   = POINTS.find(p => p.id === selectedPointId) || POINTS[0];
  const pointName      = t(`point_${selectedPointId}_name`);
  const pointBenefits  = t(`point_${selectedPointId}_benefits`);
  const pointAction    = t(`point_${selectedPointId}_action`);

  // Progress ring math
  const radius      = 46;
  const circumference = 2 * Math.PI * radius;
  const progress    = (timeLeft / DURATION);          // 1 → 0
  const strokeOffset = circumference * (1 - progress); // fills as time elapses

  const ringColor = completed ? 'var(--success)' : timerActive ? 'var(--accent)' : 'var(--glass-border)';

  return (
    <div className="pad-screen fade-in yoga-container" style={{ minHeight: '100vh', paddingTop: '40px', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ── */}
      <div className="login-header spacing-md">
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">{t('yogaTitle')}</h2>
        <p>{t('yogaSubtitle')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', flex: 1 }}>

        {/* ── Face Map ── */}
        <div className="glass-panel silhouette-box card-3d"
          style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '280px', position: 'relative' }}>
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '4px solid var(--glass-border)', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
              <img src="/skin_yoga_face.png" alt="AI Acupressure Guide"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Clickable point nodes */}
            {POINTS.map(pt => {
              const active = selectedPointId === pt.id;
              const name   = t(`point_${pt.id}_name`);
              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt.id)}
                  className={`node-btn ${active ? 'active' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${pt.x}%`,
                    top:  `${pt.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                  title={name}
                  aria-label={name}
                >
                  <div className="node-ripple"></div>
                  <div className="node-core"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Details + Timer Panel ── */}
        <div className="glass-panel stack-y" style={{ padding: '24px', gap: '20px' }}>

          {/* Point name & badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="env-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 750, width: 'max-content' }}>
                {t('acupressurePoint')}
              </span>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{pointName}</h3>
            </div>
            <Sparkles size={24} color="var(--accent)" className="pulse-slow" />
          </div>

          {/* Benefits & Technique */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('benefits')}
              </strong>
              <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>{pointBenefits}</p>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t('technique')}
              </strong>
              <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>{pointAction}</p>
            </div>
          </div>

          {/* ── Interactive Massage Timer ── */}
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
            <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: '0.9rem', textAlign: 'center' }}>
              {t('massagePaceAssist')}
            </p>

            {/* SVG circular progress ring */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background track */}
                  <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--glass-border)" strokeWidth="8" />
                  {/* Animated progress arc */}
                  <circle
                    cx="60" cy="60" r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
                  />
                </svg>

                {/* Center content */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
                }}>
                  {completed ? (
                    <CheckCircle size={32} color="var(--success)" />
                  ) : (
                    <>
                      <span style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1, color: timerActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                        {timeLeft}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>sec</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Status message */}
            <p style={{
              textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)',
              margin: '0 0 16px', lineHeight: 1.4, minHeight: '36px'
            }}>
              {timerActive
                ? t('activeMessage')
                : completed
                  ? t('completedMessage')
                  : t('readyMessage')}
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              {timerActive ? (
                <button
                  id="stop-timer-btn"
                  className="btn-secondary"
                  onClick={handleStop}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Square size={16} /> {t('stopTimer')}
                </button>
              ) : completed ? (
                <button
                  id="restart-timer-btn"
                  className="btn-primary"
                  onClick={handleRestart}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', fontSize: '0.95rem', minHeight: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <RotateCcw size={16} /> {t('restartRitual')}
                </button>
              ) : (
                <button
                  id="start-timer-btn"
                  className="btn-primary"
                  onClick={handleStart}
                  style={{ flex: 1, padding: '14px', borderRadius: '14px', fontSize: '0.95rem', minHeight: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}
                >
                  <Play size={16} /> {t('startMassageTimer')}
                </button>
              )}
            </div>

            {/* Point selector pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px', justifyContent: 'center' }}>
              {POINTS.map(pt => (
                <button
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: `1.5px solid ${selectedPointId === pt.id ? 'var(--accent)' : 'var(--glass-border)'}`,
                    background: selectedPointId === pt.id ? 'var(--accent-light)' : 'transparent',
                    color: selectedPointId === pt.id ? 'var(--accent)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {t(`point_${pt.id}_name`).split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
