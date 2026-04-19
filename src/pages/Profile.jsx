import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, Info, Heart, Clock } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { userData, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-container pb-nav fade-in">
      <div className="profile-header pad-screen">
        <h2>My Profile</h2>
      </div>

      <div className="pad-screen stack-y spacing-lg">
        <div className="glass-panel profile-card">
          <div className="profile-avatar">
            <User size={36} color="var(--bg-primary)" />
          </div>
          <div className="profile-info">
            <h3>{userData.name}</h3>
            <span className="skin-type-badge">Skin Type: {userData.skinType}</span>
          </div>
        </div>

        <div className="profile-menu stack-y">
          <button className="menu-item glass-panel" onClick={() => navigate('/profile/history')}>
            <div className="menu-icon-wrapper"><Clock size={20} /></div>
            <span>My Scan History</span>
          </button>
          <button className="menu-item glass-panel" onClick={() => navigate('/profile/issues')}>
            <div className="menu-icon-wrapper"><Info size={20} /></div>
            <span>My Skin Issues</span>
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
