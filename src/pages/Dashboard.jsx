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
          
          let cityName = 'Current Location';
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            cityName = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.county || 'Current Location';
          } catch (geoErr) {
            console.error("Geocoding error", geoErr);
          }
          
          setEnvData({ temp, uv, city: cityName, loading: false });
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

  const dietInsight = getDietInsight(userData.skinIssues || [], userData.skinType);

  const score = userData.score || (userData.skinType && userData.skinType !== 'Unknown' ? 84 : 0);
  const undertone = userData.undertone || (userData.skinType === 'Sensitive' || userData.skinType === 'Oily' ? 'Cool' : userData.skinType && userData.skinType !== 'Unknown' ? 'Warm' : 'Unknown');
  const seasonalPalette = userData.seasonalPalette || (userData.skinType === 'Sensitive' ? 'Cool Summer' : userData.skinType === 'Oily' ? 'Cool Winter' : userData.skinType === 'Dry' ? 'Warm Autumn' : userData.skinType === 'Combination' ? 'Warm Spring' : userData.skinType && userData.skinType !== 'Unknown' ? 'Warm Autumn' : 'Unknown');

  const getProductSuggestions = (skinType, issues = []) => {
    let products = [];

    if (skinType === 'Oily' || skinType === 'Combination') {
      products = [
        { id: 's1', name: 'Purifying Foaming Cleanser', type: 'Cleanser', rating: 4.8, img: '/oily_cleanser_1777102612025.png' },
        { id: 's2', name: 'Oil-Free Matte Gel', type: 'Moisturizer', rating: 4.7, img: '/oily_moisturizer_1777102628330.png' },
      ];
    } else if (skinType === 'Dry') {
      products = [
        { id: 's4', name: 'Hydrating Milky Cleanser', type: 'Cleanser', rating: 4.7, img: '/dry_cleanser_1777102677018.png' },
        { id: 's6', name: 'Deep Moisture Rescue Cream', type: 'Moisturizer', rating: 4.8, img: '/dry_moisturizer_1777102645442.png' },
      ];
    } else if (skinType === 'Sensitive') {
      products = [
        { id: 's7', name: 'Soothing Barrier Cleanser', type: 'Cleanser', rating: 4.8, img: '/dry_cleanser_1777102677018.png' },
        { id: 's9', name: 'Gentle Repair Ceramide Cream', type: 'Moisturizer', rating: 4.9, img: '/dry_moisturizer_1777102645442.png' },
      ];
    } else {
      products = [
        { id: 's10', name: 'Everyday Gentle Cleanser', type: 'Cleanser', rating: 4.7, img: '/cleanser_product_1776610783682.png' },
        { id: 's12', name: 'Daily Essential Moisturizer', type: 'Moisturizer', rating: 4.6, img: '/moisturizer_product_1776610911779.png' },
      ];
    }

    if (issues.includes('Acne breakouts')) {
      products.push({ id: 'i1', name: '2% BHA Salicylic Acid', type: 'Treatment', rating: 4.9, img: '/serum_product_1776610882923.png' });
    } else if (issues.includes('Dark Spots') || issues.includes('Dullness')) {
      products.push({ id: 'i2', name: '15% Vitamin C Brightening Serum', type: 'Serum', rating: 4.8, img: '/serum_product_1776610882923.png' });
    } else if (issues.includes('Fine Lines')) {
      products.push({ id: 'i3', name: 'Retinol 0.1% Night Serum', type: 'Serum', rating: 4.7, img: '/serum_product_1776610882923.png' });
    } else if (issues.includes('Redness / Sensitivity')) {
      products.push({ id: 'i4', name: 'Centella Asiatica Calming Ampoule', type: 'Serum', rating: 4.9, img: '/serum_product_1776610882923.png' });
    } else {
      products.push({ id: 'i5', name: 'Niacinamide Balancing Serum', type: 'Serum', rating: 4.9, img: '/serum_product_1776610882923.png' });
    }

    return products;
  };

  const recommendedProducts = getProductSuggestions(userData.skinType, userData.skinIssues || []);

  return (
    <div className="dashboard-container pb-nav fade-in">
      <div className="dashboard-header pad-screen slide-up">
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

      <div className="pad-screen dashboard-grid spacing-lg">
        {/* Environment Alert */}
        <div className="glass-panel alert-card skin-alert slide-up" style={{ animationDelay: '0.1s' }}>
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

        {/* Skin Health & Personal Color Styling */}
        {score > 0 && (
          <div className="glass-panel slide-up alert-card skin-alert" style={{ gridColumn: '1 / -1', flexDirection: 'column', gap: '16px', padding: '24px', animationDelay: '0.15s' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>AI Skin Health & Styling</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Seasonal Color Palette</span>
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', width: '100%' }}>
              {/* Circular SVG Ring */}
              <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg style={{ width: '80px', height: '80px', transform: 'rotate(-90deg)' }}>
                  <circle cx="40" cy="40" r="34" stroke="var(--glass-border)" strokeWidth="6" fill="transparent" style={{ opacity: 0.3 }} />
                  <circle cx="40" cy="40" r="34" stroke="var(--accent)" strokeWidth="6" fill="transparent" 
                    strokeDasharray={`${2 * Math.PI * 34}`} 
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - score / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                  />
                </svg>
                <span style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{score}%</span>
              </div>

              {/* Badges & Description */}
              <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span className="env-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 750, padding: '4px 8px', borderRadius: '8px' }}>
                    {undertone} Undertone
                  </span>
                  <span className="env-badge" style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 650, padding: '4px 8px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    {seasonalPalette}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {seasonalPalette === 'Warm Autumn' && "Rich, earthy shades bring out your warm undertones. Your best matches are terracotta, warm olives, and deep chocolate."}
                  {seasonalPalette === 'Cool Winter' && "Vibrant jewel tones look stunning against your cool undertones. Flatter yourself with royal sapphire, emerald, and magenta."}
                  {seasonalPalette === 'Cool Summer' && "Soft, muted pastels frame your cool undertones beautifully. Opt for delicate lavender, dusty rose, and calm sage greens."}
                  {seasonalPalette === 'Warm Spring' && "Bright, lively clear colors emphasize your sunny warm undertones. Enhance your glow with peach, warm coral, and golden yellow."}
                </p>
              </div>
            </div>

            {/* Colors Swatch */}
            <div style={{ width: '100%', borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '4px' }}>
              <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 700 }}>
                Your Best Styling Colors
              </h5>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {seasonalPalette === 'Warm Autumn' && (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#c05a46', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Terracotta"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#606c38', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Olive Green"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dda15e', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Mustard Gold"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5c3d2e', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Chocolate Brown"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ae6378', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Warm Rose"></div>
                  </>
                )}
                {seasonalPalette === 'Cool Winter' && (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1d3557', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Sapphire Blue"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f4c5c', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Emerald Green"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8338ec', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Royal Purple"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e63946', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Ruby Red"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ff006e', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Magenta"></div>
                  </>
                )}
                {seasonalPalette === 'Cool Summer' && (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#b3c5d7', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Soft Slate"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#95d5b2', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Sage Green"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#cdb4db', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Soft Lavender"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffafcc', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Dusty Rose"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#a8dadc', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Soft Teal"></div>
                  </>
                )}
                {seasonalPalette === 'Warm Spring' && (
                  <>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f2a65a', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Peach Orange"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f4a261', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Warm Coral"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e9c46a', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Golden Yellow"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2a9d8f', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Mint Teal"></div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f7d1cd', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} title="Soft Cream"></div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Daily Skincare Routine */}
        <section className="dashboard-section stack-y slide-up" style={{ animationDelay: '0.2s' }}>
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
        <section className="dashboard-section stack-y slide-up" style={{ animationDelay: '0.3s' }}>
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
        <section className="dashboard-section stack-y slide-up" style={{ gridColumn: '1 / -1', animationDelay: '0.4s' }}>
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
