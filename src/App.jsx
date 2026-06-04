import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CameraAnalysis from './pages/CameraAnalysis';
import MySkinIssues from './pages/MySkinIssues';
import MyCurrentProducts from './pages/MyCurrentProducts';
import MyScanHistory from './pages/MyScanHistory';
import EditRoutine from './pages/EditRoutine';
import CircadianClock from './pages/CircadianClock';
import IngredientScanner from './pages/IngredientScanner';
import SkinYoga from './pages/SkinYoga';
import Recommendations from './pages/Recommendations';

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
        <Route path="/profile/history" element={<MyScanHistory />} />
        <Route path="/routine/edit" element={<EditRoutine />} />
        <Route path="/circadian" element={<CircadianClock />} />
        <Route path="/compatibility" element={<IngredientScanner />} />
        <Route path="/wellness/yoga" element={<SkinYoga />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </div>
  );
}

export default App;
