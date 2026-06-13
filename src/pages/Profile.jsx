import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Settings, LogOut, Heart, Clock,
  Edit3, X, Check, Calendar, Camera, Bell, ExternalLink, Mail, Send, Key
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { sendWelcomeEmail } from '../services/emailService';
import './Profile.css';

/* ─── helpers ────────────────────────────────────────────────────────── */
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

const DERM_LINKS = [
  { label: 'Practo',          emoji: '🏥', url: 'https://www.practo.com/dermatologist',                              color: '#2563eb' },
  { label: 'Justdial',        emoji: '📞', url: 'https://www.justdial.com/search?q=dermatologist',                   color: '#f59e0b' },
  { label: 'Apollo Hospitals', emoji: '⚕️', url: 'https://www.apollohospitals.com/find-a-doctor/dermatology/',       color: '#10b981' },
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
  const [emailKey,    setEmailKey]    = useState(
    () => localStorage.getItem('cuitsCare_email_key') || ''
  );
  const [emailStatus, setEmailStatus] = useState('');  // '', 'sending', 'sent', 'error'
  const [emailKeyDirty, setEmailKeyDirty] = useState(false);

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

      {/* ── Header ── */}
      <div className="profile-header pad-screen slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Profile</h2>
        <button className="icon-btn hover-lift" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <X size={24} /> : <Edit3 size={24} />}
        </button>
      </div>

      <div className="pad-screen stack-y spacing-lg">

        {/* ── Edit / View card ── */}
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

            {/* ── Clickable avatar ── */}
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

        {/* ── Menu ── */}
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

      {/* ════════ Dermatologist bottom-sheet modal ════════ */}
      {isDermOpen && (
        <div
          className="fade-in"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsDermOpen(false); }}
        >
          <div
            className="glass-panel scale-in"
            style={{ width: '100%', maxWidth: '480px', padding: '20px 24px 40px', display: 'flex', flexDirection: 'column', gap: '18px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)', borderRadius: '28px 28px 0 0' }}
          >
            {/* handle */}
            <div style={{ width: '40px', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', margin: '0 auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }} className="text-gradient">Book a Dermatologist</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Find specialists near you</p>
              </div>
              <button onClick={() => setIsDermOpen(false)} style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {DERM_LINKS.map(link => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '16px', background: 'var(--glass-bg)', border: `1px solid ${link.color}33`, textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem', boxShadow: `0 2px 12px ${link.color}18`, transition: 'transform 0.18s ease, box-shadow 0.18s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${link.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 2px 12px ${link.color}18`; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{link.emoji}</span>
                    <span>{link.label}</span>
                  </div>
                  <ExternalLink size={16} color={link.color} />
                </a>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)' }} />

            {/* Reminder section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={15} color="var(--accent)" /> Appointment Reminder
              </p>
              {savedReminder ? (
                <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'var(--accent-light)', border: '1px solid var(--accent)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
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
                <>
                  <input type="text" className="input-field" placeholder="e.g. Appointment with Dr. Sharma" value={reminderText} onChange={e => setReminderText(e.target.value)} style={{ padding: '12px 16px', fontSize: '0.9rem' }} />
                  <input type="date" className="input-field" value={reminderDate} onChange={e => setReminderDate(e.target.value)} style={{ padding: '12px 16px', fontSize: '0.9rem' }} />
                  <button className="btn-primary hover-lift" onClick={handleSaveReminder} style={{ padding: '12px', fontSize: '0.9rem', borderRadius: '14px', minHeight: 'unset', fontWeight: 600 }}>
                    <Check size={16} style={{ marginRight: '6px' }} /> Save Reminder
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════ Settings Modal ════════ */}
      {isSettingsOpen && (
        <div
          className="fade-in"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div
            className="glass-panel scale-in"
            style={{ width: '100%', maxWidth: '380px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', borderRadius: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }} className="text-gradient">Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>✕</button>
            </div>

            <div className="stack-y" style={{ gap: '16px', margin: '8px 0' }}>
              {/* Name */}
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Profile Display Name</label>
                <input type="text" className="input-field" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Your Name" style={{ padding: '12px 16px', fontSize: '0.95rem' }} />
              </div>

              {/* Notifications toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--glass-bg)', borderRadius: '14px', border: '1px solid var(--glass-border)', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: notifEnabled ? 'var(--accent-light)' : 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.25s' }}>
                    <Bell size={18} color={notifEnabled ? 'var(--accent)' : 'var(--text-secondary)'} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>Skincare Reminders</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {notifEnabled ? '🔔 On — 8 am & 9 pm nudges' : 'Get notified at 8 am & 9 pm'}
                    </p>
                  </div>
                </div>
                {/* Animated pill toggle */}
                <div
                  onClick={() => handleNotifToggle(!notifEnabled)}
                  style={{ width: '48px', height: '26px', borderRadius: '13px', background: notifEnabled ? 'var(--accent)' : 'var(--glass-border)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.25s ease' }}
                >
                  <span style={{ position: 'absolute', top: '3px', left: notifEnabled ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }} />
                </div>
              </div>

              {/* ── Email Notifications section ── */}
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <Mail size={16} color="var(--accent)" />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem' }}>Email Notifications</p>
                </div>

                {userData.email && (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    📧 Sending to: <strong style={{ color: 'var(--text-primary)' }}>{userData.email}</strong>
                  </p>
                )}

                {/* Access key input */}
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                    <Key size={13} /> Web3Forms Access Key
                    <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer"
                      style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                      Get free key <ExternalLink size={10} />
                    </a>
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Paste your access key here…"
                      value={emailKey}
                      onChange={e => { setEmailKey(e.target.value); setEmailKeyDirty(true); setEmailStatus(''); }}
                      style={{ padding: '10px 14px', fontSize: '0.82rem', flex: 1 }}
                    />
                    {emailKeyDirty && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('cuitsCare_email_key', emailKey);
                          setEmailKeyDirty(false);
                          setEmailStatus('saved');
                          setTimeout(() => setEmailStatus(''), 2000);
                        }}
                        style={{ padding: '10px 14px', borderRadius: 10, background: 'var(--accent-gradient)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        Save Key
                      </button>
                    )}
                  </div>
                  {emailStatus === 'saved' && <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--success)' }}>✅ Key saved!</p>}
                </div>

                {/* Test email button */}
                <button
                  type="button"
                  disabled={!emailKey || emailStatus === 'sending'}
                  onClick={async () => {
                    if (!emailKey) { alert('Please enter and save your Web3Forms access key first.'); return; }
                    if (!userData.email) { alert('No email on your account. Please log in first.'); return; }
                    // Temporarily override the key in emailService via localStorage
                    localStorage.setItem('cuitsCare_email_key', emailKey);
                    setEmailStatus('sending');
                    try {
                      // Dynamic import to pick up the saved key
                      const { sendWelcomeEmail: send } = await import('../services/emailService');
                      const res = await send({ name: userData.name || 'Friend', email: userData.email });
                      setEmailStatus(res?.success ? 'sent' : 'error');
                    } catch { setEmailStatus('error'); }
                    setTimeout(() => setEmailStatus(''), 4000);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '11px', borderRadius: 12,
                    background: emailKey ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                    color: emailKey ? '#fff' : 'var(--text-secondary)',
                    border: emailKey ? 'none' : '1px solid var(--glass-border)',
                    cursor: emailKey ? 'pointer' : 'not-allowed',
                    fontSize: '0.85rem', fontWeight: 700,
                  }}
                >
                  <Send size={15} />
                  {emailStatus === 'sending' ? '⏳ Sending…'
                   : emailStatus === 'sent'    ? '✅ Test Email Sent!'
                   : emailStatus === 'error'   ? '❌ Failed — check your key'
                   : '📨 Send Test Email'}
                </button>

                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  💡 How to get your free key: Go to{' '}
                  <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>web3forms.com</a>,
                  enter your email → click Create Access Key → check your email → paste the key above. Free plan: 250 emails/month.
                </p>
              </div>

              {/* Version */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Version</span>
                <span style={{ fontWeight: 600 }}>v1.2.0 (Stable)</span>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => { updateUserData({ name: tempName.trim() || userData.name }); setIsSettingsOpen(false); }}
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', minHeight: 'unset', fontWeight: 600 }}
            >
              Save Settings
            </button>
          </div>
        </div>
      )}



      <BottomNav />
    </div>
  );
}
