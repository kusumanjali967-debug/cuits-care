import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, CheckCircle, Bell, Droplet, Moon, Edit2, Star, Thermometer, MapPin, Sparkles } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, updateUserData, toggleRoutine } = useUser();
  const { t } = useLanguage();
  const [envData, setEnvData] = useState({ temp: '--', uv: '--', city: 'Locating...', loading: true });
  const [toast, setToast] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(1);
  const [isStylingModalOpen, setIsStylingModalOpen] = useState(false);
  
  const [waterLogged, setWaterLogged] = useState(() => {
    const saved = localStorage.getItem(`cuitsCare_water_${userData.email || 'guest'}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleLogWater = (cups) => {
    setWaterLogged(prev => {
      const updated = Math.min(12, Math.max(0, prev + cups));
      localStorage.setItem(`cuitsCare_water_${userData.email || 'guest'}`, updated.toString());
      return updated;
    });
  };

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

  const greeting = hour < 12 ? t('greetingMorning') : hour < 18 ? t('greetingAfternoon') : t('greetingEvening');
  
  const isHighUV = envData.uv !== '--' ? envData.uv >= 6 : (hour >= 10 && hour <= 16);
  const currentUV = envData.uv;

  const getDietInsight = (issues = [], type = "Unknown") => {
    let recommendations = [];

    // Skin type base advice
    if (type === 'Dry') {
      recommendations.push("For Dry skin: Focus on healthy fats like avocados, olive oil, and water-rich foods (cucumbers, watermelon).");
    } else if (type === 'Oily') {
      recommendations.push("For Oily skin: Minimize sugar and dairy. Eat zinc-rich foods like pumpkin seeds and spinach.");
    } else if (type === 'Combination') {
      recommendations.push("For Combination skin: Keep your diet balanced with walnuts or flaxseeds to help regulate T-zone oiliness.");
    } else if (type === 'Sensitive') {
      recommendations.push("For Sensitive skin: Eat anti-inflammatory foods (ginger, turmeric, blueberries) to soothe reactive skin.");
    } else {
      recommendations.push("Eat leafy greens, fresh fruits, and clean proteins to help keep skin clear and healthy.");
    }

    // Issues-specific advice
    if (issues.includes('Acne breakouts')) {
      recommendations.push("Limit dairy and sweet sugars today as they can trigger more breakouts.");
    }
    if (issues.includes('Redness / Sensitivity')) {
      recommendations.push("Avoid hot spices, tea, coffee, and alcohol today, which can make your skin look more red.");
    }
    if (issues.includes('Dark Spots') || issues.includes('Dullness')) {
      recommendations.push("Eat oranges, berries, and tomatoes to naturally support collagen and clear up dark spots.");
    }
    if (issues.includes('Fine Lines')) {
      recommendations.push("Eat oats and cucumbers to help keep your skin looking young and stretchy.");
    }

    const waterCups = type === 'Dry' || issues.includes('Dry Patches') ? 10 : 8;
    recommendations.push(`Drink at least ${waterCups} cups of water today.`);

    return recommendations.join(" ");
  };

  const dietInsight = getDietInsight(userData.skinIssues || [], userData.skinType);

  const score = userData.score || (userData.skinType && userData.skinType !== 'Unknown' ? 84 : 0);
  const undertone = userData.undertone || (userData.skinType === 'Sensitive' || userData.skinType === 'Oily' ? 'Cool' : userData.skinType && userData.skinType !== 'Unknown' ? 'Warm' : 'Unknown');
  const seasonalPalette = userData.seasonalPalette || (userData.skinType === 'Sensitive' ? 'Cool Summer' : userData.skinType === 'Oily' ? 'Cool Winter' : userData.skinType === 'Dry' ? 'Warm Autumn' : userData.skinType === 'Combination' ? 'Warm Spring' : userData.skinType && userData.skinType !== 'Unknown' ? 'Warm Autumn' : 'Unknown');

  const waterTarget = userData.skinType === 'Dry' || (userData.skinIssues || []).includes('Dry Patches') ? 10 : 8;
  const waterPercent = Math.min(100, Math.round((waterLogged / waterTarget) * 100));

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

  const handleStylingCardClick = () => {
    if (score === 0) {
      navigate('/camera');
    } else {
      setIsStylingModalOpen(true);
    }
  };

  return (
    <div className="dashboard-container pb-nav fade-in">
      <div className="dashboard-header pad-screen slide-up">
        <div className="header-text">
          <p className="greeting">{greeting}</p>
          <h2 style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>{userData.name}</span>
            <span style={{ fontSize: '0.9rem', display: 'flex', gap: '8px' }}>
              {userData.skinType && userData.skinType !== 'Unknown' ? (
                <span className="env-badge" style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontWeight: 700, fontSize: '0.8rem', padding: '4px 10px', borderRadius: '10px' }}>
                  {t('skinTypeLabel')}: {userData.skinType}
                </span>
              ) : (
                <button 
                  onClick={() => navigate('/onboarding')} 
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--accent)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  className="pulse-slow"
                >
                  {t('identifySkinType')}
                </button>
              )}
            </span>
          </h2>
        </div>
        <button className="icon-btn notif-btn" onClick={() => setIsNotifOpen(true)}>
          <Bell size={24} />
          {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
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
        <div className="glass-panel alert-card skin-alert card-3d slide-up" style={{ animationDelay: '0.1s' }}>
          <div className={`alert-icon-wrapper ${isHighUV ? 'uv-alert' : 'uv-safe'}`}>
            {isHighUV ? <Sun size={28} color="#fff" /> : <Moon size={28} color="#fff" />}
          </div>
          <div className="alert-content" style={{ width: '100%' }}>
            <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{isHighUV ? t('highUvAlert') : t('optimalConditions')}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}><MapPin size={12} style={{ display: 'inline', marginRight: 4 }}/>{envData.city}</span>
            </h3>
            <p>
              {isHighUV ? t('uvWarning') : t('uvSafe')}
            </p>
            <div className="env-details">
              <span className="env-badge"><Sun size={14}/> {t('uvIndex')} {currentUV}</span>
              <span className="env-badge"><Thermometer size={14}/> {envData.temp}°C</span>
            </div>
          </div>
        </div>

        {/* Skin Health & Personal Color Styling Card */}
        <div 
          className="glass-panel card-3d slide-up alert-card skin-alert" 
          onClick={handleStylingCardClick}
          style={{ gridColumn: '1 / -1', flexDirection: 'column', gap: '16px', padding: '24px', animationDelay: '0.15s', cursor: 'pointer' }}
        >
          <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--accent)" />
              {t('aiSkinStyling')}
            </span>
            {score > 0 && <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>{t('edit')} ✕ Details</span>}
          </h3>
          
          {score > 0 ? (
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
                    {undertone} {t('undertone')}
                  </span>
                  <span className="env-badge" style={{ background: 'rgba(0,0,0,0.06)', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 650, padding: '4px 8px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    {seasonalPalette}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {seasonalPalette === 'Warm Autumn' && "Warm colors look best on you! Terracotta, warm olives, and chocolate brown make you glow."}
                  {seasonalPalette === 'Cool Winter' && "Bright gem colors look best on you! Royal blue, emerald green, and magenta suit you well."}
                  {seasonalPalette === 'Cool Summer' && "Soft pastel colors look best on you! Soft lavender, dusty rose, and sage greens look beautiful."}
                  {seasonalPalette === 'Warm Spring' && "Bright clear colors look best on you! Peach orange, warm coral, and golden yellow look sunny."}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'underline' }}>Click card to see styling wardrobe & tips</span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-secondary)' }}>
              {t('unlockStylingPrompt')}
            </p>
          )}
        </div>

        {/* Dermatologist Recommendations CTA Card */}
        <div 
          className="glass-panel card-3d slide-up alert-card skin-alert" 
          onClick={() => navigate('/recommendations')}
          style={{ gridColumn: '1 / -1', gap: '16px', padding: '20px', animationDelay: '0.16s', cursor: 'pointer', border: '1px dashed var(--accent)', background: 'linear-gradient(135deg, rgba(103,139,102,0.06) 0%, rgba(216,140,125,0.06) 100%)' }}
        >
          <div className="alert-icon-wrapper" style={{ background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={28} color="#fff" />
          </div>
          <div className="alert-content" style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              {t('recTitle')}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {t('viewRecGuide')}
            </p>
          </div>
        </div>

        {/* Moisture Barrier fluid tracker */}
        <div className="glass-panel card-3d slide-up alert-card skin-alert" style={{ gridColumn: '1 / -1', flexDirection: 'column', gap: '16px', padding: '24px', animationDelay: '0.18s' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span>{t('hydrationTitle')}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('target')}: {waterTarget} {t('cupsLogged')}</span>
          </h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', width: '100%' }}>
            {/* Animated Frosted Cylinder */}
            <div style={{ width: '56px', height: '90px', borderRadius: '24px', border: '3px solid var(--glass-border)', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', flexShrink: 0, boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div 
                style={{ 
                  width: '100%', 
                  height: `${waterPercent}%`, 
                  background: 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)', 
                  borderRadius: '0 0 18px 18px',
                  transition: 'height 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 -4px 15px rgba(0,242,254,0.4)'
                }}
              >
                {/* Wave effect glow */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'rgba(255,255,255,0.6)', filter: 'blur(1px)' }}></div>
              </div>
              <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', zIndex: 5, mixBlendMode: 'difference' }}>
                {waterPercent}%
              </span>
            </div>

            {/* Logger controls */}
            <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="env-badge" style={{ background: waterPercent >= 100 ? 'var(--success)' : 'var(--accent-light)', color: waterPercent >= 100 ? '#fff' : 'var(--accent)', fontWeight: 750, fontSize: '0.75rem', padding: '4px 8px', borderRadius: '8px' }}>
                  {waterPercent >= 100 ? t('fullyHydrated') : `${waterLogged} / ${waterTarget} ${t('cupsLogged')}`}
                </span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {envData.loading ? "Calculating..." : envData.uv > 5 ? "It is very sunny today! Your body is losing water faster. Drink some water." : "Weather is nice. Keep your skin hydrated by logging water."}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button className="icon-btn" onClick={() => handleLogWater(1)} style={{ width: 'auto', padding: '8px 16px', minWidth: 'unset', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 650, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  {t('plusWater')}
                </button>
                <button className="icon-btn" onClick={() => handleLogWater(-1)} style={{ width: 'auto', padding: '8px 16px', minWidth: 'unset', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 650, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
                  {t('minusWater')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Skincare & Wellness Suite */}
        <section className="dashboard-section stack-y slide-up" style={{ gridColumn: '1 / -1', animationDelay: '0.22s', marginBottom: '8px' }}>
          <div className="section-header">
            <h3>{t('wellnessSuite')}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            <div className="glass-panel card-3d hover-lift" onClick={() => navigate('/compatibility')} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(245, 87, 108, 0.2)' }}>
                <Star size={24} color="#fff" />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{t('activeScanner')}</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('checkProductSynergy')}</span>
            </div>

            <div className="glass-panel card-3d hover-lift" onClick={() => navigate('/circadian')} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0, 242, 254, 0.2)' }}>
                <Sun size={24} color="#fff" />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{t('circadianClock')}</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('bioTimeOptimizations')}</span>
            </div>

            <div className="glass-panel card-3d hover-lift" onClick={() => navigate('/wellness/yoga')} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(56, 249, 215, 0.2)' }}>
                <Droplet size={24} color="#fff" />
              </div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>{t('skinYoga')}</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{t('facialAcupressureMap')}</span>
            </div>
          </div>
        </section>

        {/* Daily Skincare Routine */}
        <section className="dashboard-section stack-y slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3>{isNight ? t('nightRoutine') : t('morningRoutine')}</h3>
              <span className="progress-text">{completedCount}/{totalCount}</span>
            </div>
            <button className="icon-btn" onClick={() => navigate('/routine/edit')} style={{ minWidth: 'unset', width: 'auto', padding: '6px 12px', borderRadius: '12px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Edit2 size={14} /> <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{t('edit')}</span>
            </button>
          </div>
          
          <div className="routine-list stack-y">
            {currentRoutineArr.map(item => (
              <label key={item.id} className={`routine-item glass-panel card-3d ${item.completed ? 'checked' : ''}`} onClick={() => toggleRoutine(item.id)}>
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
            <h3>{t('dietInsights')}</h3>
          </div>
          <div className="glass-panel card-3d insight-card hover-lift">
            <div className="insight-header">
              <div className="alert-icon-wrapper water-bg">
                <Droplet size={24} color="#fff" />
              </div>
              <h4>Based on your profile:</h4>
            </div>
            <p><strong>{t('recommendation')}:</strong> {dietInsight}</p>
          </div>
        </section>

        {/* Suggested Products */}
        <section className="dashboard-section stack-y slide-up" style={{ gridColumn: '1 / -1', animationDelay: '0.4s' }}>
          <div className="section-header">
            <h3>{t('suggestedForYou')}</h3>
            <span className="progress-text" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{t('basedOnSkin')} {userData.skinType === 'Unknown' ? 'General' : userData.skinType} skin</span>
          </div>
          <div className="products-carousel">
            {recommendedProducts.map(prod => (
              <div key={prod.id} className="glass-panel card-3d product-card hover-lift">
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

      {/* Notifications Modal */}
      {isNotifOpen && (
        <div className="modal-overlay fade-in">
          <div className="modal-card scale-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }} className="text-gradient">Notifications</h3>
              <button 
                onClick={() => setIsNotifOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>
            
            <div className="stack-y" style={{ gap: '12px', margin: '8px 0' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1.3rem' }}>☀️</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>UV Index Warning</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    UV levels are elevated at your location today. Protect your skin with sunscreen!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1.3rem' }}>🧴</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Skincare Reminder</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    Time to perform your tailored {isNight ? 'Night' : 'Morning'} skincare routine!
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--glass-bg)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontSize: '1.3rem' }}>🥗</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nutrition Tip</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                    Incorporate Vitamin C-rich foods today to boost antioxidants and skin brightness.
                  </p>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => { setNotifCount(0); setIsNotifOpen(false); }} 
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', minHeight: 'unset', fontWeight: 600, marginTop: '16px' }}
            >
              Mark All as Read
            </button>
          </div>
        </div>
      )}

      {/* AI Styling Details Modal */}
      {isStylingModalOpen && (
        <div className="modal-overlay fade-in" onClick={() => setIsStylingModalOpen(false)}>
          <div className="modal-card scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }} className="text-gradient">
                <Sparkles size={20} color="var(--accent)" />
                AI Skin Styling Advisor
              </h3>
              <button 
                onClick={() => setIsStylingModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <div className="stack-y" style={{ gap: '20px' }}>
              {/* Vitals Summary */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--glass-bg)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 800 }}>
                  {score}%
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Skin Vitals Score</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.35 }}>
                    This shows how healthy, clear, and hydrated your skin looks today. High score means great barrier strength!
                  </p>
                </div>
              </div>

              {/* Color Styling Breakdown */}
              <div className="stack-y" style={{ gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Undertone: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{undertone}</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {undertone === 'Warm' 
                      ? "Your skin has golden, peach, or yellow undertones. Gold jewelry, copper details, and warm colors make you shine bright."
                      : "Your skin has pink, red, or blue undertones. Silver jewelry, platinum details, and cool cool tones suit you beautifully."}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Seasonal Palette: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{seasonalPalette}</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Your skin cells match the <strong>{seasonalPalette}</strong> range. Wearing clothing and makeup in this range highlights your natural brightness.
                  </p>
                </div>

                {/* Best Clothing Colors Swatches */}
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                  <h5 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {t('bestStylingColors')}
                  </h5>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {seasonalPalette === 'Warm Autumn' && (
                      <>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#c05a46', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', transform: 'hover: scale(1.1)' }} title="Terracotta"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#606c38', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Olive Green"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dda15e', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Mustard Gold"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#5c3d2e', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Chocolate Brown"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ae6378', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Warm Rose"></div>
                      </>
                    )}
                    {seasonalPalette === 'Cool Winter' && (
                      <>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1d3557', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Sapphire Blue"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#0f4c5c', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Emerald Green"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#8338ec', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Royal Purple"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e63946', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Ruby Red"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ff006e', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Magenta"></div>
                      </>
                    )}
                    {seasonalPalette === 'Cool Summer' && (
                      <>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#b3c5d7', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Soft Slate"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#95d5b2', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Sage Green"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#cdb4db', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Soft Lavender"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffafcc', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Dusty Rose"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#a8dadc', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Soft Teal"></div>
                      </>
                    )}
                    {seasonalPalette === 'Warm Spring' && (
                      <>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f2a65a', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Peach Orange"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f4a261', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Warm Coral"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e9c46a', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Golden Yellow"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2a9d8f', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Mint Teal"></div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f7d1cd', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }} title="Soft Cream"></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Makeup & Style Guidelines */}
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Simple Style Tips</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                    {undertone === 'Warm' 
                      ? "Choose warm corals, peach, and gold tones for makeup. For hair, warm chocolate brown and golden highlights suit you best."
                      : "Choose rose pinks, berry red, and cool plum tones for makeup. For hair, cool black, ash brown, or silver highlights suit you best."}
                  </p>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={() => setIsStylingModalOpen(false)} 
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', minHeight: 'unset', fontWeight: 600, marginTop: '20px' }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
