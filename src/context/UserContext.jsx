import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    return {
      name: "Guest",
      email: "",
      skinType: "Unknown",
      skinIssues: [],
      currentProducts: [],
      morningRoutine: [],
      nightRoutine: []
    };
  });

  const [loading, setLoading] = useState(true);

  // Initial load from backend
  useEffect(() => {
    const fetchUser = async () => {
      const savedEmail = localStorage.getItem('cuitsCareUserEmail');
      if (savedEmail) {
        try {
          const res = await fetch(`/api/user/${savedEmail}`);
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
          } else {
            throw new Error("Backend offline");
          }
        } catch (error) {
          console.warn("Backend offline, loading from local storage");
          const localData = localStorage.getItem(`cuitsCare_${savedEmail}`);
          if (localData) {
            setUserData(JSON.parse(localData));
          }
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email) => {
    localStorage.setItem('cuitsCareUserEmail', email);
    try {
      const res = await fetch(`/api/user/${email}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        return { user: data, isNew: false };
      } else {
        // Create new user if not exists
        const newUserData = { email, name: email.split('@')[0] };
        const postRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUserData)
        });
        if (postRes.ok) {
          const data = await postRes.json();
          setUserData(data);
          return { user: data, isNew: true };
        } else {
          throw new Error("Backend offline");
        }
      }
    } catch (error) {
      console.warn("Backend offline, falling back to local storage");
      const localData = localStorage.getItem(`cuitsCare_${email}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        setUserData(parsed);
        return { user: parsed, isNew: false };
      } else {
        const newUserData = { 
          email, 
          name: email.split('@')[0],
          skinType: "Unknown",
          skinIssues: [],
          currentProducts: [],
          morningRoutine: [],
          nightRoutine: [],
          history: []
        };
        localStorage.setItem(`cuitsCare_${email}`, JSON.stringify(newUserData));
        setUserData(newUserData);
        return { user: newUserData, isNew: true };
      }
    }
  };

  const syncToDB = async (newData) => {
    if (!newData.email) return;
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error("Backend offline");
    } catch (err) {
      console.warn("Backend offline, saving to local storage");
      localStorage.setItem(`cuitsCare_${newData.email}`, JSON.stringify(newData));
    }
  };

  const updateUserData = (newData) => {
    setUserData(prev => {
      const updated = { ...prev, ...newData };
      syncToDB(updated);
      return updated;
    });
  };

  const toggleRoutine = (id) => {
    setUserData(prev => {
      const updated = {
        ...prev,
        morningRoutine: (prev.morningRoutine || []).map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        ),
        nightRoutine: (prev.nightRoutine || []).map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      };
      syncToDB(updated);
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('cuitsCareUserEmail');
    setUserData({
      name: "Guest",
      email: "",
      skinType: "Unknown",
      skinIssues: [],
      currentProducts: [],
      morningRoutine: [],
      nightRoutine: [],
      history: []
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, toggleRoutine, login, logout, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
