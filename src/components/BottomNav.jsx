import { NavLink } from 'react-router-dom';
import { Home, Camera, User, MessageCircle, BookOpen } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/ingredients" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <BookOpen size={22} />
        <span>Wiki</span>
      </NavLink>

      <NavLink to="/camera" className={({isActive}) => isActive ? "nav-item camera-btn active" : "nav-item camera-btn"}>
        <div className="camera-circle">
          <Camera size={26} />
        </div>
      </NavLink>

      <NavLink to="/chat" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <MessageCircle size={22} />
        <span>Chat</span>
      </NavLink>

      <NavLink to="/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </div>
  );
}
