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
      <div className="profile-header pad-screen" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Profile</h2>
        <button className="icon-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? <X size={24} /> : <Edit3 size={24} />}
        </button>
      </div>

      <div className="pad-screen stack-y spacing-lg">
        {isEditing ? (
          <div className="glass-panel profile-card stack-y" style={{ alignItems: 'flex-start' }}>
            <h3>Edit Skin Profile</h3>
            
            <div style={{ width: '100%', marginTop: '12px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Skin Type</label>
              <select 
                value={tempType} 
                onChange={(e) => setTempType(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Skin Issues</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {COMMON_ISSUES.map(issue => {
                  const isActive = tempIssues.includes(issue);
                  return (
                    <button 
                      key={issue} 
                      onClick={() => toggleIssue(issue)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        background: isActive ? 'var(--accent)' : 'transparent',
                        color: isActive ? '#fff' : 'var(--text-primary)',
                        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--glass-border)'}`,
                        cursor: 'pointer'
                      }}
                    >
                      {issue}
                    </button>
                  )
                })}
              </div>
            </div>

            <button className="btn-primary" style={{ marginTop: '20px' }} onClick={saveProfile}>
              <Check size={18} style={{ marginRight: '8px' }} /> Save Changes
            </button>
          </div>
        ) : (
          <div className="glass-panel profile-card">
            <div className="profile-avatar">
              <User size={36} color="var(--bg-primary)" />
            </div>
            <div className="profile-info">
              <h3>{userData.name}</h3>
              <span className="skin-type-badge">Skin Type: {userData.skinType}</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {(userData.skinIssues || []).map(issue => (
                  <span key={issue} style={{ fontSize: '0.7rem', background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '12px' }}>{issue}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="profile-menu stack-y">
          <button className="menu-item glass-panel" onClick={() => navigate('/profile/history')}>
            <div className="menu-icon-wrapper"><Clock size={20} /></div>
            <span>My Scan History</span>
          </button>
          <button className="menu-item glass-panel" onClick={() => navigate('/profile/products')}>
            <div className="menu-icon-wrapper"><Heart size={20} /></div>
            <span>My Current Products</span>
          </button>
          <button className="menu-item glass-panel">
            <div className="menu-icon-wrapper"><Settings size={20} /></div>
            <span>Settings</span>
          </button>
          <button className="menu-item glass-panel item-danger" onClick={handleLogout}>
            <div className="menu-icon-wrapper danger-bg"><LogOut size={20} /></div>
            <span>Log Out</span>
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
