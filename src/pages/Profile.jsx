import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Info, Heart, Clock, Edit3, X, Check } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { userData, updateUserData, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [tempType, setTempType] = useState(userData.skinType);
  const [tempIssues, setTempIssues] = useState(userData.skinIssues || []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempName, setTempName] = useState(userData.name || "Guest");
  const [dailyReminders, setDailyReminders] = useState(true);

  const COMMON_ISSUES = [
    "Acne breakouts", "Redness / Sensitivity", "Dark Spots", 
    "Fine Lines", "Dullness"
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleIssue = (issue) => {
    setTempIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const saveProfile = () => {
    const updates = { skinType: tempType, skinIssues: tempIssues };
    
    // If skin type changed, clear the routines so they regenerate with new products
    if (tempType !== userData.skinType) {
      updates.morningRoutine = [];
      updates.nightRoutine = [];
    }
    
    updateUserData(updates);
    setIsEditing(false);
  };

  return (
    <div className="profile-container pb-nav fade-in">
      <div className="profile-header pad-screen slide-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Profile</h2>
        <button className="icon-btn hover-lift" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <X size={24} /> : <Edit3 size={24} />}
        </button>
      </div>

      <div className="pad-screen stack-y spacing-lg">
        {isEditing ? (
          <div className="glass-panel profile-card stack-y scale-in" style={{ alignItems: 'flex-start' }}>
            <h3>Edit Skin Profile</h3>
            
            <div style={{ width: '100%', marginTop: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Skin Type</label>
              <select 
                value={tempType} 
                onChange={(e) => setTempType(e.target.value)}
                className="input-field hover-lift"
                style={{ cursor: 'pointer', padding: '14px' }}
              >
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
                    <button 
                      key={issue} 
                      onClick={() => toggleIssue(issue)}
                      className="hover-lift"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 600 : 500,
                        background: isActive ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                        color: isActive ? '#fff' : 'var(--text-primary)',
                        border: `1px solid ${isActive ? 'transparent' : 'var(--glass-border)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {issue}
                    </button>
                  )
                })}
              </div>
            </div>

            <button className="btn-primary hover-lift" style={{ marginTop: '20px' }} onClick={saveProfile}>
              <Check size={18} style={{ marginRight: '8px' }} /> <span>Save Changes</span>
            </button>
          </div>
        ) : (
          <div className="glass-panel profile-card slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
            <div className="profile-avatar pulse-slow">
              <User size={36} color="#fff" />
            </div>
            <div className="profile-info">
              <h3>{userData.name}</h3>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span className="skin-type-badge" style={{ margin: 0 }}>Skin: {userData.skinType}</span>
                {userData.score > 0 && (
                  <>
                    <span className="skin-type-badge" style={{ margin: 0, background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 750 }}>
                      Vitals: {userData.score}%
                    </span>
                    <span className="skin-type-badge" style={{ margin: 0, background: 'rgba(0,0,0,0.06)', border: '1px solid var(--glass-border)', fontWeight: 650 }}>
                      {userData.seasonalPalette}
                    </span>
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

        <div className="profile-menu stack-y slide-up" style={{ animationDelay: '0.2s' }}>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/history')}>
            <div className="menu-icon-wrapper"><Clock size={20} /></div>
            <span>My Scan History</span>
          </button>
          <button className="menu-item glass-panel hover-lift" onClick={() => navigate('/profile/products')}>
            <div className="menu-icon-wrapper"><Heart size={20} /></div>
            <span>My Current Products</span>
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

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} className="fade-in">
          <div className="glass-panel scale-in" style={{ width: '100%', maxWidth: '380px', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.2)', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }} className="text-gradient">Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
            
            <div className="stack-y" style={{ gap: '16px', margin: '8px 0' }}>
              {/* Profile Name input */}
              <div className="input-group">
                <label style={{ fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Profile Display Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)} 
                  placeholder="Your Name"
                  style={{ padding: '12px 16px', fontSize: '0.95rem' }}
                />
              </div>

              {/* Reminders Toggle Switch mockup */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Skincare Reminders</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Get notified when it's time for routines</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={dailyReminders} 
                  onChange={(e) => setDailyReminders(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>

              {/* Version info info item */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Version</span>
                <span style={{ fontWeight: 600 }}>v1.2.0 (Stable)</span>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => {
                updateUserData({ name: tempName.trim() || userData.name });
                setIsSettingsOpen(false);
              }} 
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
