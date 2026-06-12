import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Sparkles, Trash2, ChevronDown, ChevronUp, Camera } from 'lucide-react';

const scoreColor = (s) => s >= 80 ? '#4caf50' : s >= 60 ? '#ff9800' : '#f44336';
const scoreLabel = (s) => s >= 80 ? 'Excellent' : s >= 70 ? 'Good' : s >= 55 ? 'Fair' : 'Needs Care';

export default function MyScanHistory() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const history = (userData.history || []).slice().reverse();
  const [expanded, setExpanded] = useState(null);

  const deleteScan = (originalIndex) => {
    const updated = [...(userData.history || [])];
    // originalIndex is from reversed array, convert back
    const realIndex = (userData.history || []).length - 1 - originalIndex;
    updated.splice(realIndex, 1);
    updateUserData({ history: updated });
  };

  return (
    <div className="pad-screen fade-in" style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button className="icon-btn" onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>Scan History 📋</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Your past AI skin analysis results
        </p>
      </div>

      {/* Empty state */}
      {history.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Camera size={48} style={{ marginBottom: '16px', opacity: 0.4 }} />
          <p style={{ fontWeight: 600, fontSize: '1rem' }}>No scans yet</p>
          <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Do your first AI skin scan and save the result!</p>
          <button className="btn-primary" onClick={() => navigate('/camera')}
            style={{ marginTop: '20px', padding: '12px 24px', fontSize: '0.9rem', minHeight: 'unset' }}>
            Open Camera Scan
          </button>
        </div>
      )}

      {/* Scan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {history.map((item, index) => {
          const isOpen = expanded === index;
          const sc = item.score || 0;
          const color = scoreColor(sc);
          const dateStr = new Date(item.date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
          });
          const timeStr = new Date(item.date).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
          });

          return (
            <div key={index} className="glass-panel hover-lift"
              style={{ borderRadius: '18px', overflow: 'hidden', border: isOpen ? `1.5px solid ${color}` : '1px solid var(--glass-border)', transition: 'all 0.3s ease' }}>

              {/* Card header — always visible */}
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>

                {/* Score ring */}
                <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
                  <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="28" cy="28" r="22" stroke="var(--glass-border)" strokeWidth="5" fill="transparent" />
                    <circle cx="28" cy="28" r="22" stroke={color} strokeWidth="5" fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 22}`}
                      strokeDashoffset={`${2 * Math.PI * 22 * (1 - sc / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color }}>
                    {sc > 0 ? `${sc}%` : '—'}
                  </span>
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {item.issue || item.result || 'Skin Scan'}
                    </span>
                    {sc > 0 && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: color + '20', color }}>
                        {scoreLabel(sc)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span>📅 {dateStr}</span>
                    <span>🕐 {timeStr}</span>
                    {item.skinType && <span>· {item.skinType} Skin</span>}
                  </div>
                </div>

                {/* Expand + Delete */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => setExpanded(isOpen ? null : index)}
                    style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent)' }}>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button onClick={() => deleteScan(index)}
                    style={{ background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.2)', borderRadius: '10px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f44336' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isOpen && (
                <div className="fade-in" style={{ borderTop: '1px solid var(--glass-border)', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Description */}
                  {item.description && (
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 5px', letterSpacing: '0.04em' }}>🔍 Analysis Finding</p>
                      <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-primary)', background: 'var(--glass-bg)', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--glass-border)' }}>
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Recommendation */}
                  {item.recommendation && (
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 5px', letterSpacing: '0.04em' }}>💊 Recommended Product</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--accent-light)', borderRadius: '12px', padding: '10px 14px', border: '1px solid var(--accent)' }}>
                        <Sparkles size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent)' }}>{item.recommendation}</span>
                      </div>
                    </div>
                  )}

                  {/* Undertone & Palette */}
                  {(item.undertone || item.seasonalPalette) && (
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 8px', letterSpacing: '0.04em' }}>🎨 Colour Analysis</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {item.undertone && (
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '6px 14px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            {item.undertone} Undertone
                          </span>
                        )}
                        {item.seasonalPalette && (
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '6px 14px', borderRadius: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                            {item.seasonalPalette}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Score factors */}
                  {item.factors && item.factors.length > 0 && (
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 8px', letterSpacing: '0.04em' }}>📊 Score Breakdown</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {item.factors.map((f, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '6px 0', borderBottom: i < item.factors.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{f.label}</span>
                            <span style={{ fontWeight: 700, color: f.points > 0 ? '#4caf50' : '#f44336' }}>
                              {f.points > 0 ? '+' : ''}{f.points} pts
                            </span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem', fontWeight: 700, paddingTop: '6px' }}>
                          <span>Total Score</span>
                          <span style={{ color }}>{sc}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
