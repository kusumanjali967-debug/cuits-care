import { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('cuitsCareUser');
    if (saved) return JSON.parse(saved);
    return {
      name: "Jane",
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

  useEffect(() => {
    localStorage.setItem('cuitsCareUser', JSON.stringify(userData));
  }, [userData]);

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const toggleRoutine = (id) => {
    setUserData(prev => ({
      ...prev,
      morningRoutine: prev.morningRoutine.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, toggleRoutine }}>
      {children}
    </UserContext.Provider>
  );
};
