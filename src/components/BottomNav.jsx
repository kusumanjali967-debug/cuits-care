import { NavLink } from 'react-router-dom';
import { Home, Camera, User } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      
      <NavLink to="/camera" className={({isActive}) => isActive ? "nav-item camera-btn active" : "nav-item camera-btn"}>
        <div className="camera-circle">
          <Camera size={28} />
        </div>
      </NavLink>
      
      <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
}
