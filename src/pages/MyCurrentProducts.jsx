import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Save, Plus, Trash2, Star } from 'lucide-react';

/* ── Normalize product: ensure rating + note exist ── */
function normalize(p) {
  return { id: p.id, name: p.name, rating: p.rating ?? 0, note: p.note ?? '' };
}

/* ── Star rating row ── */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === value ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer', lineHeight: 1 }}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            size={20}
            fill={(hovered || value) >= n ? 'var(--accent)' : 'none'}
            color={(hovered || value) >= n ? 'var(--accent)' : 'var(--glass-border)'}
            style={{ transition: 'color 0.15s, fill 0.15s' }}
          />
        </button>
      ))}
      {value > 0 && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '4px' }}>
          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

export default function MyCurrentProducts() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const [products, setProducts] = useState(
    (userData.currentProducts || []).map(normalize)
  );
  const [newProduct, setNewProduct] = useState('');

  /* ── helpers ── */
  const addProduct = (e) => {
    e.preventDefault();
    if (!newProduct.trim()) return;
    setProducts(prev => [...prev, normalize({ id: Date.now(), name: newProduct.trim() })]);
    setNewProduct('');
  };

  const removeProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));

  const updateField = (id, field, val) =>
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));

  const handleSave = () => {
    updateUserData({ currentProducts: products });
    navigate(-1);
  };

  const topRated = products.filter(p => p.rating >= 4);
  const sorted = [...products].sort((a, b) => b.rating - a.rating);

  return (
    <div className="pad-screen fade-in pb-nav" style={{ paddingTop: '40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Header */}
      <div className="login-header" style={{ marginBottom: '28px' }}>
        <button
          className="icon-btn"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2>Current Products</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rate your products & track what works</p>
      </div>

      {/* Add product */}
      <form onSubmit={addProduct} style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        <input
          type="text"
          className="input-field"
          placeholder="E.g., CeraVe Hydrating Cleanser"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          style={{ padding: '12px 16px' }}
        />
        <button
          type="submit"
          className="glass-panel"
          style={{ width: '52px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)', background: 'var(--accent)', color: '#fff', borderRadius: '16px', cursor: 'pointer' }}
        >
          <Plus size={24} />
        </button>
      </form>

      {/* ── Top Rated section ── */}
      {topRated.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            🏆 <span className="text-gradient">Top Rated</span>
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {topRated.map(p => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 14px', borderRadius: '20px',
                  background: 'var(--accent-light)',
                  border: '1px solid var(--accent)',
                  fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)',
                }}
              >
                🏆 {p.name}
                <span style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: p.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="var(--accent)" color="var(--accent)" />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Product list ── */}
      <div className="stack-y" style={{ gap: '14px' }}>
        {sorted.map(prod => (
          <div
            key={prod.id}
            className="glass-panel hover-lift"
            style={{ padding: '18px', borderRadius: '18px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid var(--glass-border)', boxShadow: 'var(--card-shadow)', transition: 'var(--transition)' }}
          >
            {/* Name row + delete */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <p style={{ margin: 0, fontWeight: 650, fontSize: '0.95rem', lineHeight: 1.3, flex: 1 }}>{prod.name}</p>
              <button
                onClick={() => removeProduct(prod.id)}
                style={{ background: 'rgba(var(--danger-rgb, 220,50,50),0.08)', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '6px', borderRadius: '10px', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,50,50,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,50,50,0.08)'}
                aria-label="Delete product"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Star rating */}
            <StarRating value={prod.rating} onChange={(val) => updateField(prod.id, 'rating', val)} />

            {/* Note input */}
            <input
              type="text"
              className="input-field"
              placeholder="Add a note... e.g. Helped with acne in 2 weeks"
              value={prod.note}
              onChange={(e) => updateField(prod.id, 'note', e.target.value)}
              style={{ padding: '10px 14px', fontSize: '0.83rem', borderRadius: '12px', background: 'var(--glass-bg)' }}
            />
          </div>
        ))}

        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🧴</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No products added yet.<br />Add one above to start tracking!</p>
          </div>
        )}
      </div>

      {/* Save */}
      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
        <button className="btn-primary hover-lift" onClick={handleSave}>
          <Save size={20} style={{ marginRight: '8px' }} /> Save Products
        </button>
      </div>
    </div>
  );
}
