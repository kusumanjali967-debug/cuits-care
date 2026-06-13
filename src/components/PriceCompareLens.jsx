import { useState } from 'react';
import { X, ExternalLink, Search, ShoppingBag } from 'lucide-react';

/* Price comparison sites for India */
const STORES = [
  {
    name: 'Amazon India',
    emoji: '📦',
    color: '#FF9900',
    bg: '#FFF3E0',
    url: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  },
  {
    name: 'Nykaa',
    emoji: '🛍️',
    color: '#f06292',
    bg: '#FCE4EC',
    url: (q) => `https://www.nykaa.com/search/result/?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Flipkart',
    emoji: '🏪',
    color: '#2874F0',
    bg: '#E3F2FD',
    url: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Purplle',
    emoji: '💜',
    color: '#9c27b0',
    bg: '#F3E5F5',
    url: (q) => `https://www.purplle.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    name: 'Myntra',
    emoji: '👗',
    color: '#ff3f6c',
    bg: '#FFEBEE',
    url: (q) => `https://www.myntra.com/${encodeURIComponent(q.replace(/ /g, '-'))}`,
  },
  {
    name: 'Meesho',
    emoji: '🎀',
    color: '#9C27B0',
    bg: '#EDE7F6',
    url: (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
  },
];

export default function PriceCompareLens({ productName, onClose }) {
  const [search, setSearch] = useState(productName || '');

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="scale-in"
        style={{
          width: '100%', maxWidth: '500px',
          background: 'var(--bg-secondary)',
          borderRadius: '28px 28px 0 0',
          padding: '20px 20px 40px',
          boxShadow: '0 -12px 50px rgba(0,0,0,0.25)',
          border: '1px solid var(--glass-border)',
          maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--glass-border)', margin: '0 auto 16px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }} className="text-gradient">
              🔍 Compare Prices
            </h3>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Check live prices across 6 stores
            </p>
          </div>
          <button onClick={onClose}
            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            className="input-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type product name..."
            style={{ paddingLeft: 42, paddingTop: 13, paddingBottom: 13, fontSize: '0.95rem' }}
          />
        </div>

        {/* Store cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {STORES.map(store => (
            <a
              key={store.name}
              href={store.url(search || productName || 'skincare')}
              target="_blank"
              rel="noopener noreferrer"
              className="hover-lift"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '18px 12px',
                borderRadius: 18,
                background: store.bg,
                border: `1px solid ${store.color}30`,
                textDecoration: 'none',
                color: 'var(--text-primary)',
                boxShadow: `0 4px 16px ${store.color}18`,
                transition: 'all 0.25s ease',
                position: 'relative', overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
                e.currentTarget.style.boxShadow = `0 12px 28px ${store.color}35`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = `0 4px 16px ${store.color}18`;
              }}
            >
              {/* Shimmer */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)`,
                backgroundSize: '200% 100%',
                animation: 'shimmer 2.5s infinite',
                borderRadius: 'inherit',
              }} />
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>{store.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: store.color, textAlign: 'center' }}>{store.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: store.color, fontWeight: 600 }}>
                <ShoppingBag size={12} /> Shop Now
                <ExternalLink size={10} />
              </div>
            </a>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 16 }}>
          ⚡ Opens real-time store search · Prices may vary
        </p>
      </div>
    </div>
  );
}
