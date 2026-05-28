import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Square, CheckCircle, Sparkles } from 'lucide-react';
import './SkinYoga.css';

const POINTS = [
  { 
    id: "thirdeye", 
    name: "Yintang (Third Eye)", 
    x: 50, y: 22, 
    benefits: "Calms mind, reduces stress-induced forehead tension, and improves microcirculation to the forehead skin.",
    action: "Gently press and hold with index finger in upward light sweeps."
  },
  { 
    id: "temple", 
    name: "Taiyang (Temples)", 
    x: 24, y: 30, 
    benefits: "Relieves eye strain, depuffs the periorbital eye area, and supports cellular drainage.",
    action: "Massage in gentle outward circular motions."
  },
  { 
    id: "cheek", 
    name: "Sibai (Under Pupil)", 
    x: 35, y: 46, 
    benefits: "Reduces under-eye dark circles, increases cheek radiance, and soothes facial fatigue.",
    action: "Apply soft pulsing pressure using your ring fingers."
  },
  { 
    id: "jaw", 
    name: "Jiache (Jawline Angle)", 
    x: 22, y: 72, 
    benefits: "Releases clenching tension, drains lymph nodes, and firms jawline appearance.",
    action: "Press and rotate in upward circular motions using firm pressure."
  },
  { 
    id: "chin", 
    name: "Chengjiang (Chin Center)", 
    x: 50, y: 84, 
    benefits: "Relaxes mouth area muscles and stimulates toxin clearance from the lower jaw.",
    action: "Firm hold with the thumb while sweeping upwards."
  }
];

export default function SkinYoga() {
  const navigate = useNavigate();
  const [selectedPoint, setSelectedPoint] = useState(POINTS[0]);
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

  const handleSelectPoint = (pt) => {
    setSelectedPoint(pt);
    setTimerActive(false);
    setTimeLeft(15);
    setCompleted(false);
  };

  return (
    <div className="pad-screen fade-in yoga-container" style={{ minHeight: '100vh', paddingTop: '40px', display: 'flex', flexDirection: 'column' }}>
      <div className="login-header spacing-md">
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">Skin Yoga</h2>
        <p>Holistic acupressure mapping and facial massage timers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', flex: 1 }}>
        
        {/* Silhouette Mapping Section */}
        <div className="glass-panel silhouette-box" style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '260px', position: 'relative' }}>
          {/* Silhoute Drawing */}
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: 'none', stroke: 'var(--text-secondary)', strokeWidth: 0.8, opacity: 0.5 }}>
              {/* Simple stylized face shape line art */}
              <path d="M50,15 C28,15 28,45 28,60 C28,75 38,90 50,90 C62,90 72,75 72,60 C72,45 72,15 50,15 Z" />
              <path d="M40,25 C45,25 45,28 40,28 C35,28 35,25 40,25 Z" style={{ opacity: 0.3 }} />
              <path d="M60,25 C65,25 65,28 60,28 C55,28 55,25 60,25 Z" style={{ opacity: 0.3 }} />
              <path d="M45,55 Q50,60 55,55" style={{ opacity: 0.3 }} />
            </svg>

            {/* Clickable Nodes overlay */}
            {POINTS.map(pt => {
              const active = selectedPoint.id === pt.id;
              return (
                <button
                  key={pt.id}
                  onClick={() => handleSelectPoint(pt)}
                  className={`node-btn ${active ? 'active' : ''}`}
                  style={{
                    position: 'absolute',
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={pt.name}
                >
                  <div className="node-ripple"></div>
                  <div className="node-core"></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Acupressure Details Panel */}
        <div className="glass-panel stack-y" style={{ padding: '24px', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span className="env-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 750, width: 'max-content' }}>
                Acupressure Point
              </span>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedPoint.name}</h3>
            </div>
            <Sparkles size={24} color="var(--accent)" className="pulse-slow" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.95rem' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Benefits</strong>
              <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{selectedPoint.benefits}</p>
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Technique</strong>
              <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.45 }}>{selectedPoint.action}</p>
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
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Massage Pace Assist</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '180px', lineHeight: 1.3 }}>
                  {timerActive ? "Match your circles to the expanding visual wave..." : completed ? "Ritual complete! Feel the revitalized energy flow." : "Ready. Click start and massage this node."}
                </span>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', gap: '10px' }}>
              {timerActive ? (
                <button className="btn-secondary" onClick={handleStop} style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', flex: 1 }}>
                  <Square size={16} /> Stop Timer
                </button>
              ) : (
                <button className="btn-primary" onClick={handleStart} style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', minHeight: 'unset', flex: 1 }}>
                  <Play size={16} /> {completed ? "Restart Ritual" : "Start Massage Timer"}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
