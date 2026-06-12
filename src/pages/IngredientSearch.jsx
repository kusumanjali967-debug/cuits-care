import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './IngredientSearch.css';

const INGREDIENTS = [
  { name: 'Retinol', emoji: '🌙', category: 'Anti-aging', whatItIs: 'A Vitamin A derivative that boosts cell turnover and collagen production.', benefits: ['Reduces fine lines & wrinkles', 'Fades dark spots', 'Unclogs pores', 'Boosts collagen'], goodFor: ['Oily', 'Combination', 'Normal'], avoidIf: ['Sensitive (start slow)', 'During pregnancy'], pairsWith: ['Hyaluronic Acid', 'Niacinamide', 'Ceramides'], avoidWith: ['AHA', 'BHA', 'Vitamin C (same layer)'], howToUse: 'Apply a pea-sized amount at night. Start 2x/week. Always follow with SPF next morning.', safetyRating: 'Use Carefully' },
  { name: 'Niacinamide', emoji: '✨', category: 'Soothing', whatItIs: 'Vitamin B3 — a multi-tasking ingredient that targets pores, oil, and pigmentation.', benefits: ['Minimizes pores', 'Controls excess oil', 'Fades dark spots', 'Strengthens skin barrier'], goodFor: ['All skin types'], avoidIf: [], pairsWith: ['Hyaluronic Acid', 'Centella Asiatica', 'Salicylic Acid'], avoidWith: ['High-dose Vitamin C (space them out)'], howToUse: 'Use morning and/or night. Apply after cleansing, before moisturizer.', safetyRating: 'Very Safe' },
  { name: 'Vitamin C', emoji: '☀️', category: 'Antioxidant', whatItIs: 'A brightening antioxidant that protects skin from UV damage and fades pigmentation.', benefits: ['Brightens dull skin', 'Fades dark spots', 'Boosts collagen', 'Protects from pollution'], goodFor: ['Normal', 'Dry', 'Combination'], avoidIf: ['Very Sensitive (may sting)'], pairsWith: ['Hyaluronic Acid', 'SPF', 'Ferulic Acid'], avoidWith: ['Retinol (same layer)', 'Niacinamide (high dose)'], howToUse: 'Apply in the morning after cleansing. Always follow with SPF.', safetyRating: 'Safe' },
  { name: 'Hyaluronic Acid', emoji: '💧', category: 'Humectant', whatItIs: 'A powerful moisture-binding molecule that can hold 1000x its weight in water.', benefits: ['Intense hydration', 'Plumps and smooths skin', 'Reduces fine lines', 'Suits all skin types'], goodFor: ['All skin types'], avoidIf: [], pairsWith: ['Everything', 'Vitamin C', 'Retinol', 'Niacinamide'], avoidWith: [], howToUse: 'Apply to damp skin right after washing face, then seal with moisturizer.', safetyRating: 'Very Safe' },
  { name: 'Salicylic Acid', emoji: '🧴', category: 'Exfoliant', whatItIs: 'A BHA (Beta Hydroxy Acid) that dissolves inside pores to clear blackheads and acne.', benefits: ['Unclogs pores', 'Clears blackheads', 'Reduces acne', 'Controls oil'], goodFor: ['Oily', 'Combination', 'Acne-prone'], avoidIf: ['Very Dry skin', 'Sensitive (dilute first)'], pairsWith: ['Hyaluronic Acid', 'Niacinamide', 'Centella'], avoidWith: ['Retinol (same night)', 'Strong AHA'], howToUse: 'Use 2-3x/week at night. Start with a low concentration (0.5-1%).', safetyRating: 'Use Carefully' },
  { name: 'AHA (Glycolic/Lactic)', emoji: '🔬', category: 'Exfoliant', whatItIs: 'Alpha Hydroxy Acids that exfoliate the skin surface for brighter, smoother skin.', benefits: ['Exfoliates dead skin cells', 'Brightens complexion', 'Fades pigmentation', 'Smooths texture'], goodFor: ['Dry', 'Normal', 'Combination'], avoidIf: ['Sensitive skin', 'During sun exposure'], pairsWith: ['Hyaluronic Acid', 'SPF'], avoidWith: ['Retinol (same night)', 'Vitamin C (same layer)'], howToUse: 'Apply 2-3x/week at night. ALWAYS use SPF next morning.', safetyRating: 'Use Carefully' },
  { name: 'Centella Asiatica', emoji: '🌿', category: 'Soothing', whatItIs: 'A healing herb (CICA) that repairs the skin barrier and calms inflammation.', benefits: ['Calms redness & irritation', 'Repairs skin barrier', 'Reduces acne scars', 'Hydrates skin'], goodFor: ['Sensitive', 'Acne-prone', 'All types'], avoidIf: [], pairsWith: ['Niacinamide', 'Hyaluronic Acid', 'Ceramides'], avoidWith: [], howToUse: 'Use morning and/or night. Ideal for post-procedure or irritated skin.', safetyRating: 'Very Safe' },
  { name: 'Benzoyl Peroxide', emoji: '⚗️', category: 'Antimicrobial', whatItIs: 'An antibacterial that kills acne-causing bacteria and reduces active breakouts.', benefits: ['Kills acne bacteria', 'Reduces active pimples', 'Prevents new breakouts', 'Decreases redness'], goodFor: ['Oily', 'Acne-prone'], avoidIf: ['Dry skin', 'Sensitive skin', 'Using Retinol same time'], pairsWith: ['Hyaluronic Acid', 'Niacinamide'], avoidWith: ['Retinol', 'AHA', 'BHA (same application)'], howToUse: 'Apply a thin layer to acne spots. Start with 2.5% concentration.', safetyRating: 'Use Carefully' },
  { name: 'Ceramides', emoji: '🛡️', category: 'Emollient', whatItIs: 'Lipid molecules that are the natural building blocks of your skin barrier.', benefits: ['Repairs damaged skin barrier', 'Prevents moisture loss', 'Soothes dry skin', 'Reduces sensitivity'], goodFor: ['Dry', 'Sensitive', 'All types'], avoidIf: [], pairsWith: ['Hyaluronic Acid', 'Niacinamide', 'Peptides'], avoidWith: [], howToUse: 'Apply as moisturizer morning and night after serums. Excellent as the last step.', safetyRating: 'Very Safe' },
  { name: 'Bakuchiol', emoji: '🌸', category: 'Anti-aging', whatItIs: 'A plant-based retinol alternative from the babchi plant — gentler with similar benefits.', benefits: ['Reduces fine lines', 'Improves firmness', 'Fades pigmentation', 'Safe for sensitive skin'], goodFor: ['Sensitive', 'Dry', 'All types', 'Pregnant-friendly'], avoidIf: [], pairsWith: ['Hyaluronic Acid', 'Vitamin C', 'Ceramides'], avoidWith: [], howToUse: 'Use morning or night. Can be used with Vitamin C unlike Retinol!', safetyRating: 'Very Safe' },
  { name: 'Azelaic Acid', emoji: '🌾', category: 'Soothing', whatItIs: 'A naturally occurring acid that reduces redness, pigmentation, and acne simultaneously.', benefits: ['Fades dark spots', 'Reduces redness', 'Treats acne', 'Suitable for rosacea'], goodFor: ['Sensitive', 'Acne-prone', 'All types'], avoidIf: [], pairsWith: ['Niacinamide', 'Hyaluronic Acid', 'SPF'], avoidWith: [], howToUse: 'Apply to clean skin morning and/or night. Excellent for sensitive and acne-prone skin.', safetyRating: 'Very Safe' },
  { name: 'Peptides', emoji: '🧬', category: 'Anti-aging', whatItIs: 'Short chains of amino acids that signal skin to produce more collagen and repair itself.', benefits: ['Boosts collagen production', 'Reduces fine lines', 'Improves skin firmness', 'Hydrates skin'], goodFor: ['All skin types', 'Mature skin'], avoidIf: [], pairsWith: ['Hyaluronic Acid', 'Ceramides', 'Niacinamide'], avoidWith: ['AHA/BHA (can deactivate peptides)'], howToUse: 'Apply after serum, before moisturizer. Use morning and night consistently.', safetyRating: 'Very Safe' },
  { name: 'Squalane', emoji: '💎', category: 'Emollient', whatItIs: 'A lightweight, plant-derived oil that mimics skin\'s natural sebum perfectly.', benefits: ['Deep moisture without greasiness', 'Strengthens skin barrier', 'Anti-inflammatory', 'Suits all skin types'], goodFor: ['All skin types', 'Oily skin (surprisingly)'], avoidIf: [], pairsWith: ['Everything', 'Hyaluronic Acid', 'Retinol'], avoidWith: [], howToUse: 'Apply 2-3 drops after serums as a facial oil, or mix with moisturizer.', safetyRating: 'Very Safe' },
  { name: 'Tea Tree Oil', emoji: '🌲', category: 'Antimicrobial', whatItIs: 'A natural essential oil with powerful antibacterial and antifungal properties.', benefits: ['Fights acne bacteria', 'Reduces spot size', 'Anti-inflammatory', 'Natural antimicrobial'], goodFor: ['Oily', 'Acne-prone'], avoidIf: ['Sensitive skin (dilute!)', 'Dry skin'], pairsWith: ['Hyaluronic Acid (to dilute)'], avoidWith: ['Retinol', 'Vitamin C (can irritate)'], howToUse: 'ALWAYS dilute 1 drop in 9 drops of carrier oil before applying to skin.', safetyRating: 'Use Carefully' },
  { name: 'Aloe Vera', emoji: '🌵', category: 'Soothing', whatItIs: 'A natural plant gel with healing, hydrating, and anti-inflammatory properties.', benefits: ['Soothes sunburn & irritation', 'Hydrates skin', 'Reduces redness', 'Speeds wound healing'], goodFor: ['All skin types', 'Sensitive', 'Sunburned skin'], avoidIf: [], pairsWith: ['Hyaluronic Acid', 'Centella Asiatica'], avoidWith: [], howToUse: 'Apply pure aloe gel to clean skin as a calming layer anytime. Great after sun exposure.', safetyRating: 'Very Safe' },
  { name: 'Zinc Oxide', emoji: '🛡️', category: 'Antioxidant', whatItIs: 'A mineral UV filter used in sunscreens that physically blocks UVA and UVB rays.', benefits: ['Broad spectrum UV protection', 'Anti-inflammatory', 'Gentle on skin', 'Non-comedogenic'], goodFor: ['All skin types', 'Sensitive', 'Children'], avoidIf: [], pairsWith: ['SPF routine', 'Moisturizer'], avoidWith: [], howToUse: 'Apply as sunscreen as the final morning step. Reapply every 2 hours outdoors.', safetyRating: 'Very Safe' },
  { name: 'Glycolic Acid', emoji: '🧪', category: 'Exfoliant', whatItIs: 'The smallest AHA molecule — deeply exfoliates for dramatic brightening and smoothing.', benefits: ['Strong exfoliation', 'Brightens dull skin', 'Fades pigmentation quickly', 'Stimulates collagen'], goodFor: ['Normal', 'Oily', 'Combination'], avoidIf: ['Sensitive skin', 'Beginners (start low%)'], pairsWith: ['Hyaluronic Acid', 'SPF (essential!)'], avoidWith: ['Retinol (same night)', 'Vitamin C'], howToUse: 'Use at night 1-2x/week. Rinse-off or leave-on. Mandatory SPF next morning.', safetyRating: 'Use Carefully' },
  { name: 'Lactic Acid', emoji: '🥛', category: 'Exfoliant', whatItIs: 'A gentler AHA derived from milk that exfoliates and hydrates simultaneously.', benefits: ['Gentle exfoliation', 'Hydrates while exfoliating', 'Brightens skin', 'Great for sensitive skin'], goodFor: ['Dry', 'Sensitive', 'Normal'], avoidIf: ['Very reactive skin (patch test)'], pairsWith: ['Hyaluronic Acid', 'SPF'], avoidWith: ['Retinol (same night)'], howToUse: 'A great beginner-friendly AHA. Use 2-3x/week at night. Always use SPF after.', safetyRating: 'Safe' },
  { name: 'Kojic Acid', emoji: '🌟', category: 'Antioxidant', whatItIs: 'A natural skin-brightening ingredient derived from fungi that inhibits melanin production.', benefits: ['Fades dark spots', 'Brightens skin tone', 'Reduces hyperpigmentation', 'Anti-fungal'], goodFor: ['Normal', 'Combination', 'Oily'], avoidIf: ['Sensitive skin (may irritate)', 'Very dry skin'], pairsWith: ['Niacinamide', 'Vitamin C', 'SPF'], avoidWith: [], howToUse: 'Apply targeted to dark spots at night. Combine with SPF for best results.', safetyRating: 'Safe' },
  { name: 'Collagen', emoji: '💪', category: 'Anti-aging', whatItIs: 'A structural protein that maintains skin firmness and elasticity.', benefits: ['Improves skin firmness', 'Reduces fine lines', 'Plumps skin', 'Supports skin repair'], goodFor: ['Mature skin', 'All skin types'], avoidIf: [], pairsWith: ['Vitamin C (boosts collagen production)', 'Peptides'], avoidWith: [], howToUse: 'Topical collagen hydrates but can\'t penetrate deeply. Best benefits from Vitamin C which stimulates natural collagen.', safetyRating: 'Very Safe' },
];

const CATEGORIES = ['All', 'Exfoliant', 'Humectant', 'Antioxidant', 'Anti-aging', 'Soothing', 'Antimicrobial', 'Emollient'];

const SKIN_TYPE_PICKS = {
  Oily: ['Niacinamide', 'Salicylic Acid', 'Azelaic Acid'],
  Dry: ['Hyaluronic Acid', 'Ceramides', 'Squalane'],
  Combination: ['Niacinamide', 'Hyaluronic Acid', 'Glycolic Acid'],
  Sensitive: ['Centella Asiatica', 'Aloe Vera', 'Bakuchiol'],
  Normal: ['Vitamin C', 'Niacinamide', 'Retinol'],
};

const safetyColors = { 'Very Safe': '#4caf50', 'Safe': '#ff9800', 'Use Carefully': '#f44336' };

export default function IngredientSearch() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const skinType = userData?.skinType;
  const picksForType = SKIN_TYPE_PICKS[skinType] || [];
  const pickedIngredients = INGREDIENTS.filter(i => picksForType.includes(i.name));

  const filtered = INGREDIENTS.filter(ing => {
    const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase()) ||
      ing.whatItIs.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || ing.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="ing-search-container pb-nav fade-in">
      {/* Header */}
      <div style={{ padding: '40px 20px 16px', background: 'var(--bg-secondary)' }}>
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>🔬 Ingredient Wiki</h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Know what goes on your skin</p>
      </div>

      {/* Search */}
      <div style={{ padding: '0 16px 12px', position: 'sticky', top: 0, background: 'var(--bg-primary)', zIndex: 50, paddingTop: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingLeft: '40px', paddingTop: '12px', paddingBottom: '12px' }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '10px', scrollbarWidth: 'none', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => (
            <button key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '6px 14px', borderRadius: '20px', border: `1.5px solid ${category === cat ? 'var(--accent)' : 'var(--glass-border)'}`,
                background: category === cat ? 'var(--accent-light)' : 'transparent',
                color: category === cat ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
                transition: 'all 0.2s ease', fontFamily: 'inherit'
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Quick Picks for skin type */}
        {pickedIngredients.length > 0 && !search && category === 'All' && (
          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={18} color="var(--accent)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Quick Picks for {skinType} Skin</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {pickedIngredients.map(ing => (
                <button key={ing.name}
                  onClick={() => { setExpanded(expanded === ing.name ? null : ing.name); setSearch(ing.name); }}
                  style={{ padding: '8px 16px', borderRadius: '20px', background: 'var(--accent-gradient)', color: '#fff', border: 'none', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {ing.emoji} {ing.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ingredient list */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem' }}>🔍</div>
            <p style={{ marginTop: '12px' }}>No ingredients found. Try a different search.</p>
          </div>
        )}

        {filtered.map(ing => {
          const isOpen = expanded === ing.name;
          const safeColor = safetyColors[ing.safetyRating];
          return (
            <div key={ing.name} className="glass-panel hover-lift"
              style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: isOpen ? `1.5px solid var(--accent)` : '1px solid var(--glass-border)', transition: 'all 0.3s ease' }}>

              {/* Collapsed header */}
              <button onClick={() => setExpanded(isOpen ? null : ing.name)}
                style={{ width: '100%', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                <span style={{ fontSize: '1.6rem' }}>{ing.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{ing.name}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: safeColor + '20', color: safeColor }}>
                      {ing.safetyRating}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>{ing.category}</span>
                </div>
                {isOpen ? <ChevronUp size={18} color="var(--accent)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="fade-in" style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid var(--glass-border)' }}>
                  <p style={{ margin: '12px 0 0', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{ing.whatItIs}</p>

                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 6px' }}>✅ Benefits</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {ing.benefits.map(b => <span key={b} style={{ fontSize: '0.78rem', background: '#4caf5015', color: '#4caf50', border: '1px solid #4caf5030', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{b}</span>)}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 6px' }}>Good For</p>
                      {ing.goodFor.map(g => <div key={g} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', padding: '2px 0' }}>• {g}</div>)}
                    </div>
                    {ing.avoidIf.length > 0 && (
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#f44336', textTransform: 'uppercase', margin: '0 0 6px' }}>Be Careful If</p>
                        {ing.avoidIf.map(a => <div key={a} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', padding: '2px 0' }}>⚠️ {a}</div>)}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {ing.pairsWith.length > 0 && (
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#4caf50', textTransform: 'uppercase', margin: '0 0 6px' }}>✅ Pairs With</p>
                        {ing.pairsWith.map(p => <div key={p} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', padding: '2px 0' }}>+ {p}</div>)}
                      </div>
                    )}
                    {ing.avoidWith.length > 0 && (
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#f44336', textTransform: 'uppercase', margin: '0 0 6px' }}>❌ Avoid With</p>
                        {ing.avoidWith.map(a => <div key={a} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', padding: '2px 0' }}>✗ {a}</div>)}
                      </div>
                    )}
                  </div>

                  <div style={{ background: 'var(--accent-light)', borderRadius: '12px', padding: '12px 14px' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--accent)', textTransform: 'uppercase', margin: '0 0 4px' }}>📋 How to Use</p>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>{ing.howToUse}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
