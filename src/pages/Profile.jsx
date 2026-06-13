import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Settings, LogOut, Heart, Clock,
  Edit3, X, Check, Calendar, Camera, Bell, ExternalLink, Mail, Send, Key, ArrowLeft
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { sendWelcomeEmail } from '../services/emailService';
import './Profile.css';

/* â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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
  setTimeout(() => fire('â˜€ï¸ Morning Routine', 'Time for your morning skincare routine!'), morning - now);
  setTimeout(() => fire('ðŸŒ™ Evening Routine', "Don't forget your night skincare routine!"), evening - now);
}

const DERM_LINKS = [
  { label: 'Practo',          emoji: 'ðŸ¥', url: 'https://www.practo.com/dermatologist',                              color: '#2563eb' },
  { label: 'Justdial',        emoji: 'ðŸ“ž', url: 'https://www.justdial.com/search?q=dermatologist',                   color: '#f59e0b' },
  { label: 'Apollo Hospitals', emoji: 'âš•ï¸', url: 'https://www.apollohospitals.com/find-a-doctor/dermatology/',       color: '#10b981' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { userData, updateUserData, logout } = useUser();

  const [isEditing,    setIsEditing]    = useState(false);
  const [tempType,     setTempType]     = useState(userData.skinType);
  const [tempIssues,   setTempIssues]   = useState(userData.skinIssues || []);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempName,        setTempName]       = useState(userData.name || 'Guest');
  const [notifEnabled,    setNotifEnabled]   = useState(
    () => localStorage.getItem('cuitsCare_notif_enabled') === 'true'
  );
  const [emailStatus, setEmailStatus] = useState('');  // '', 'sending', 'sent', 'error'

  const fileInputRef = useRef(null);

  const [isDermOpen,    setIsDermOpen]    = useState(false);
  const [reminderText,  setReminderText]  = useState('');
  const [reminderDate,  setReminderDate]  = useState('');
  const [savedReminder, setSavedReminder] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cuitsCare_appt_reminder') || 'null'); }
    catch { return null; }
  });

  const COMMON_ISSUES = ['Acne breakouts', 'Redness / Sensitivity', 'Dark Spots', 'Fine Lines', 'Dullness'];

  useEffect(() => {
    if (notifEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      scheduleRoutineReminders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const toggleIssue = (issue) =>
    setTempIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]);

  const saveProfile = () => {
    const updates = { skinType: tempType, skinIssues: tempIssues };
    if (tempType !== userData.skinType) { updates.morningRoutine = []; updates.nightRoutine = []; }
    updateUserData(updates);
    setIsEditing(false);
  };

  /* photo */
  const handlePhotoClick  = () => fileInputRef.current?.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateUserData({ profilePhoto: ev.target.result });
    reader.readAsDataURL(file);
  };

  /* notifications */
  const handleNotifToggle = async (checked) => {
    if (checked) {
      if (!('Notification' in window)) { alert('Your browser does not support notifications.'); return; }
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setNotifEnabled(true);
        localStorage.setItem('cuitsCare_notif_enabled', 'true');
        scheduleRoutineReminders();
        new Notification('ðŸŒ¸ Cuits Care', { body: 'Skincare reminders are now enabled!' });
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

  /* reminder */
  const handleSaveReminder = () => {
    if (!reminderText.trim() && !reminderDate) return;
    const obj = { text: reminderText.trim(), date: reminderDate };
    localStorage.setItem('cuitsCare_appt_reminder', JSON.stringify(obj));
    setSavedReminder(obj);
    setReminderText('');
    setReminderDate('');
  };
  const handleClearReminder = () => { localStorage.removeItem('cuitsCare_appt_reminder'); setSavedReminder(null); };

  return (
    <div className="profile-container pb-nav fade-in">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="profile-header pad-screen slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Profile</h2>
        <button className="icon-btn hover-lift" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <X size={24} /> : <Edit3 size={24} />}
        </button>
      </div>

      <div className="pad-screen stack-y spacing-lg">

        {/* â”€â”€ Edit / View card â”€â”€ */}
        {isEditing ? (
          <div className="glass-panel profile-card stack-y scale-in" style={{ alignItems: 'flex-start' }}>
            <h3>Edit Skin Profile</h3>
            <div style={{ width: '100%', marginTop: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Skin Type</label>
              <select value={tempType} onChange={(e) => setTempType(e.target.value)} className="input-field hover-lift" style={{ cursor: 'pointer', padding: '14px' }}>
                <option value="Unknown">Unknown</option>
                <option value="Normal">Normal</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Combination">Combination</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </div>
            <div style={{ width: '100%', marginTop: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Skin Issues</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {COMMON_ISSUES.map(issue => {
                  const isActive = tempIssues.includes(issue);
                  return (
                    <button key={issue} onClick={() => toggleIssue(issue)} className="hover-lift"
                      style={{ padding: '10px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, background: isActive ? 'var(--accent-gradient)' : 'var(--glass-bg)', color: isActive ? '#fff' : 'var(--text-primary)', border: `1px solid ${isActive ? 'transparent' : 'var(--glass-border)'}`, cursor: 'pointer', transition: 'all 0.3s ease' }}>
                      {issue}
                    </button>
                  );
                })}
              </div>
            </div>
            <button className="btn-primary hover-lift" style={{ marginTop: '20px' }} onClick={saveProfile}>
              <Check size={18} style={{ marginRight: '8px' }} /><span>Save Changes</span>
            </button>
          </div>
        ) : (
          <div className="glass-panel profile-card slide-up hover-lift" style={{ animationDelay: '0.1s' }}>

            {/* â”€â”€ Clickable avatar â”€â”€ */}
            <div
              onClick={handlePhotoClick}
              title="Change profile photo"
              style={{ position: 'relative', cursor: 'pointer', flexShrink: 0, width: '72px', height: '72px' }}
            >
              {userData.profilePhoto ? (
                <img
                  src={userData.profilePhoto}
                  alt="Profile"
                  style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--accent)', boxShadow: '0 4px 16px rgba(0,0,0,0.18)', transition: 'all 0.3s ease' }}
                />
              ) : (
                <div className="profile-avatar pulse-slow" style={{ width: '72px', height: '72px' }}>
                  <User size={36} color="#fff" />
                </div>
              )}
              {/* Camera badge */}
              <span style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                <Camera size={12} color="#fff" />
              </span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

            <div className="profile-info">
              <h3>{userData.name}</h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span className="skin-type-badge" style={{ margin: 0 }}>Skin: {userData.skinType}</span>
                {userData.score > 0 && (
                  <>
                    <span className="skin-type-badge" style={{ margin: 0, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 750 }}>Vitals: {userData.score}%</span>
                    <span className="skin-type-badge" style={{ margin: 0, background: 'rgba(0,0,0,0.06)', border: '1px solid var(--glass-border)', fontWeight: 650 }}>{userData.seasonalPalette}</span>
                  </>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                {(userData.skinIssues || []).map(issue => (
                  <span key={issue} style={{ fontSize: '0.75rem', background: 'var(--glass-bg)', padding: '6px 12px', borderRadius: '12px', fontWeight: 500 }}>{issue}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* â”€â”€ Menu â”€â”€ */}
        <div className="profile-menu stack-y slide-up" style={{ animationDelay: '0.2s' }}>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/history')}>
            <div className="menu-icon-wrapper"><Clock size={20} /></div>
            <span>My Scan History</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/products')}>
            <div className="menu-icon-wrapper"><Heart size={20} /></div>
            <span>My Current Products</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => setIsDermOpen(true)}>
            <div className="menu-icon-wrapper"><Calendar size={20} /></div>
            <span>Find a Dermatologist</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => setIsSettingsOpen(true)}>
            <div className="menu-icon-wrapper"><Settings size={20} /></div>
            <span>Settings</span>
          </button>
          <button className="menu-item glass-panel item-danger hover-lift" onClick={handleLogout}>
            <div className="menu-icon-wrapper danger-bg"><LogOut size={20} /></div>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* â•â•â•â•â•â•â•â• Dermatologist â€” full page style (matches Scan History) â•â•â•â•â•â•â•â• */}
      {isDermOpen && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 1000, overflowY: 'auto' }}>
          <div className="pad-screen" style={{ paddingTop: 40, paddingBottom: 80 }}>

            {/* Header â€” identical to Scan History */}
            <div style={{ marginBottom: 24 }}>
              <button className="icon-btn" onClick={() => setIsDermOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0 }}>
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>Find a Dermatologist ðŸ¥</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Book an appointment with a specialist</p>
            </div>

            {/* Quick links â€” glass-panel cards like scan history cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
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

            {/* Appointment Reminder â€” glass-panel card */}
            <div className="glass-panel" style={{ borderRadius: 18, padding: '18px 20px', border: '1px solid var(--glass-border)' }}>
              <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                <Bell size={16} color="var(--accent)" /> Appointment Reminder
              </p>
              {savedReminder ? (
                <div style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--accent-light)', border: '1px solid var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: 'var(--accent)' }}>Saved Reminder</p>
                    {savedReminder.text && <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>{savedReminder.text}</p>}
                    {savedReminder.date && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>ðŸ“… {new Date(savedReminder.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
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
        </div>
      )}

      {/* â•â•â•â•â•â•â•â• Settings â€” full page style (matches Scan History) â•â•â•â•â•â•â•â• */}
      {isSettingsOpen && (
        <div className="fade-in" style={{ position: 'fixed', inset: 0, background: 'var(--bg-primary)', zIndex: 1000, overflowY: 'auto' }}>
          <div className="pad-screen" style={{ paddingTop: 40, paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <button className="icon-btn" onClick={() => setIsSettingsOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 16, padding: 0 }}>
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>Settings âš™ï¸</h2>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your profile and preferences</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Display Name card */}
              <div className="glass-panel" style={{ borderRadius: 18, padding: '18px 20px', border: '1px solid var(--glass-border)' }}>
                <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <User size={15} color="var(--accent)" /> Display Name
                </p>
                <input type="text" className="input-field" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Your username" style={{ padding: '12px 16px', fontSize: '0.95rem' }} />
                <button className="btn-primary" onClick={() => { updateUserData({ name: tempName.trim() || userData.name }); setIsSettingsOpen(false); }}
                  style={{ marginTop: 12, padding: '11px', borderRadius: 12, fontSize: '0.9rem', minHeight: 'unset', fontWeight: 600, width: '100%' }}>
                  Save Name
                </button>
              </div>

              {/* Skincare Reminders card */}
              <div className="glass-panel" style={{ borderRadius: 18, padding: '18px 20px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: notifEnabled ? 'var(--accent-light)' : 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.25s' }}>
                    <Bell size={20} color={notifEnabled ? 'var(--accent)' : 'var(--text-secondary)'} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Skincare Reminders</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {notifEnabled ? 'ðŸ”” On â€” nudges at 8 am & 9 pm' : 'Get notified at 8 am & 9 pm'}
                    </p>
                  </div>
                </div>
                <div onClick={() => handleNotifToggle(!notifEnabled)}
                  style={{ width: 50, height: 28, borderRadius: 14, background: notifEnabled ? 'var(--accent)' : 'var(--glass-border)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.25s ease' }}>
                  <span style={{ position: 'absolute', top: 4, left: notifEnabled ? 26 : 4, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.25s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
                </div>
              </div>

              {/* Email Notifications card */}
              <div className="glass-panel" style={{ borderRadius: 18, padding: '18px 20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} color="var(--accent)" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Email Notifications</p>
                    {userData.email && <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ðŸ“§ {userData.email}</p>}
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: 8, background: 'var(--accent-light)', color: 'var(--accent)' }}>âœ… Active</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { icon: 'ðŸŒ¸', label: 'Welcome email on sign up' },
                    { icon: 'ðŸ”¬', label: 'Skin scan result summary' },
                    { icon: 'â°', label: 'Morning & evening reminders' },
                    { icon: 'ðŸ’¡', label: 'Weekly skin tips' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', padding: '6px 0', borderBottom: '1px solid var(--glass-border)' }}>
                      <span>{item.icon}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <button type="button" disabled={emailStatus === 'sending' || !userData.email}
                  onClick={async () => {
                    if (!userData.email) { alert('Please log in first.'); return; }
                    setEmailStatus('sending');
                    try {
                      const { sendWelcomeEmail: send } = await import('../services/emailService');
                      const res = await send({ name: userData.name || 'Friend', email: userData.email });
                      setEmailStatus(res?.success ? 'sent' : 'error');
                    } catch { setEmailStatus('error'); }
                    setTimeout(() => setEmailStatus(''), 4000);
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 12, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, opacity: emailStatus === 'sending' ? 0.7 : 1 }}>
                  <Send size={15} />
                  {emailStatus === 'sending' ? 'â³ Sendingâ€¦' : emailStatus === 'sent' ? 'âœ… Test Email Sent!' : emailStatus === 'error' ? 'âŒ Failed â€” try again' : 'ðŸ“¨ Send Test Email'}
                </button>
              </div>

              {/* Version card */}
              <div className="glass-panel" style={{ borderRadius: 18, padding: '16px 20px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>App Version</p>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>v1.2.0 âœ¨</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
