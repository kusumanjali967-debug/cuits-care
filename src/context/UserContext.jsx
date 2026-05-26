import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const savedEmail = localStorage.getItem('cuitsCareUserEmail');
    if (savedEmail) {
      const localData = localStorage.getItem(`cuitsCare_${savedEmail}`);
      if (localData) {
        try {
          return JSON.parse(localData);
        } catch (e) {
          console.error("Error parsing initial user data from localStorage", e);
        }
      }
    }
    return {
      name: "Guest",
      email: "",
      skinType: "Unknown",
      skinIssues: [],
      currentProducts: [],
      morningRoutine: [],
      nightRoutine: [],
      history: []
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
            
            // Smart merge on load: if local copy has assessment data but DB doesn't, sync it up
            const localData = localStorage.getItem(`cuitsCare_${savedEmail}`);
            let merged = data;
            if (localData) {
              try {
                const localUser = JSON.parse(localData);
                if (localUser.skinType !== "Unknown" && data.skinType === "Unknown") {
                  merged = { ...data, ...localUser };
                  syncToDB(merged);
                }
              } catch (e) {
                console.error("Error merging local data on startup", e);
              }
            }
            
            setUserData(merged);
            localStorage.setItem(`cuitsCare_${savedEmail}`, JSON.stringify(merged));
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
    
    // Check if we have existing local storage data
    const localData = localStorage.getItem(`cuitsCare_${email}`);
    let localUser = null;
    if (localData) {
      try {
        localUser = JSON.parse(localData);
      } catch (e) {
        console.error("Error parsing localUser data during login", e);
      }
    }

    try {
      const res = await fetch(`/api/user/${email}`);
      if (res.ok) {
        const dbData = await res.json();
        
        // Smart merge: If local data exists and has skinType set but DB doesn't, sync local to DB
        if (localUser && localUser.skinType !== "Unknown" && dbData.skinType === "Unknown") {
          const merged = { ...dbData, ...localUser };
          setUserData(merged);
          syncToDB(merged);
          return { user: merged, isNew: false };
        }
        
        setUserData(dbData);
        localStorage.setItem(`cuitsCare_${email}`, JSON.stringify(dbData));
        return { user: dbData, isNew: dbData.skinType === "Unknown" };
      } else {
        // If DB doesn't have the user, check if we have localUser
        if (localUser && localUser.skinType !== "Unknown") {
          // Sync localUser to DB
          const postRes = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localUser)
          });
          if (postRes.ok) {
            const data = await postRes.json();
            setUserData(data);
            return { user: data, isNew: false };
          }
        }

        // Otherwise, create new user
        const newUserData = { email, name: email.split('@')[0] };
        const postRes = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUserData)
        });
        if (postRes.ok) {
          const data = await postRes.json();
          setUserData(data);
          localStorage.setItem(`cuitsCare_${email}`, JSON.stringify(data));
          return { user: data, isNew: true };
        } else {
          throw new Error("Backend offline");
        }
      }
    } catch (error) {
      console.warn("Backend offline, falling back to local storage");
      if (localUser) {
        setUserData(localUser);
        return { user: localUser, isNew: localUser.skinType === "Unknown" };
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
      if (updated.email) {
        localStorage.setItem(`cuitsCare_${updated.email}`, JSON.stringify(updated));
      }
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
      if (updated.email) {
        localStorage.setItem(`cuitsCare_${updated.email}`, JSON.stringify(updated));
      }
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
