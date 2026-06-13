import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Bell, X, Check } from 'lucide-react';

const DERM_LINKS = [
  { label: 'Practo', emoji: '🏥', url: 'https://www.practo.com/dermatologist', color: '#2563eb' },
  { label: 'Justdial', emoji: '📞', url: 'https://www.justdial.com/search?q=dermatologist', color: '#f59e0b' },
  { label: 'Apollo Hospitals', emoji: '⚕️', url: 'https://www.apollohospitals.com/find-a-doctor/dermatology/', color: '#10b981' },
];

export default function DermatologistFinder() {
  const navigate = useNavigate();

  const [reminderText, setReminderText] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [savedReminder, setSavedReminder] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cuitsCare_appt_reminder') || 'null');
    } catch {
      return null;
    }
  });

  const handleSaveReminder = () => {
    if (!reminderText.trim() && !reminderDate) return;
    const obj = { text: reminderText.trim(), date: reminderDate };
    localStorage.setItem('cuitsCare_appt_reminder', JSON.stringify(obj));
    setSavedReminder(obj);
    setReminderText('');
    setReminderDate('');
  };

  const handleClearReminder = () => {
    localStorage.removeItem('cuitsCare_appt_reminder');
    setSavedReminder(null);
  };

  return (
    <div className="pad-screen fade-in" style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button className="icon-btn" onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>Find a Dermatologist 🏥</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Book an appointment with a specialist</p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: '24px' }}>
        {DERM_LINKS.map(link => (
          <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
            className="glass-panel hover-lift"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderRadius: 18, border: `1.5px solid ${link.color}44`, textDecoration: 'none', color: 'var(--text-primary)', transition: 'all 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: link.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                {link.emoji}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{link.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Tap to search dermatologists</p>
              </div>
            </div>
            <ExternalLink size={18} color={link.color} />
          </a>
        ))}
      </div>

      {/* Appointment Reminder */}
      <div className="glass-panel" style={{ borderRadius: 18, padding: '18px 20px', border: '1px solid var(--glass-border)' }}>
        <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 7 }}>
          <Bell size={16} color="var(--accent)" /> Appointment Reminder
        </p>
        {savedReminder ? (
          <div style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--accent-light)', border: '1px solid var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: 'var(--accent)' }}>Saved Reminder</p>
              {savedReminder.text && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{savedReminder.text}</p>}
              {savedReminder.date && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>📅 {new Date(savedReminder.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
            </div>
            <button onClick={handleClearReminder} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', flexShrink: 0 }}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="text" className="input-field" placeholder="e.g. Appointment with Dr. Sharma" value={reminderText} onChange={e => setReminderText(e.target.value)} style={{ padding: '12px 16px', fontSize: '0.9rem' }} />
            <input type="date" className="input-field" value={reminderDate} onChange={e => setReminderDate(e.target.value)} style={{ padding: '12px 16px', fontSize: '0.9rem' }} />
            <button className="btn-primary hover-lift" onClick={handleSaveReminder} style={{ padding: '12px', fontSize: '0.9rem', borderRadius: 14, minHeight: 'unset', fontWeight: 600 }}>
              <Check size={16} style={{ marginRight: 6 }} /> Save Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
