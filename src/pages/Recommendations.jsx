import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Award, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import './Recommendations.css';

export default function Recommendations() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const { t } = useLanguage();

  const skinType = userData.skinType || 'Unknown';
  const issues = userData.skinIssues || [];

  // Dermatologist endorsement text matching skin type
  const getDermatologistQuote = (type) => {
    switch (type) {
      case 'Dry':
        return {
          doctor: "Dr. Elena Rostova, Board Certified Dermatologist",
          text: "Dry skin is compromised skin. By avoiding harsh soap washes and using nourishing cleansers alongside hydration locking creams, you prevent skin cracking and cell dehydration."
        };
      case 'Oily':
        return {
          doctor: "Dr. Marcus Vance, Cosmetic Dermatologist",
          text: "Oiliness is caused by hyperactive oil glands. Using Niacinamide and Salicylic Acid washes targets pore buildup directly, clearing blackheads without stripping your skin's vital layers."
        };
      case 'Combination':
        return {
          doctor: "Dr. Sarah Jenkins, Clinical Dermatologist",
          text: "Combination skin requires map-specific care. Put heavy moisturizers on dry cheeks and light water gels or niacinamide serums only on your oily forehead and nose T-zone area."
        };
      case 'Sensitive':
        return {
          doctor: "Dr. Kenji Sato, Pediatric & Adult Dermatologist",
          text: "Sensitive skin needs fewer ingredients. Avoid colors, synthetic fragrances, and mixing too many active creams. Look for Centella and Oat complexes to calm irritation."
        };
      default:
        return {
          doctor: "Dr. Fiona Gallagher, Dermatological Researcher",
          text: "Healthy skin requires simple protection and constant cell moisture. Keep routines clean and use sunscreen daily to protect your cells from sun damage."
        };
    }
  };

  // Why routine works explanation
  const getWhyWorksDescription = (type) => {
    switch (type) {
      case 'Dry':
        return "This routine uses a creamy non-foaming wash to keep your oils intact, a heavy hyaluronic moisture essence to draw in water, and lipid barrier creams to lock it in all day.";
      case 'Oily':
        return "This routine uses a foaming cleanser to sweep away excess sebum, niacinamide to regulate oil levels, and BHA (salicylic acid) to deep clean inside pores to prevent active breakouts.";
      case 'Combination':
        return "This routine targets both zones. It uses gentle cleansing to keep cheeks comfortable, salicylic acid to keep your T-zone clear, and light gel moisturizers that hydrate without adding heavy oil.";
      case 'Sensitive':
        return "This routine focuses on rebuilding your skin's shield. It uses soap-free washes and oatmeal/centella extracts to calm redness and repair active barrier damage.";
      default:
        return "This routine focuses on keeping your skin clean, hydrated, and protected from environmental dirt and UV rays.";
    }
  };

  const docEndorsement = getDermatologistQuote(skinType);
  const whyWorksDesc = getWhyWorksDescription(skinType);

  // Dynamic routines suggestions
  const getRoutinesData = (type) => {
    if (type === 'Oily' || type === 'Combination') {
      return {
        morning: [
          { step: "1. Cleanse", name: "Purifying Foaming Cleanser", purpose: "Sweeps away overnight oils and cleanses pores.", direction: "Apply to wet face, massage for 30 seconds, then rinse with cool water." },
          { step: "2. Target", name: "Niacinamide 10% Serum", purpose: "Reduces sebum levels, balances shine, and minimizes pores.", direction: "Apply 2-3 drops onto clean skin, patting gently until dry." },
          { step: "3. Protect", name: "SPF 50+ Sunscreen Gel", purpose: "Lightweight sun protection that won't clog pores.", direction: "Apply generously 15 minutes before going out." }
        ],
        night: [
          { step: "1. Cleanse", name: "Purifying Foaming Cleanser", purpose: "Removes dirt, oil, and daytime pollutants.", direction: "Wash face thoroughly with lukewarm water." },
          { step: "2. Exfoliate", name: "2% Salicylic Acid (BHA)", purpose: "Deep cleans pores, clears blackheads, and reduces breakouts.", direction: "Pour on a cotton pad and sweep across face. Use 3 times a week." },
          { step: "3. Hydrate", name: "Lightweight Gel Moisturizer", purpose: "Moisturizes skin with a shine-free matte finish.", direction: "Smooth a dime-sized amount over face and neck." }
        ]
      };
    } else if (type === 'Dry') {
      return {
        morning: [
          { step: "1. Cleanse", name: "Hydrating Milky Cleanser", purpose: "Cleanses gently without stripping natural skin oils.", direction: "Massage onto damp skin and wash off gently." },
          { step: "2. Hydrate", name: "Snail Mucin 96 Essence", purpose: "Provides deep moisture and repairs dry patches.", direction: "Pat onto damp skin immediately after washing." },
          { step: "3. Protect", name: "Watery Sun Gel SPF 50", purpose: "Protects against UV rays while adding extra moisture.", direction: "Apply all over face as the last step." }
        ],
        night: [
          { step: "1. Cleanse", name: "Hydrating Milky Cleanser", purpose: "Cleanses away daily dirt while leaving moisture intact.", direction: "Massage gently and wash off with lukewarm water." },
          { step: "2. Target", name: "Hyaluronic Acid Serum", purpose: "Binds water to skin cells to plump dry lines.", direction: "Apply to damp face. Follow immediately with cream." },
          { step: "3. Nourish", name: "Deep Moisture Recovery Cream", purpose: "Rich barrier cream to lock in overnight moisture.", direction: "Massage a generous layer onto face before bed." }
        ]
      };
    } else if (type === 'Sensitive') {
      return {
        morning: [
          { step: "1. Cleanse", name: "Gentle Soap-Free Cleanser", purpose: "Extremely mild cleansing for easily irritated skin.", direction: "Apply gently, wash off with cool water, and pat dry softly." },
          { step: "2. Soothe", name: "Calm + Restore Oat Serum", purpose: "Instantly calms redness and itching.", direction: "Smooth 2-3 drops gently over face." },
          { step: "3. Protect", name: "Sensitive Skin Mineral SPF 50", purpose: "Physical sunscreen that won't sting or burn skin.", direction: "Apply all over face. Safe for eye area." }
        ],
        night: [
          { step: "1. Cleanse", name: "Gentle Soap-Free Cleanser", purpose: "Safely cleanses off dirt without causing irritation.", direction: "Wash gently with cool water." },
          { step: "2. Recover", name: "Centella Soothing Ampoule", purpose: "Calms inflammation and repairs damaged skin barrier.", direction: "Pat gently onto skin until absorbed." },
          { step: "3. Hydrate", name: "Oat Gel Moisturizer", purpose: "Lightweight, calming moisture barrier repair.", direction: "Apply a thin layer all over face." }
        ]
      };
    } else {
      // Normal/General
      return {
        morning: [
          { step: "1. Cleanse", name: "Everyday Gentle Cleanser", purpose: "Cleanses skin softly to keep it fresh.", direction: "Wash face with lukewarm water." },
          { step: "2. Nourish", name: "Niacinamide Balancing Serum", purpose: "Keeps skin bright and skin tone even.", direction: "Apply 2-3 drops and pat gently." },
          { step: "3. Protect", name: "Daily Sun Relief SPF 50", purpose: "Protects cells from sunspots and aging.", direction: "Smooth over face before sunlight exposure." }
        ],
        night: [
          { step: "1. Cleanse", name: "Everyday Gentle Cleanser", purpose: "Cleanses off dirt accumulated during the day.", direction: "Wash face thoroughly." },
          { step: "2. Nourish", name: "Daily Essential Moisturizer", purpose: "Keeps skin smooth and hydrated overnight.", direction: "Apply all over face." }
        ]
      };
    }
  };

  const routineData = getRoutinesData(skinType);

  return (
    <div className="recommendations-container pb-nav fade-in">
      <div className="rec-header pad-screen slide-up">
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">{t('recTitle')}</h2>
        <p>{t('recSubtitle')}</p>
      </div>

      {/* HIPAA / Data Security banner */}
      <div className="privacy-badge-banner slide-up">
        <Shield size={16} color="var(--success)" />
        <span>Privacy Secured: All skin scans and questionnaire answers are saved locally on this device. We do not sell your personal health data.</span>
      </div>

      <div className="pad-screen stack-y spacing-lg">
        
        {/* Trust Seals and Badges */}
        <section className="glass-panel trust-seals-card card-3d slide-up">
          <h3 className="section-title text-center" style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            {t('trustSealTitle')}
          </h3>
          <div className="seals-grid">
            <div className="seal-item">
              <Award size={28} className="seal-icon" />
              <span>{t('trustSealApproved')}</span>
            </div>
            <div className="seal-item">
              <Heart size={28} className="seal-icon" />
              <span>{t('trustSealCruelty')}</span>
            </div>
            <div className="seal-item">
              <Shield size={28} className="seal-icon" />
              <span>{t('trustSealSecure')}</span>
            </div>
            <div className="seal-item">
              <CheckCircle size={28} className="seal-icon" />
              <span>{t('trustSealClean')}</span>
            </div>
          </div>
        </section>

        {/* Dermatologist Endorsement */}
        <section className="glass-panel doctor-endorsement-card card-3d slide-up">
          <div className="doctor-header">
            <div className="doctor-avatar">👨‍⚕️</div>
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{docEndorsement.doctor}</h4>
              <span className="clinical-badge">{t('dermatologistQuote')}</span>
            </div>
          </div>
          <p className="doctor-quote">"{docEndorsement.text}"</p>
        </section>

        {/* Why it works section */}
        <section className="glass-panel card-3d slide-up" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent)" />
            {t('whyWorks')}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            {whyWorksDesc}
          </p>
        </section>

        {/* Custom Morning Routine */}
        <section className="dashboard-section stack-y slide-up">
          <div className="section-header">
            <h3>☀️ {t('morningRoutine')}</h3>
            <span className="progress-text">{userData.skinType} Skin</span>
          </div>

          <div className="steps-list stack-y">
            {routineData.morning.map((item, idx) => (
              <div key={idx} className="glass-panel step-detail-card card-3d">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 750, color: 'var(--accent)', fontSize: '0.9rem' }}>{item.step}</span>
                  <span className="env-badge" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>{item.name}</span>
                </div>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.purpose}</p>
                <div className="directions-box">
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('routineDirections')}:</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{item.direction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Night Routine */}
        <section className="dashboard-section stack-y slide-up">
          <div className="section-header">
            <h3>🌙 {t('nightRoutine')}</h3>
            <span className="progress-text">{userData.skinType} Skin</span>
          </div>

          <div className="steps-list stack-y">
            {routineData.night.map((item, idx) => (
              <div key={idx} className="glass-panel step-detail-card card-3d">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 750, color: '#2f80ed', fontSize: '0.9rem' }}>{item.step}</span>
                  <span className="env-badge" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>{item.name}</span>
                </div>
                <p style={{ margin: '4px 0', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.purpose}</p>
                <div className="directions-box">
                  <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t('routineDirections')}:</span>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>{item.direction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety & Clash Warnings Guidelines */}
        <section className="glass-panel safety-rules-card card-3d slide-up" style={{ borderColor: 'var(--warning)', background: 'linear-gradient(180deg, var(--bg-secondary) 80%, rgba(242,201,76,0.08) 100%)' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--warning)" />
            {t('safetyRules')}
          </h3>
          <ul className="safety-rules-list">
            <li>
              <strong>Sun Protection:</strong> {t('safetyRule1')}
            </li>
            <li>
              <strong>Active Layering:</strong> {t('safetyRule2')}
            </li>
            <li>
              <strong>Exfoliation Pace:</strong> {t('safetyRule3')}
            </li>
          </ul>
        </section>

        {/* Disclaimer Footer */}
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Info size={12} />
            <strong>Clinical Disclaimer</strong>
          </div>
          <p style={{ margin: 0, lineHeight: 1.4 }}>
            Cuits Care recommendation algorithms are designed as guidelines for cosmetic maintenance. In case of active medical skin conditions, severe cystic acne, or extreme eczema, please consult a board-certified doctor directly.
          </p>
        </div>
      </div>
    </div>
  );
}
