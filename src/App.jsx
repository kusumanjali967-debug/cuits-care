import { Routes, Route } from 'react-router-dom';
import ThemeSwitcher from './components/ThemeSwitcher';
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
import SkinDiary from './pages/SkinDiary';
import PhotoJournal from './pages/PhotoJournal';
import IngredientSearch from './pages/IngredientSearch';
import SkinChat from './pages/SkinChat';
import ColorPalette from './pages/ColorPalette';
import Settings from './pages/Settings';
import DermatologistFinder from './pages/DermatologistFinder';

function App() {
  return (
    <div className="mobile-container">
      <ThemeSwitcher />
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
        <Route path="/profile/settings" element={<Settings />} />
        <Route path="/profile/dermatologist" element={<DermatologistFinder />} />
        <Route path="/routine/edit" element={<EditRoutine />} />
        <Route path="/circadian" element={<CircadianClock />} />
        <Route path="/compatibility" element={<IngredientScanner />} />
        <Route path="/wellness/yoga" element={<SkinYoga />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/diary" element={<SkinDiary />} />
        <Route path="/photos" element={<PhotoJournal />} />
        <Route path="/ingredients" element={<IngredientSearch />} />
        <Route path="/chat" element={<SkinChat />} />
        <Route path="/palette" element={<ColorPalette />} />
      </Routes>
    </div>
  );
}

export default App;
