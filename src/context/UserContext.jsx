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
      currentProducts: [
        { id: 1, name: 'COSRX Low pH Cleanser' },
        { id: 2, name: 'Beauty of Joseon Sunscreen' }
      ],
      morningRoutine: [
        { id: 1, name: "Gentle Cleanser", completed: false },
        { id: 2, name: "Vitamin C Serum", completed: false },
        { id: 3, name: "SPF 50 Sunscreen", completed: false }
      ]
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
          }
        } catch (error) {
          console.error("Failed to load user from DB:", error);
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
      } else {
        // Create new user if not exists
        const newUserData = { ...userData, email, name: email.split('@')[0] };
        const postRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUserData)
        });
        if (postRes.ok) {
          const data = await postRes.json();
          setUserData(data);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const syncToDB = async (newData) => {
    if (!newData.email) return;
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
    } catch (err) {
      console.error("Failed to sync to DB", err);
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
        morningRoutine: prev.morningRoutine.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      };
      syncToDB(updated);
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, toggleRoutine, login, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};
