import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CheckCircle, Bell, Droplet, Moon, Edit2, Star, Thermometer, MapPin } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, updateUserData, toggleRoutine } = useUser();
  const [envData, setEnvData] = useState({ temp: '--', uv: '--', city: 'Locating...', loading: true });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (userData.morningRoutine?.length === 0 && userData.nightRoutine?.length === 0) {
      let morning = [];
      let night = [];
      const st = userData.skinType || 'Unknown';
      
      if (st === 'Oily' || st === 'Combination') {
        morning = [
          { id: Date.now()+1, name: "CeraVe Foaming Cleanser", completed: false },
          { id: Date.now()+2, name: "The Ordinary Niacinamide", completed: false },
          { id: Date.now()+3, name: "Neutrogena Hydro Boost Sunscreen SPF 50", completed: false }
        ];
        night = [
          { id: Date.now()+4, name: "CeraVe Foaming Cleanser", completed: false },
          { id: Date.now()+5, name: "Paula's Choice 2% BHA Liquid", completed: false },
          { id: Date.now()+6, name: "Neutrogena Hydro Boost Gel", completed: false }
        ];
      } else if (st === 'Dry') {
        morning = [
          { id: Date.now()+1, name: "CeraVe Hydrating Cleanser", completed: false },
          { id: Date.now()+2, name: "COSRX Snail Mucin 96 Essence", completed: false },
          { id: Date.now()+3, name: "Isntree Watery Sun Gel SPF 50", completed: false }
        ];
        night = [
          { id: Date.now()+4, name: "CeraVe Hydrating Cleanser", completed: false },
          { id: Date.now()+5, name: "The Ordinary Hyaluronic Acid", completed: false },
          { id: Date.now()+6, name: "Vanicream Daily Facial Moisturizer", completed: false }
        ];
      } else if (st === 'Sensitive') {
        morning = [
          { id: Date.now()+1, name: "Cetaphil Gentle Cleanser", completed: false },
          { id: Date.now()+2, name: "Aveeno Calm + Restore Serum", completed: false },
          { id: Date.now()+3, name: "Eltamd UV Clear Broad-Spectrum", completed: false }
        ];
        night = [
          { id: Date.now()+4, name: "Cetaphil Gentle Cleanser", completed: false },
          { id: Date.now()+5, name: "Aveeno Calm + Restore Oat Gel", completed: false }
        ];
      } else {
        morning = [
          { id: Date.now()+1, name: "La Roche-Posay Toleriane Cleanser", completed: false },
          { id: Date.now()+2, name: "Good Molecules Niacinamide Serum", completed: false },
          { id: Date.now()+3, name: "Beauty of Joseon Relief Sun", completed: false }
        ];
        night = [
          { id: Date.now()+4, name: "La Roche-Posay Toleriane Cleanser", completed: false },
          { id: Date.now()+5, name: "CeraVe PM Facial Moisturizing Lotion", completed: false }
        ];
      }
      
      updateUserData({ morningRoutine: morning, nightRoutine: night });
      setToast(`Created a daily routine with highly-rated items for ${st === 'Unknown' ? 'General' : st} skin!`);
      setTimeout(() => setToast(null), 4500);
    }
  }, [userData.morningRoutine, userData.nightRoutine, userData.skinType, updateUserData]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,uv_index`);
          const data = await res.json();
          const temp = Math.round(data.current.temperature_2m);
          const uv = Math.round(data.current.uv_index);
          
          setEnvData({ temp, uv, city: 'Current Location', loading: false });
        } catch (err) {
          setEnvData(prev => ({ ...prev, loading: false }));
        }
      }, () => {
        setEnvData(prev => ({ ...prev, city: 'Location Access Denied', loading: false }));
      });
    } else {
      setEnvData(prev => ({ ...prev, city: 'GPS Not Supported', loading: false }));
    }
  }, []);

  const hour = new Date().getHours();
  const isNight = hour >= 17 || hour < 4;
  const currentRoutineArr = isNight ? (userData.nightRoutine || []) : (userData.morningRoutine || []);

  const completedCount = currentRoutineArr.filter(r => r.completed).length;
  const totalCount = currentRoutineArr.length;

  const greeting = hour < 12 ? "Good Morning," : hour < 18 ? "Good Afternoon," : "Good Evening,";
  
  const isHighUV = envData.uv !== '--' ? envData.uv >= 6 : (hour >= 10 && hour <= 16);
  const currentUV = envData.uv;

  const getDietInsight = (issues, type) => {
    if (issues.includes('Acne breakouts')) return "Try to limit dairy and high-sugar foods today to reduce inflammation and prevent new breakouts.";
    if (issues.includes('Redness / Sensitivity')) return "Incorporate anti-inflammatory foods like berries, nuts, and leafy greens to help soothe your skin.";
    if (type === 'Dry' || issues.includes('Dullness')) return "Your skin needs hydration! Aim for 8 glasses of water today and eat water-rich foods.";
    return "Maintain a balanced diet rich in antioxidants today to keep your skin in its best shape.";
  };

  const dietInsight = getDietInsight(userData.skinIssues, userData.skinType);

  const getProductSuggestions = (skinType) => {
    if (skinType === 'Oily' || skinType === 'Combination') {
      return [
        { id: 's1', name: 'Purifying Foaming Cleanser', type: 'Cleanser', rating: 4.8, img: '/cleanser_product_1776610783682.png' },
        { id: 's2', name: 'Niacinamide Balancing Serum', type: 'Serum', rating: 4.9, img: '/serum_product_1776610882923.png' },
        { id: 's3', name: 'Oil-Free Matte Gel', type: 'Moisturizer', rating: 4.7, img: '/moisturizer_product_1776610911779.png' },
      ];
    } else if (skinType === 'Dry') {
      return [
        { id: 's4', name: 'Hydrating Milky Cleanser', type: 'Cleanser', rating: 4.7, img: '/cleanser_product_1776610783682.png' },
        { id: 's5', name: 'Hyaluronic Acid Drops', type: 'Serum', rating: 4.9, img: '/serum_product_1776610882923.png' },
        { id: 's6', name: 'Deep Moisture Rescue Cream', type: 'Moisturizer', rating: 4.8, img: '/moisturizer_product_1776610911779.png' },
      ];
    } else if (skinType === 'Sensitive') {
      return [
        { id: 's7', name: 'Soothing Barrier Cleanser', type: 'Cleanser', rating: 4.8, img: '/cleanser_product_1776610783682.png' },
        { id: 's8', name: 'Calming Centella Serum', type: 'Serum', rating: 4.9, img: '/serum_product_1776610882923.png' },
        { id: 's9', name: 'Gentle Repair Ceramide Cream', type: 'Moisturizer', rating: 4.9, img: '/moisturizer_product_1776610911779.png' },
      ];
    } else {
      return [
        { id: 's10', name: 'Everyday Gentle Cleanser', type: 'Cleanser', rating: 4.7, img: '/cleanser_product_1776610783682.png' },
        { id: 's11', name: 'Glow Enhancing Serum', type: 'Serum', rating: 4.8, img: '/serum_product_1776610882923.png' },
        { id: 's12', name: 'Daily Essential Moisturizer', type: 'Moisturizer', rating: 4.6, img: '/moisturizer_product_1776610911779.png' },
      ];
    }
  };

  const recommendedProducts = getProductSuggestions(userData.skinType);

  return (
    <div className="dashboard-container pb-nav fade-in">
      <div className="dashboard-header pad-screen">
        <div className="header-text">
          <p className="greeting">{greeting}</p>
          <h2>{userData.name}</h2>
        </div>
        <button className="icon-btn notif-btn">
          <Bell size={24} />
          <span className="notif-badge">1</span>
        </button>
      </div>

      {toast && (
        <div className="toast-container">
          <div className="toast-message">
            <CheckCircle size={20} color="var(--success)" />
            {toast}
          </div>
        </div>
      )}

      <div className="pad-screen stack-y spacing-lg">
        {/* Environment Alert */}
        <div className="glass-panel alert-card skin-alert">
          <div className={`alert-icon-wrapper ${isHighUV ? 'uv-alert' : 'uv-safe'}`}>
            {isHighUV ? <Sun size={28} color="#fff" /> : <Moon size={28} color="#fff" />}
          </div>
          <div className="alert-content" style={{ width: '100%' }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{isHighUV ? `High UV Alert` : `Optimal Conditions`}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }}/>{envData.city}</span>
            </h3>
            <p>
              {isHighUV 
                ? "Don't forget to apply SPF 50+. We'll remind you to reapply in 2 hours." 
                : "Safe environment right now. Complete your routine optimally!"}
            </p>
            <div className="env-details">
              <span className="env-badge"><Sun size={14}/> UV Index {currentUV}</span>
              <span className="env-badge"><Thermometer size={14}/> {envData.temp}°C</span>
            </div>
          </div>
        </div>

        {/* Daily Skincare Routine */}
        <section className="dashboard-section stack-y">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3>{isNight ? 'Night Routine' : 'Morning Routine'}</h3>
              <span className="progress-text">{completedCount}/{totalCount}</span>
            </div>
            <button className="icon-btn" onClick={() => navigate('/routine/edit')} style={{ minWidth: 'unset', width: 'auto', padding: '6px 12px', borderRadius: '12px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Edit2 size={14} /> <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Edit</span>
            </button>
          </div>
          
          <div className="routine-list stack-y">
            {currentRoutineArr.map(item => (
              <label key={item.id} className={`routine-item glass-panel ${item.completed ? 'checked' : ''}`} onClick={() => toggleRoutine(item.id)}>
                <div className="routine-icon">
                  {item.completed ? <CheckCircle size={20} color="var(--success)" /> : <span className="checkbox-empty"></span>}
                </div>
                <span>{item.name}</span>
              </label>
            ))}
            {currentRoutineArr.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '12px 0' }}>No routine steps set up yet.</p>
            )}
          </div>
        </section>

        {/* Diet & Health Tracking */}
        <section className="dashboard-section stack-y">
          <div className="section-header">
            <h3>Diet Insights</h3>
          </div>
          <div className="glass-panel insight-card hover-lift">
            <div className="insight-header">
              <div className="alert-icon-wrapper water-bg">
                <Droplet size={24} color="#fff" />
              </div>
              <h4>Based on your profile:</h4>
            </div>
            <p><strong>Recommendation:</strong> {dietInsight}</p>
          </div>
        </section>
        {/* Suggested Products */}
        <section className="dashboard-section stack-y">
          <div className="section-header">
            <h3>Suggested For You</h3>
            <span className="progress-text" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Based on {userData.skinType === 'Unknown' ? 'General' : userData.skinType} skin</span>
          </div>
          <div className="products-carousel">
            {recommendedProducts.map(prod => (
              <div key={prod.id} className="glass-panel product-card hover-lift">
                <div className="product-img-wrapper">
                  <img src={prod.img} alt={prod.name} />
                </div>
                <div className="product-info">
                  <h5>{prod.name}</h5>
                  <span className="product-type">{prod.type}</span>
                  <div className="product-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{prod.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
