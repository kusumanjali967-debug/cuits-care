import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, User, Bell, Mail, Send } from 'lucide-react';
import { sendWelcomeEmail } from '../services/emailService';

function scheduleRoutineReminders() {
  const now = new Date();
  const morning = new Date(now);
  morning.setHours(8, 0, 0, 0);
  if (morning <= now) morning.setDate(morning.getDate() + 1);
  const evening = new Date(now);
  evening.setHours(21, 0, 0, 0);
  if (evening <= now) evening.setDate(evening.getDate() + 1);
  const fire = (title, body) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo192.png' });
    }
  };
  setTimeout(() => fire('☀️ Morning Routine', 'Time for your morning skincare routine!'), morning - now);
  setTimeout(() => fire('🌙 Evening Routine', "Don't forget your night skincare routine!"), evening - now);
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();

  const [tempName, setTempName] = useState(userData.name || 'Guest');
  const [notifEnabled, setNotifEnabled] = useState(
    () => localStorage.getItem('cuitsCare_notif_enabled') === 'true'
  );
  const [emailStatus, setEmailStatus] = useState(''); // '', 'sending', 'sent', 'error'

  useEffect(() => {
    if (notifEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      scheduleRoutineReminders();
    }
  }, [notifEnabled]);

  const handleNotifToggle = async (checked) => {
    if (checked) {
      if (!('Notification' in window)) {
        alert('Your browser does not support notifications.');
        return;
      }
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotifEnabled(true);
        localStorage.setItem('cuitsCare_notif_enabled', 'true');
        scheduleRoutineReminders();
        new Notification('🌸 Cuits Care', { body: 'Skincare reminders are now enabled!' });
      } else {
        setNotifEnabled(false);
        localStorage.setItem('cuitsCare_notif_enabled', 'false');
        alert('Notification permission denied. Please enable it in your browser settings.');
      }
    } else {
      setNotifEnabled(false);
      localStorage.setItem('cuitsCare_notif_enabled', 'false');
    }
  };

  const handleSaveName = () => {
    updateUserData({ name: tempName.trim() || userData.name });
    navigate(-1);
  };

  const handleSendTestEmail = async () => {
    if (!userData.email) {
      alert('Please log in first.');
      return;
    }
    setEmailStatus('sending');
    try {
      const res = await sendWelcomeEmail({ name: userData.name || 'Friend', email: userData.email });
      setEmailStatus(res?.success ? 'sent' : 'error');
    } catch {
      setEmailStatus('error');
    }
    setTimeout(() => setEmailStatus(''), 4000);
  };

  return (
    <div className="pad-screen fade-in" style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button className="icon-btn" onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px', padding: 0 }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>Settings ⚙️</h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Manage your profile and preferences
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Display Name card */}
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '18px 20px', border: '1px solid var(--glass-border)' }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 7 }}>
            <User size={15} color="var(--accent)" /> Display Name
          </p>
          <input type="text" className="input-field" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Your username" style={{ padding: '12px 16px', fontSize: '0.95rem' }} />
          <button className="btn-primary" onClick={handleSaveName}
            style={{ marginTop: 12, padding: '11px', borderRadius: 12, fontSize: '0.9rem', minHeight: 'unset', fontWeight: 600, width: '100%' }}>
            Save Name
          </button>
        </div>

        {/* Skincare Reminders card */}
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '18px 20px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: notifEnabled ? 'var(--accent-light)' : 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.25s' }}>
              <Bell size={20} color={notifEnabled ? 'var(--accent)' : 'var(--text-secondary)'} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Skincare Reminders</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {notifEnabled ? '🔔 On — nudges at 8 am & 9 pm' : 'Get notified at 8 am & 9 pm'}
              </p>
            </div>
          </div>
          <div onClick={() => handleNotifToggle(!notifEnabled)}
            style={{ width: 50, height: 28, borderRadius: 14, background: notifEnabled ? 'var(--accent)' : 'var(--glass-border)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.25s ease' }}>
            <span style={{ position: 'absolute', top: 4, left: notifEnabled ? 26 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
          </div>
        </div>

        {/* Email Notifications card */}
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '18px 20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={20} color="var(--accent)" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Email Notifications</p>
              {userData.email && <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📧 {userData.email}</p>}
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: 'var(--accent-light)', color: 'var(--accent)' }}>✓ Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { icon: '🌸', label: 'Welcome email on sign up' },
              { icon: '🔬', label: 'Skin scan result summary' },
              { icon: '⏰', label: 'Morning & evening reminders' },
              { icon: '💡', label: 'Weekly skin tips' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid var(--glass-border)' }}>
                <span>{item.icon}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
            ))}
          </div>

          <button type="button" disabled={emailStatus === 'sending' || !userData.email}
            onClick={handleSendTestEmail}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, opacity: emailStatus === 'sending' ? 0.7 : 1 }}>
            <Send size={15} />
            {emailStatus === 'sending' ? '⏳ Sending…' : emailStatus === 'sent' ? '✓ Test Email Sent!' : emailStatus === 'error' ? '❌ Failed — try again' : '✉️ Send Test Email'}
          </button>
        </div>

        {/* Version card */}
        <div className="glass-panel" style={{ borderRadius: '18px', padding: '16px 20px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>App Version</p>
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>v1.2.0 ✨</span>
        </div>
      </div>
    </div>
  );
}
