import { createContext, useContext, useState, useEffect } from 'react';

/* ─── 5 beautiful colour themes ─────────────────────────────────────────── */
export const THEMES = {
  rose: {
    label: 'Rose Gold',
    emoji: '🌸',
    vars: {
      '--accent':           '#d88c7d',
      '--accent-light':     '#f3dcd6',
      '--accent-gradient':  'linear-gradient(135deg,#d88c7d 0%,#e8a89b 100%)',
      '--success':          '#678b66',
      '--bg-primary':       '#fcfaf8',
      '--bg-secondary':     '#ffffff',
      '--text-primary':     '#2d2a26',
      '--text-secondary':   '#716f6b',
      '--glass-bg':         'rgba(255,255,255,0.6)',
      '--glass-border':     'rgba(255,255,255,0.8)',
      '--card-shadow':      '0 8px 32px rgba(0,0,0,0.05)',
      '--card-shadow-hover':'0 16px 48px rgba(216,140,125,0.18)',
      '--particle-color':   'rgba(216,140,125,0.3)',
    },
  },
  ocean: {
    label: 'Ocean Blue',
    emoji: '🌊',
    vars: {
      '--accent':           '#3b82f6',
      '--accent-light':     '#dbeafe',
      '--accent-gradient':  'linear-gradient(135deg,#3b82f6 0%,#60a5fa 100%)',
      '--success':          '#059669',
      '--bg-primary':       '#f0f7ff',
      '--bg-secondary':     '#ffffff',
      '--text-primary':     '#1e3a5f',
      '--text-secondary':   '#4b6a8a',
      '--glass-bg':         'rgba(219,234,254,0.55)',
      '--glass-border':     'rgba(147,197,253,0.5)',
      '--card-shadow':      '0 8px 32px rgba(59,130,246,0.08)',
      '--card-shadow-hover':'0 16px 48px rgba(59,130,246,0.2)',
      '--particle-color':   'rgba(59,130,246,0.25)',
    },
  },
  forest: {
    label: 'Forest Green',
    emoji: '🌿',
    vars: {
      '--accent':           '#16a34a',
      '--accent-light':     '#dcfce7',
      '--accent-gradient':  'linear-gradient(135deg,#16a34a 0%,#4ade80 100%)',
      '--success':          '#15803d',
      '--bg-primary':       '#f0fdf4',
      '--bg-secondary':     '#ffffff',
      '--text-primary':     '#14532d',
      '--text-secondary':   '#4b7c5a',
      '--glass-bg':         'rgba(220,252,231,0.55)',
      '--glass-border':     'rgba(134,239,172,0.5)',
      '--card-shadow':      '0 8px 32px rgba(22,163,74,0.08)',
      '--card-shadow-hover':'0 16px 48px rgba(22,163,74,0.2)',
      '--particle-color':   'rgba(22,163,74,0.25)',
    },
  },
  purple: {
    label: 'Purple Haze',
    emoji: '💜',
    vars: {
      '--accent':           '#9333ea',
      '--accent-light':     '#f3e8ff',
      '--accent-gradient':  'linear-gradient(135deg,#9333ea 0%,#c084fc 100%)',
      '--success':          '#7c3aed',
      '--bg-primary':       '#faf5ff',
      '--bg-secondary':     '#ffffff',
      '--text-primary':     '#3b0764',
      '--text-secondary':   '#7e22ce',
      '--glass-bg':         'rgba(243,232,255,0.55)',
      '--glass-border':     'rgba(216,180,254,0.5)',
      '--card-shadow':      '0 8px 32px rgba(147,51,234,0.08)',
      '--card-shadow-hover':'0 16px 48px rgba(147,51,234,0.2)',
      '--particle-color':   'rgba(147,51,234,0.25)',
    },
  },
  sunset: {
    label: 'Sunset',
    emoji: '🌅',
    vars: {
      '--accent':           '#f97316',
      '--accent-light':     '#ffedd5',
      '--accent-gradient':  'linear-gradient(135deg,#f97316 0%,#fb923c 100%)',
      '--success':          '#ca8a04',
      '--bg-primary':       '#fffbf5',
      '--bg-secondary':     '#ffffff',
      '--text-primary':     '#431407',
      '--text-secondary':   '#9a3412',
      '--glass-bg':         'rgba(255,237,213,0.55)',
      '--glass-border':     'rgba(253,186,116,0.5)',
      '--card-shadow':      '0 8px 32px rgba(249,115,22,0.08)',
      '--card-shadow-hover':'0 16px 48px rgba(249,115,22,0.2)',
      '--particle-color':   'rgba(249,115,22,0.25)',
    },
  },
  dark: {
    label: 'Dark Mode',
    emoji: '🌙',
    vars: {
      '--accent':           '#e2a195',
      '--accent-light':     '#442a25',
      '--accent-gradient':  'linear-gradient(135deg,#e2a195 0%,#f0bdb4 100%)',
      '--success':          '#7da57b',
      '--bg-primary':       '#0f0f0f',
      '--bg-secondary':     '#1a1a1a',
      '--text-primary':     '#f5f5f5',
      '--text-secondary':   '#a0a0a0',
      '--glass-bg':         'rgba(30,30,30,0.7)',
      '--glass-border':     'rgba(255,255,255,0.08)',
      '--card-shadow':      '0 8px 32px rgba(0,0,0,0.4)',
      '--card-shadow-hover':'0 16px 48px rgba(226,161,149,0.25)',
      '--particle-color':   'rgba(226,161,149,0.2)',
    },
  },
};

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(
    () => localStorage.getItem('cuitsCare_theme') || 'rose'
  );

  // Apply CSS variables to :root whenever theme changes
  useEffect(() => {
    const theme = THEMES[themeKey] || THEMES.rose;
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem('cuitsCare_theme', themeKey);
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}
