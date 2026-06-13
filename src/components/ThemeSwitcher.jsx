import { useState } from 'react';
import { useTheme, THEMES } from '../context/ThemeContext';
import { Palette, X } from 'lucide-react';

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating palette button */}
      <button
        onClick={() => setOpen(p => !p)}
        title="Change Theme"
        style={{
          position: 'fixed', top: 14, right: 14, zIndex: 9999,
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--accent-gradient)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px var(--particle-color, rgba(0,0,0,0.15))',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12) rotate(15deg)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
      >
        {open ? <X size={18} color="#fff" /> : <Palette size={18} color="#fff" />}
      </button>

      {/* Theme picker panel */}
      {open && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', top: 62, right: 14, zIndex: 9998,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: 20,
            padding: '14px 12px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            display: 'flex', flexDirection: 'column', gap: 8,
            minWidth: 170,
            backdropFilter: 'blur(16px)',
          }}
        >
          <p style={{ margin: '0 0 6px 4px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Choose Theme
          </p>
          {Object.entries(THEMES).map(([key, theme]) => {
            const isActive = themeKey === key;
            return (
              <button
                key={key}
                onClick={() => { setThemeKey(key); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 14,
                  border: isActive ? `2px solid ${theme.vars['--accent']}` : '2px solid transparent',
                  background: isActive ? theme.vars['--accent-light'] : 'var(--glass-bg)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                  width: '100%', textAlign: 'left',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--accent-light)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'var(--glass-bg)'; }}
              >
                {/* Colour swatch */}
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: theme.vars['--accent-gradient'] || theme.vars['--accent'],
                  border: '2px solid rgba(255,255,255,0.6)',
                  boxShadow: `0 2px 8px ${theme.vars['--accent']}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem',
                }}>
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500, color: 'var(--text-primary)' }}>
                  {theme.emoji} {theme.label}
                </span>
                {isActive && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 800, color: theme.vars['--accent'], background: theme.vars['--accent-light'], padding: '2px 6px', borderRadius: 6 }}>
                    ON
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
