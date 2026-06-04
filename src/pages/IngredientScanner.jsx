import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, HelpCircle, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './IngredientScanner.css';

const DEFAULT_INGREDIENTS = ["Retinol", "Vitamin C", "Salicylic Acid", "Hyaluronic Acid", "Niacinamide", "AHA", "Centella Asiatica"];

const SYNERGY_DATABASE = {
  "Retinol": {
    "Hyaluronic Acid": { score: 98, status: "Synergy", color: "#678b66", desc: "Excellent combination. Hyaluronic acid deeply hydrates and mitigates the dryness and flakiness often caused by Retinol." },
    "Niacinamide": { score: 95, status: "Synergy", color: "#678b66", desc: "Highly synergistic. Niacinamide stabilizes the skin barrier and reduces redness, allowing Retinol to work even more effectively." },
    "Centella Asiatica": { score: 92, status: "Synergy", color: "#678b66", desc: "Soothing synergy. Centella calms irritation, supports tissue repair, and cushions Retinol's retinization phase." },
    "Vitamin C": { score: 40, status: "Caution", color: "#f2c94c", desc: "Use with caution. Both are highly active and operate at different pH levels. We recommend using Vitamin C in the morning and Retinol at night." },
    "Salicylic Acid": { score: 15, status: "Clash", color: "#cf6679", desc: "High irritation risk! Combining Retinol with Salicylic Acid (BHA) strips the skin barrier, leading to redness, flaking, and severe sensitivity." },
    "AHA": { score: 10, status: "Clash", color: "#cf6679", desc: "DANGER! Both are highly peeling exfoliators. Combining them will over-exfoliate your skin, damaging your lipid barrier." }
  },
  "Vitamin C": {
    "Niacinamide": { score: 75, status: "Caution", color: "#f2c94c", desc: "Safe with caution. In pure formulas, they can occasionally cancel each other out or cause flushing. Space them out by 10 minutes." },
    "Hyaluronic Acid": { score: 96, status: "Synergy", color: "#678b66", desc: "Hydrating and brightening synergy. Hyaluronic acid draws moisture into the skin, while Vitamin C works to brighten and repair." },
    "Centella Asiatica": { score: 90, status: "Synergy", color: "#678b66", desc: "Excellent protection. Vitamin C provides antioxidants, while Centella calms skin and strengthens the vascular barrier." },
    "Salicylic Acid": { score: 50, status: "Caution", color: "#f2c94c", desc: "Use with caution. Can cause dryness if used together. Best to separate them (BHA at night, Vitamin C in morning)." },
    "AHA": { score: 45, status: "Caution", color: "#f2c94c", desc: "Exfoliation caution. Can trigger mild irritation due to highly acidic pH. Apply AHA at night and Vitamin C in the morning." }
  },
  "Salicylic Acid": {
    "Hyaluronic Acid": { score: 94, status: "Synergy", color: "#678b66", desc: "Perfect balancing act. BHA deep cleanses pores, while Hyaluronic Acid ensures the skin remains hydrated and plump." },
    "Niacinamide": { score: 88, status: "Synergy", color: "#678b66", desc: "Great oil-control duo. Niacinamide strengthens skin barriers and minimizes pore appearance, while Salicylic Acid clears blackheads." },
    "Centella Asiatica": { score: 92, status: "Synergy", color: "#678b66", desc: "Calming acne relief. Salicylic Acid combats blemishes, while Centella calms swelling and active redness." },
    "AHA": { score: 55, status: "Caution", color: "#f2c94c", desc: "Exfoliating caution. Combining AHA and BHA is powerful for texturized skin, but can over-dry. Limit to 2-3 times a week." }
  },
  "Hyaluronic Acid": {
    "Niacinamide": { score: 97, status: "Synergy", color: "#678b66", desc: "Ultimate moisture barrier duo. Niacinamide boosts ceramide production, while Hyaluronic Acid binds water to cells." },
    "Centella Asiatica": { score: 95, status: "Synergy", color: "#678b66", desc: "Highly soothing. Rapidly repairs a compromised skin barrier and provides intense, deep hydration." },
    "AHA": { score: 94, status: "Synergy", color: "#678b66", desc: "Perfect post-peel hydration. AHA exfoliates dead cells, allowing Hyaluronic Acid to penetrate deeper." }
  },
  "Niacinamide": {
    "Centella Asiatica": { score: 96, status: "Synergy", color: "#678b66", desc: "Redness eradication. Both are supreme anti-inflammatory actives. Exceptional for sensitive, flushed, or rosacea-prone skin." },
    "AHA": { score: 80, status: "Synergy", color: "#678b66", desc: "Brightening combination. AHA refines skin texture, while Niacinamide targets hyperpigmentation and strengthens the barrier." }
  },
  "AHA": {
    "Centella Asiatica": { score: 92, status: "Synergy", color: "#678b66", desc: "Soothing repair. Centella calms skin cells immediately after AHA chemical exfoliation." }
  }
};

export default function IngredientScanner() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [ingA, setIngA] = useState("");
  const [ingB, setIngB] = useState("");

  const [customIngredients, setCustomIngredients] = useState(() => {
    const saved = localStorage.getItem('cuitsCare_custom_ingredients');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSynergy, setNewSynergy] = useState("");
  const [newClash, setNewClash] = useState("");

  const ingredientsList = [...DEFAULT_INGREDIENTS, ...customIngredients.map(ci => ci.name)];

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newDesc.trim()) return;

    // Check duplicate
    if (ingredientsList.includes(newName.trim())) {
      alert("Ingredient name already exists!");
      return;
    }

    const newIng = {
      id: Date.now(),
      name: newName.trim(),
      desc: newDesc.trim(),
      synergyWith: newSynergy,
      clashWith: newClash
    };

    const updated = [...customIngredients, newIng];
    setCustomIngredients(updated);
    localStorage.setItem('cuitsCare_custom_ingredients', JSON.stringify(updated));

    // Reset fields
    setNewName("");
    setNewDesc("");
    setNewSynergy("");
    setNewClash("");
  };

  const handleDeleteIngredient = (id, name) => {
    const updated = customIngredients.filter(c => c.id !== id);
    setCustomIngredients(updated);
    localStorage.setItem('cuitsCare_custom_ingredients', JSON.stringify(updated));

    if (ingA === name) setIngA("");
    if (ingB === name) setIngB("");
  };

  const getCompatibility = (a, b) => {
    if (!a || !b) return null;
    if (a === b) return { score: 100, status: "Identical", color: "#678b66", desc: "Combining identical ingredients is fully compatible, but using redundant formulas does not add extra efficacy." };
    
    // Check if either is custom
    const customA = customIngredients.find(c => c.name === a);
    const customB = customIngredients.find(c => c.name === b);
    
    if (customA || customB) {
      const customItem = customA || customB;
      const otherName = customA ? b : a;
      
      if (customItem.synergyWith === otherName) {
        return {
          score: 95,
          status: "Synergy",
          color: "#678b66",
          desc: `Highly Synergistic! ${customItem.name} works wonderfully with ${otherName}. ${customItem.desc}`
        };
      }
      if (customItem.clashWith === otherName) {
        return {
          score: 15,
          status: "Clash",
          color: "#cf6679",
          desc: `Clash warning! Avoid combining ${customItem.name} with ${otherName} as it may cause skin irritation. ${customItem.desc}`
        };
      }
      
      return {
        score: 85,
        status: "Neutral",
        color: "var(--accent)",
        desc: `Generally safe. ${customItem.name} is a gentle ingredient. ${customItem.desc}`
      };
    }

    // Default database check A -> B or B -> A
    const direct = SYNERGY_DATABASE[a]?.[b];
    const reverse = SYNERGY_DATABASE[b]?.[a];
    
    if (direct) return direct;
    if (reverse) return reverse;
    
    // Default neutral compatibility
    return {
      score: 80,
      status: "Neutral",
      color: "var(--accent)",
      desc: "Generally safe. These active ingredients operate comfortably alongside each other. Monitor your skin's reaction as always."
    };
  };

  const result = getCompatibility(ingA, ingB);

  return (
    <div className="pad-screen fade-in scanner-container" style={{ minHeight: '100vh', paddingTop: '40px', display: 'flex', flexDirection: 'column' }}>
      <div className="login-header spacing-md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <button className="icon-btn hover-lift" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-gradient">{t('scannerTitle')}</h2>
          <p>{t('scannerSubtitle')}</p>
        </div>
        <button 
          onClick={() => setIsEditOpen(true)}
          className="icon-btn hover-lift"
          style={{ width: 'auto', padding: '10px 16px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-primary)' }}
        >
          <Edit2 size={14} /> {t('edit')}
        </button>
      </div>

      <div className="stack-y glass-panel card-3d" style={{ padding: '24px', marginBottom: '24px' }}>
        {/* Dropdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>{t('ingredientA')}</label>
            <select className="input-field" value={ingA} onChange={(e) => setIngA(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">{t('selectActive')}</option>
              {ingredientsList.map(i => <option key={i} value={i} disabled={i === ingB}>{i}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>{t('ingredientB')}</label>
            <select className="input-field" value={ingB} onChange={(e) => setIngB(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">{t('selectActive')}</option>
              {ingredientsList.map(i => <option key={i} value={i} disabled={i === ingA}>{i}</option>)}
            </select>
          </div>
        </div>
      </div>

      {result ? (
        <div className="glass-panel card-3d scale-in result-card stack-y" style={{ padding: '24px', border: `2px solid ${result.color}`, background: `linear-gradient(180deg, var(--bg-secondary) 60%, ${result.color}15 100%)` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${result.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: result.color }}>
                {result.status === "Synergy" && <ShieldCheck size={28} />}
                {result.status === "Caution" && <AlertTriangle size={28} />}
                {result.status === "Clash" && <AlertTriangle size={28} />}
                {result.status === "Neutral" && <HelpCircle size={28} />}
                {result.status === "Identical" && <ShieldCheck size={28} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: result.color }}>{result.status} Status</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{ingA} + {ingB}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: result.color }}>{result.score}%</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{t('synergyRating')}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0, color: 'var(--text-primary)' }}>
            {result.desc}
          </p>
        </div>
      ) : (
        <div className="glass-panel card-3d stack-y prompt-card" style={{ padding: '40px 24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-secondary)', gap: '12px' }}>
          <Sparkles size={36} color="var(--accent)" className="pulse-slow" />
          <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>{t('selectToScan')}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{t('selectToScanDesc')}</p>
        </div>
      )}

      {/* Edit Custom Ingredients Database Modal */}
      {isEditOpen && (
        <div className="modal-overlay fade-in" onClick={() => setIsEditOpen(false)}>
          <div className="modal-card scale-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }} className="text-gradient">{t('customDbTitle')}</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddIngredient} className="stack-y" style={{ gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{t('addCustomIng')}</h4>
              
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t('nameLabel')}</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="input-field" 
                  placeholder="E.g., Zinc PCA" 
                  style={{ padding: '10px 14px', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>{t('descLabel')}</label>
                <textarea 
                  value={newDesc} 
                  onChange={(e) => setNewDesc(e.target.value)} 
                  className="input-field" 
                  placeholder="Describe what it does (e.g. helps reduce oil and soothe skin)." 
                  style={{ padding: '10px 14px', fontSize: '0.9rem', minHeight: '60px', fontFamily: 'inherit', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Synergizes With</label>
                  <select 
                    value={newSynergy} 
                    onChange={(e) => setNewSynergy(e.target.value)} 
                    className="input-field" 
                    style={{ padding: '10px', fontSize: '0.85rem' }}
                  >
                    <option value="">None</option>
                    {DEFAULT_INGREDIENTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Clashes With</label>
                  <select 
                    value={newClash} 
                    onChange={(e) => setNewClash(e.target.value)} 
                    className="input-field" 
                    style={{ padding: '10px', fontSize: '0.85rem' }}
                  >
                    <option value="">None</option>
                    {DEFAULT_INGREDIENTS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '12px', minHeight: 'unset', fontSize: '0.9rem', fontWeight: 600 }}>
                {t('saveIng')}
              </button>
            </form>

            <div className="stack-y" style={{ gap: '10px' }}>
              <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{t('customIngList')}</h4>
              
              <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {customIngredients.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--glass-bg)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', display: 'block' }}>{item.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.desc}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteIngredient(item.id, item.name)} 
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {customIngredients.length === 0 && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px 0' }}>{t('noHelp')} (No custom items)</p>
                )}
              </div>
            </div>

            <button 
              className="btn-secondary" 
              onClick={() => setIsEditOpen(false)} 
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', marginTop: '20px' }}
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
