import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Sparkles, Palette } from 'lucide-react';
import { useUser } from '../context/UserContext';
import BottomNav from '../components/BottomNav';

// Color palettes per skin tone / undertone
const PALETTES = {
  'Warm Autumn': {
    label: 'Warm Autumn 🍂',
    desc: 'Rich, earthy, warm-toned colors that complement golden undertones beautifully.',
    bestColors: ['#C17F5C','#A0522D','#D2691E','#B8860B','#8B4513','#CD853F'],
    bestLabels: ['Terracotta','Sienna','Chocolate','Dark Gold','Saddle Br.','Peru'],
    avoidColors: ['#00CED1','#E0E8F0','#C0D8FF','#B0FFB0','#FFFACD'],
    avoidLabels: ['Teal','Ice Blue','Periwinkle','Mint','Lemon'],
    lipShades: ['#B05050','#C47060','#8B3A3A'],
    eyeColors: ['#7B5E3D','#9C7A50','#5C3D1E'],
    season: 'Autumn'
  },
  'Warm Spring': {
    label: 'Warm Spring 🌸',
    desc: 'Fresh, bright, warm colors that bring out a natural peach glow.',
    bestColors: ['#FFB347','#FF8C69','#FFA07A','#FF7F50','#FFDAB9','#F4A460'],
    bestLabels: ['Peach','Salmon','Light Salmon','Coral','Peach Puff','Sandy Br.'],
    avoidColors: ['#000080','#4B0082','#2F4F4F','#808080','#C0C0C0'],
    avoidLabels: ['Navy','Indigo','Dark Teal','Grey','Silver'],
    lipShades: ['#FF9080','#E87060','#FFB6A0'],
    eyeColors: ['#A07050','#C09060','#806040'],
    season: 'Spring'
  },
  'Cool Summer': {
    label: 'Cool Summer 🌊',
    desc: 'Soft, muted, cool-toned colors that enhance rosy and pink undertones.',
    bestColors: ['#B0C4DE','#9BB7D4','#6495ED','#87CEEB','#DDA0DD','#C8A2C8'],
    bestLabels: ['Steel Blue','Cornflower','Periwinkle','Sky Blue','Plum','Lilac'],
    avoidColors: ['#FF8C00','#FF6347','#8B4513','#DAA520','#FF7F50'],
    avoidLabels: ['Orange','Tomato','Brown','Goldenrod','Coral'],
    lipShades: ['#C06080','#9B4D6D','#B08090'],
    eyeColors: ['#607090','#8090A0','#5070A0'],
    season: 'Summer'
  },
  'Cool Winter': {
    label: 'Cool Winter ❄️',
    desc: 'Bold, icy, high-contrast colors that complement cool blue and pink undertones.',
    bestColors: ['#1C1C8C','#8B0000','#000000','#FFFFFF','#800080','#008080'],
    bestLabels: ['Royal Blue','Dark Red','Black','White','Purple','Teal'],
    avoidColors: ['#F4A460','#D2B48C','#DEB887','#CD853F','#BC8F5F'],
    avoidLabels: ['Sandy','Tan','Burlywood','Peru','Rosy Br.'],
    lipShades: ['#8B0000','#C00060','#600050'],
    eyeColors: ['#303060','#602060','#204040'],
    season: 'Winter'
  },
  'Neutral': {
    label: 'Neutral Balance ⚖️',
    desc: 'Versatile, balanced colors that work with both warm and cool undertones.',
    bestColors: ['#8B8682','#C4B9A8','#A8957A','#6B8E8E','#9090B0','#B8A090'],
    bestLabels: ['Greige','Warm Beige','Caramel','Teal Grey','Slate','Blush'],
    avoidColors: [],
    avoidLabels: [],
    lipShades: ['#B07070','#907060','#C08080'],
    eyeColors: ['#806050','#708090','#709070'],
    season: 'All Seasons'
  }
};

function getDefaultPalette(userData) {
  if (userData?.seasonalPalette && PALETTES[userData.seasonalPalette]) return userData.seasonalPalette;
  const st = userData?.skinType;
  if (st === 'Oily' || st === 'Combination') return 'Cool Winter';
  if (st === 'Dry') return 'Warm Autumn';
  if (st === 'Sensitive') return 'Cool Summer';
  if (st === 'Normal') return 'Warm Spring';
  return 'Neutral';
}

export default function ColorPalette() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const cardRef = useRef(null);

  const palKey = getDefaultPalette(userData);
  const pal = PALETTES[palKey];
  const undertone = userData?.undertone || (palKey.includes('Warm') ? 'Warm' : palKey.includes('Cool') ? 'Cool' : 'Neutral');
  const skinType = userData?.skinType || 'Unknown';
  const score = userData?.score || 0;

  const handleDownload = () => {
    // Use native share if available, otherwise copy text to clipboard
    handleShare();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Skin Color Palette — Cuits Care',
        text: `✨ My seasonal skin palette is ${pal.label}!\nUndertone: ${undertone}\nSkin Type: ${skinType}\nBest colors: ${pal.bestLabels.slice(0, 3).join(', ')}\n\nDiscover yours at Cuits Care! 💄`
      });
    } else {
      const text = `✨ My seasonal skin palette: ${pal.label}\nUndertone: ${undertone} | Skin: ${skinType}`;
      navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard! 📋'));
    }
  };

  return (
    <div className="pb-nav fade-in" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Header */}
      <div style={{ padding: '40px 20px 16px', background: 'var(--bg-secondary)' }}>
        <button className="icon-btn hover-lift" onClick={() => navigate(-1)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '12px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-gradient" style={{ margin: '0 0 4px', fontSize: '1.5rem' }}>
          🎨 My Color Palette
        </h2>
        <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
          Colors that make your skin glow
        </p>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Shareable Card */}
        <div ref={cardRef} style={{
          background: `linear-gradient(135deg, ${pal.bestColors[0]}22, var(--bg-secondary) 60%, ${pal.bestColors[2]}15)`,
          borderRadius: '24px',
          border: '2px solid var(--glass-border)',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative orbs */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${pal.bestColors[0]}30`, filter: 'blur(30px)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: `${pal.bestColors[2]}25`, filter: 'blur(20px)' }} />

          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', position: 'relative' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `linear-gradient(135deg, ${pal.bestColors[0]}, ${pal.bestColors[2]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
              <Palette size={22} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{pal.label}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                {undertone} Undertone · {skinType} Skin
              </span>
            </div>
            {score > 0 && (
              <div style={{ marginLeft: 'auto', background: 'var(--accent)', borderRadius: '12px', padding: '4px 10px', color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>
                Score: {score}%
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 18px', lineHeight: 1.5 }}>{pal.desc}</p>

          {/* Best color swatches */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 10px', letterSpacing: '0.05em' }}>
              ✅ Your Best Colors
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {pal.bestColors.map((color, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: color, boxShadow: `0 4px 12px ${color}60`, border: '2px solid rgba(255,255,255,0.3)' }} />
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center', maxWidth: 44 }}>{pal.bestLabels[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lip shades */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 10px', letterSpacing: '0.05em' }}>
              💄 Your Lip Shades
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pal.lipShades.map((color, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: color, boxShadow: `0 3px 8px ${color}50`, border: '2px solid rgba(255,255,255,0.3)' }} />
              ))}
            </div>
          </div>

          {/* Eye colors */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: '0 0 10px', letterSpacing: '0.05em' }}>
              👁️ Eye Makeup Colors
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pal.eyeColors.map((color, i) => (
                <div key={i} style={{ width: 36, height: 20, borderRadius: '8px', background: color, border: '1px solid rgba(255,255,255,0.2)' }} />
              ))}
            </div>
          </div>

          {/* Avoid colors */}
          {pal.avoidColors.length > 0 && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.78rem', color: '#cf6679', textTransform: 'uppercase', margin: '0 0 10px', letterSpacing: '0.05em' }}>
                ❌ Colors to Avoid
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {pal.avoidColors.map((color, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', background: color, border: '2px dashed rgba(207,102,121,0.5)', opacity: 0.7, position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cf6679', fontWeight: 900, fontSize: '1rem' }}>✕</div>
                    </div>
                    <span style={{ fontSize: '0.6rem', color: '#cf6679', fontWeight: 600, textAlign: 'center', maxWidth: 36 }}>{pal.avoidLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cuits Care watermark */}
          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--accent)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Generated by Cuits Care · Your AI Skin Companion</span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" onClick={handleShare}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', minHeight: 'unset', fontSize: '0.95rem' }}>
            <Share2 size={18} /> Share Card
          </button>
          <button className="btn-secondary" onClick={handleDownload}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '14px', fontSize: '0.95rem', cursor: 'pointer' }}>
            <Download size={18} /> Download
          </button>
        </div>

        {/* Season info card */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent)" /> About {pal.season} Season
          </h4>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {pal.desc} Seasonal color analysis matches your natural skin tone, undertone, and hair color to identify which colors make you look most radiant and alive.
          </p>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '4px 12px', borderRadius: '12px', fontWeight: 700 }}>
              {undertone} Undertone
            </span>
            <span style={{ fontSize: '0.75rem', background: 'var(--glass-bg)', color: 'var(--text-primary)', padding: '4px 12px', borderRadius: '12px', fontWeight: 600, border: '1px solid var(--glass-border)' }}>
              {skinType} Skin
            </span>
          </div>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
