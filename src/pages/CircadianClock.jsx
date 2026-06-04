import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Moon, Sun, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './CircadianClock.css';

const TIMELINE_META = [
  { id: "morning", icon: "🌅", startHour: 6, endHour: 10 },
  { id: "midday", icon: "☀️", startHour: 10, endHour: 16 },
  { id: "afternoon", icon: "🌇", startHour: 16, endHour: 18 },
  { id: "night", icon: "🌌", startHour: 18, endHour: 23 },
  { id: "latenight", icon: "🌙", startHour: 23, endHour: 6 }
];

export default function CircadianClock() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedPhaseId, setSelectedPhaseId] = useState(TIMELINE_META[0].id);

  // Sync current clock
  useEffect(() => {
    const hour = new Date().getHours();
    setCurrentHour(hour);
    
    // Find phase corresponding to current hour
    const activePhase = TIMELINE_META.find(phase => {
      if (phase.startHour <= phase.endHour) {
        return hour >= phase.startHour && hour < phase.endHour;
      } else {
        // Late night wraps past midnight (23:00 to 06:00)
        return hour >= phase.startHour || hour < phase.endHour;
      }
    });
    
    if (activePhase) {
      setSelectedPhaseId(activePhase.id);
    }
  }, []);

  const timeline = TIMELINE_META.map(phase => ({
    ...phase,
    title: t(`phase_${phase.id}_title`),
    subtitle: t(`phase_${phase.id}_sub`),
    bio: t(`phase_${phase.id}_bio`),
    action: t(`phase_${phase.id}_action`)
  }));

  const selectedPhase = timeline.find(p => p.id === selectedPhaseId) || timeline[0];

  const getIsActiveNow = (phase) => {
    const hour = currentHour;
    if (phase.startHour <= phase.endHour) {
      return hour >= phase.startHour && hour < phase.endHour;
    } else {
      return hour >= phase.startHour || hour < phase.endHour;
    }
  };

  return (
    <div className="pad-screen fade-in circadian-container" style={{ minHeight: '100vh', paddingTop: '40px', display: 'flex', flexDirection: 'column' }}>
      <div className="login-header spacing-md">
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">{t('circadianTitle')}</h2>
        <p>{t('circadianSubtitle')}</p>
      </div>

      {/* Clock Dial Mockup */}
      <div className="glass-panel dial-box card-3d" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px' }}>
        <Clock size={40} color="var(--accent)" className="pulse-slow" />
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </span>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('biologicalHour')}</p>
        </div>
      </div>

      {/* Timeline Selector */}
      <div className="stack-y" style={{ gap: '12px', margin: '24px 0' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>{t('skinPhase')}</h3>
        
        {timeline.map(phase => {
          const isSelected = selectedPhaseId === phase.id;
          const isActiveNow = getIsActiveNow(phase);

          return (
            <button
              key={phase.id}
              onClick={() => setSelectedPhaseId(phase.id)}
              className={`timeline-btn glass-panel card-3d ${isSelected ? 'selected' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                textAlign: 'left',
                border: isSelected ? '2px solid var(--accent)' : isActiveNow ? '1.5px dashed var(--accent)' : '1px solid var(--glass-border)',
                background: isSelected ? 'var(--bg-secondary)' : isActiveNow ? 'rgba(216,140,125,0.06)' : 'var(--glass-bg)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '1.5rem' }}>{phase.icon}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{phase.title}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{phase.subtitle}</span>
                </div>
              </div>

              {isActiveNow && (
                <span className="env-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '6px', margin: 0 }}>
                  {t('activeNow')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Phase Details */}
      <div className="glass-panel scale-in card-3d" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            {selectedPhase.id === "latenight" || selectedPhase.id === "night" ? <Moon size={22} /> : <Sun size={22} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{t('skinBiology')}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{selectedPhase.subtitle}</span>
          </div>
        </div>

        <div className="stack-y" style={{ gap: '12px', fontSize: '0.95rem' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>{t('biologicalState')}</strong>
            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{selectedPhase.bio}</p>
          </div>
          <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '12px' }}>
            <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} /> {t('recommendationTitle')}
            </strong>
            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{selectedPhase.action}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
