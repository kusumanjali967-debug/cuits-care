import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Moon, Sun, Shield } from 'lucide-react';
import './CircadianClock.css';

const TIMELINE = [
  {
    id: "morning",
    title: "Morning (06:00 - 10:00)",
    subtitle: "Epidermal Awakening",
    icon: "🌅",
    bio: "Skin moisture levels are naturally at their lowest upon waking. Skin cell defense mechanisms start to wake up to protect against environmental toxins.",
    action: "Focus on deep moisture locking, antioxidants (Vitamin C), and robust UV defense to safeguard against daylight damage.",
    startHour: 6, endHour: 10
  },
  {
    id: "midday",
    title: "Midday (10:00 - 16:00)",
    subtitle: "Sebum Peak Production",
    icon: "☀️",
    bio: "Sebum (oil) secretion peaks under high daylight intensity, leaving skin shiny. Environmental UV radiation represents the highest threat during this period.",
    action: "Absorb excess oil with gentle blotting or lightweight gels. Reapply broad-spectrum sunscreen (SPF 50) every 2 hours.",
    startHour: 10, endHour: 16
  },
  {
    id: "afternoon",
    title: "Afternoon (16:00 - 18:00)",
    subtitle: "Barrier Permeability Dip",
    icon: "🌇",
    bio: "Your skin's biological acid barrier suffers a natural dip. Cell micro-vulnerability is elevated, leading to midday dehydration and dullness.",
    action: "Soothe dehydrated cells with a refreshing facial mist. Ideal time for a gentle hydrating break.",
    startHour: 16, endHour: 18
  },
  {
    id: "night",
    title: "Evening (18:00 - 23:00)",
    subtitle: "DNA & Cellular Detoxification",
    icon: "🌌",
    bio: "Skin cells begin mitotic division, turning away from defense mode toward detoxification, healing, and chemical shedding.",
    action: "Prioritize double-cleansing to remove pollutants. Apply chemical exfoliators (BHA/AHA) or deep pore-purifying clay.",
    startHour: 18, endHour: 23
  },
  {
    id: "latenight",
    title: "Late Night (23:00 - 06:00)",
    subtitle: "Mitotic Regeneration Window",
    icon: "🌙",
    bio: "Your blood circulation rises and skin cell renewal speed triples. Skin barrier permeability peaks, meaning overnight treatments are absorbed much deeper.",
    action: "Apply high-performance overnight repairs: Retinoids, peptide creams, or lipid-rich ceramide sleep masks.",
    startHour: 23, endHour: 6
  }
];

export default function CircadianClock() {
  const navigate = useNavigate();
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [selectedPhase, setSelectedPhase] = useState(TIMELINE[0]);

  // Sync current clock
  useEffect(() => {
    const hour = new Date().getHours();
    setCurrentHour(hour);
    
    // Find phase corresponding to current hour
    const activePhase = TIMELINE.find(phase => {
      if (phase.startHour <= phase.endHour) {
        return hour >= phase.startHour && hour < phase.endHour;
      } else {
        // Late night wraps past midnight (23:00 to 06:00)
        return hour >= phase.startHour || hour < phase.endHour;
      }
    });
    
    if (activePhase) {
      setSelectedPhase(activePhase);
    }
  }, []);

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
        <h2 className="text-gradient">Circadian Clock</h2>
        <p>Align your skincare application to your skin's biological rhythm</p>
      </div>

      {/* Clock Dial Mockup */}
      <div className="glass-panel dial-box" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '12px' }}>
        <Clock size={40} color="var(--accent)" className="pulse-slow" />
        <div style={{ textItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
          </span>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Local Biological Hour</p>
        </div>
      </div>

      {/* Timeline Selector */}
      <div className="stack-y" style={{ gap: '12px', margin: '24px 0' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 4px 0' }}>Chronobiological Skin Phase</h3>
        
        {TIMELINE.map(phase => {
          const isSelected = selectedPhase.id === phase.id;
          const isActiveNow = getIsActiveNow(phase);

          return (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase)}
              className={`timeline-btn glass-panel ${isSelected ? 'selected' : ''}`}
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
                  ACTIVE NOW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Phase Details */}
      <div className="glass-panel scale-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', border: '2px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            {selectedPhase.id === "latenight" || selectedPhase.id === "night" ? <Moon size={22} /> : <Sun size={22} />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem' }}>Skin Biology</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{selectedPhase.subtitle}</span>
          </div>
        </div>

        <div className="stack-y" style={{ gap: '12px', fontSize: '0.95rem' }}>
          <div>
            <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Biological State</strong>
            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{selectedPhase.bio}</p>
          </div>
          <div style={{ borderTop: '1px dashed var(--glass-border)', paddingTop: '12px' }}>
            <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} /> Circadian Recommendation
            </strong>
            <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{selectedPhase.action}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
