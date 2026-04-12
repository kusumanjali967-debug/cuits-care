import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CameraAnalysis from './pages/CameraAnalysis';
import MySkinIssues from './pages/MySkinIssues';
import MyCurrentProducts from './pages/MyCurrentProducts';

function App() {
  return (
    <div className="mobile-container">
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/camera" element={<CameraAnalysis />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/issues" element={<MySkinIssues />} />
        <Route path="/profile/products" element={<MyCurrentProducts />} />
      </Routes>
    </div>
  );
}

export default App;
