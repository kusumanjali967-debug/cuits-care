import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import './IngredientScanner.css';

const INGREDIENTS = ["Retinol", "Vitamin C", "Salicylic Acid", "Hyaluronic Acid", "Niacinamide", "AHA", "Centella Asiatica"];

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
  const [ingA, setIngA] = useState("");
  const [ingB, setIngB] = useState("");

  const getCompatibility = (a, b) => {
    if (!a || !b) return null;
    if (a === b) return { score: 100, status: "Identical", color: "#678b66", desc: "Combining identical ingredients is fully compatible, but using redundant formulas does not add extra efficacy." };
    
    // Check A -> B or B -> A in database
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
      <div className="login-header spacing-md">
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient">Active Scanner</h2>
        <p>Decode active ingredient synergy and safety compatibility</p>
      </div>

      <div className="stack-y glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        {/* Dropdowns */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>First Ingredient (A)</label>
            <select className="input-field" value={ingA} onChange={(e) => setIngA(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select active ingredient...</option>
              {INGREDIENTS.map(i => <option key={i} value={i} disabled={i === ingB}>{i}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px', display: 'block' }}>Second Ingredient (B)</label>
            <select className="input-field" value={ingB} onChange={(e) => setIngB(e.target.value)} style={{ cursor: 'pointer' }}>
              <option value="">Select active ingredient...</option>
              {INGREDIENTS.map(i => <option key={i} value={i} disabled={i === ingA}>{i}</option>)}
            </select>
          </div>
        </div>
      </div>

      {result ? (
        <div className="glass-panel scale-in result-card stack-y" style={{ padding: '24px', border: `2px solid ${result.color}`, background: `linear-gradient(180deg, var(--bg-secondary) 60%, ${result.color}15 100%)` }}>
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
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Synergy Rating</span>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', lineHeight: 1.5, margin: 0, color: 'var(--text-primary)' }}>
            {result.desc}
          </p>
        </div>
      ) : (
        <div className="glass-panel stack-y prompt-card" style={{ padding: '40px 24px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-secondary)', gap: '12px' }}>
          <Sparkles size={36} color="var(--accent)" className="pulse-slow" />
          <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)' }}>Select Ingredients to Scan</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Select two active skincare ingredients from the dropdowns above to check their chemical synergy rating and clash analysis instantly.</p>
        </div>
      )}
    </div>
  );
}
