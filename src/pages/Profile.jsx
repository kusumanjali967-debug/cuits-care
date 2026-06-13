import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Settings, LogOut, Heart, Clock,
  Edit3, X, Check, Camera, Calendar
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './Profile.css';

/* ─── helpers ────────────────────────────────────────────────────────────── */
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

export default function Profile() {
  const navigate = useNavigate();
  const { userData, updateUserData, logout } = useUser();

  const [isEditing,    setIsEditing]    = useState(false);
  const [tempType,     setTempType]     = useState(userData.skinType);
  const [tempIssues,   setTempIssues]   = useState(userData.skinIssues || []);

  const fileInputRef = useRef(null);

  const COMMON_ISSUES = ['Acne breakouts', 'Redness / Sensitivity', 'Dark Spots', 'Fine Lines', 'Dullness'];

  useEffect(() => {
    const notifEnabled = localStorage.getItem('cuitsCare_notif_enabled') === 'true';
    if (notifEnabled && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      scheduleRoutineReminders();
    }
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

        {/* ─── Menu ─── */}
        <div className="profile-menu stack-y slide-up" style={{ animationDelay: '0.2s' }}>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/history')}>
            <div className="menu-icon-wrapper"><Clock size={20} /></div>
            <span>My Scan History</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/products')}>
            <div className="menu-icon-wrapper"><Heart size={20} /></div>
            <span>My Current Products</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/dermatologist')}>
            <div className="menu-icon-wrapper"><Calendar size={20} /></div>
            <span>Find a Dermatologist</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/settings')}>
            <div className="menu-icon-wrapper"><Settings size={20} /></div>
            <span>Settings</span>
          </button>
          <button className="menu-item glass-panel item-danger hover-lift" onClick={handleLogout}>
            <div className="menu-icon-wrapper danger-bg"><LogOut size={20} /></div>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
