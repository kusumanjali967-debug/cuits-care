import { createContext, useState, useEffect, useContext } from 'react';
import { sendWelcomeEmail } from '../services/emailService';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

/* ── Simple password hash (SHA-256 via Web Crypto API) ──────────────────── */
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray  = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ── Pre-login guest data key ───────────────────────────────────────────── */
const GUEST_KEY = 'cuitsCare_prelogin_guest';

const EMPTY_USER = {
  name: 'Guest',
  email: '',
  skinType: 'Unknown',
  skinIssues: [],
  currentProducts: [],
  morningRoutine: [],
  nightRoutine: [],
  history: [],
  score: 0,
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedEmail = localStorage.getItem('cuitsCareUserEmail');
    if (savedEmail) {
      const localData = localStorage.getItem(`cuitsCare_${savedEmail}`);
      if (localData) {
        try { return JSON.parse(localData); }
        catch (e) { console.error('Startup parse error', e); }
      }
    }
    // Restore any pre-login guest data so UX is seamless
    const guestData = localStorage.getItem(GUEST_KEY);
    if (guestData) {
      try { return { ...EMPTY_USER, ...JSON.parse(guestData) }; }
      catch { /* ignore */ }
    }
    return { ...EMPTY_USER };
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  /* Save guest (pre-login) data whenever state changes and no user logged in */
  useEffect(() => {
    if (!userData.email) {
      const toSave = { ...userData };
      delete toSave.name; delete toSave.email;
      localStorage.setItem(GUEST_KEY, JSON.stringify(toSave));
    }
  }, [userData]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('cuitsCareUserEmail');
    if (savedEmail) {
      const localData = localStorage.getItem(`cuitsCare_${savedEmail}`);
      if (localData) {
        try { setUserData(JSON.parse(localData)); }
        catch { /* ignore */ }
      }
    }
    setLoading(false);
  }, []);

  /* ── Register new user ─────────────────────────────────────────────────── */
  const register = async (name, email, password) => {
    setAuthError('');
    const normalEmail = email.trim().toLowerCase();

    // Check if already registered
    const existing = localStorage.getItem(`cuitsCare_creds_${normalEmail}`);
    if (existing) {
      setAuthError('An account with this email already exists. Please log in.');
      return null;
    }

    if (!password || password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return null;
    }

    const passwordHash = await hashPassword(password);

    // Save credentials (email + password hash)
    localStorage.setItem(
      `cuitsCare_creds_${normalEmail}`,
      JSON.stringify({ name, email: normalEmail, passwordHash })
    );

    // Merge any pre-login guest data (skin quiz answers, diary, photos etc.)
    const guestRaw = localStorage.getItem(GUEST_KEY);
    let guestData = {};
    if (guestRaw) {
      try { guestData = JSON.parse(guestRaw); }
      catch { /* ignore */ }
    }

    const newUser = {
      ...EMPTY_USER,
      ...guestData,       // ← carry over anything done before login
      name,
      email: normalEmail,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`cuitsCare_${normalEmail}`, JSON.stringify(newUser));
    localStorage.setItem('cuitsCareUserEmail', normalEmail);
    localStorage.removeItem(GUEST_KEY); // clear guest buffer

    setUserData(newUser);

    // Send welcome email (only if EmailJS is configured)
    sendWelcomeEmail({ name, email: normalEmail }).catch(() => {});

    return { user: newUser, isNew: true };
  };

  /* ── Login existing user ───────────────────────────────────────────────── */
  const login = async (email, password) => {
    setAuthError('');
    const normalEmail = email.trim().toLowerCase();

    const credsRaw = localStorage.getItem(`cuitsCare_creds_${normalEmail}`);
    if (!credsRaw) {
      setAuthError('No account found with this email. Please sign up first.');
      return null;
    }

    let creds;
    try { creds = JSON.parse(credsRaw); }
    catch {
      setAuthError('Account data corrupted. Please sign up again.');
      return null;
    }

    // Validate password
    const inputHash = await hashPassword(password);
    if (inputHash !== creds.passwordHash) {
      setAuthError('Incorrect password. Please try again.');
      return null;
    }

    // Load stored user profile
    let storedUser = { ...EMPTY_USER, name: creds.name, email: normalEmail };
    const storedRaw = localStorage.getItem(`cuitsCare_${normalEmail}`);
    if (storedRaw) {
      try { storedUser = JSON.parse(storedRaw); }
      catch { /* ignore */ }
    }

    // Merge pre-login guest data (things done before login)
    const guestRaw = localStorage.getItem(GUEST_KEY);
    if (guestRaw) {
      try {
        const guest = JSON.parse(guestRaw);
        // Merge guest activity: history, diary, photos into existing profile
        storedUser = {
          ...storedUser,
          history: [...(storedUser.history || []), ...(guest.history || [])],
          // Prefer real profile skin type over guest's
          skinType: storedUser.skinType !== 'Unknown' ? storedUser.skinType : (guest.skinType || 'Unknown'),
        };
      } catch { /* ignore */ }
      localStorage.removeItem(GUEST_KEY);
    }

    localStorage.setItem(`cuitsCare_${normalEmail}`, JSON.stringify(storedUser));
    localStorage.setItem('cuitsCareUserEmail', normalEmail);
    setUserData(storedUser);

    return {
      user: storedUser,
      isNew: storedUser.skinType === 'Unknown',
    };
  };

  /* ── Sync to localStorage (+ optional backend) ─────────────────────────── */
  const syncToDB = async (newData) => {
    if (!newData.email) return;
    localStorage.setItem(`cuitsCare_${newData.email}`, JSON.stringify(newData));
    // Backend sync (optional, graceful fail)
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      if (!res.ok) throw new Error('Backend offline');
    } catch {
      /* already saved to localStorage above */
    }
  };

  /* ── Update user data ──────────────────────────────────────────────────── */
  const updateUserData = (newData) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      syncToDB(updated);
      return updated;
    });
  };

  /* ── Toggle routine step ───────────────────────────────────────────────── */
  const toggleRoutine = (id) => {
    setUserData(prev => {
      const updated = {
        ...prev,
        morningRoutine: (prev.morningRoutine || []).map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
        nightRoutine: (prev.nightRoutine || []).map(item =>
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
      };
      syncToDB(updated);
      return updated;
    });
  };

  /* ── Change password ───────────────────────────────────────────────────── */
  const changePassword = async (email, oldPassword, newPassword) => {
    const normalEmail = email.trim().toLowerCase();
    const credsRaw = localStorage.getItem(`cuitsCare_creds_${normalEmail}`);
    if (!credsRaw) return { error: 'Account not found.' };

    const creds = JSON.parse(credsRaw);
    const oldHash = await hashPassword(oldPassword);
    if (oldHash !== creds.passwordHash) return { error: 'Current password is incorrect.' };

    if (!newPassword || newPassword.length < 6) return { error: 'New password must be at least 6 characters.' };

    const newHash = await hashPassword(newPassword);
    localStorage.setItem(`cuitsCare_creds_${normalEmail}`, JSON.stringify({ ...creds, passwordHash: newHash }));
    return { success: true };
  };

  /* ── Logout ────────────────────────────────────────────────────────────── */
  const logout = () => {
    // Keep user profile data in localStorage (persist for next login)
    // Just clear the active session marker
    localStorage.removeItem('cuitsCareUserEmail');
    setUserData({ ...EMPTY_USER });
    setAuthError('');
  };

  return (
    <UserContext.Provider value={{
      userData, updateUserData, toggleRoutine,
      login, register, logout, changePassword,
      loading, authError, setAuthError,
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
