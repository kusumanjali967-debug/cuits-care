import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Sun, Moon } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function EditRoutine() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const [activeTab, setActiveTab] = useState('morning'); // 'morning' | 'night'
  
  const [morningRoutine, setMorningRoutine] = useState(userData.morningRoutine || []);
  const [nightRoutine, setNightRoutine] = useState(userData.nightRoutine || []);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() === '') return;
    
    if (activeTab === 'morning') {
      setMorningRoutine([...morningRoutine, { id: Date.now(), name: newItem.trim(), completed: false }]);
    } else {
      setNightRoutine([...nightRoutine, { id: Date.now(), name: newItem.trim(), completed: false }]);
    }
    setNewItem("");
  };

  const handleRemoveItem = (id) => {
    if (activeTab === 'morning') {
      setMorningRoutine(morningRoutine.filter(item => item.id !== id));
    } else {
      setNightRoutine(nightRoutine.filter(item => item.id !== id));
    }
  };

  const handleSave = () => {
    updateUserData({ morningRoutine, nightRoutine });
    navigate('/dashboard');
  };

  const activeItems = activeTab === 'morning' ? morningRoutine : nightRoutine;

  return (
    <div className="pad-screen fade-in stack-y" style={{ minHeight: '100vh', paddingTop: '40px' }}>
      <div className="login-header spacing-lg">
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2>Edit Routines</h2>
        <p>Customize your daily steps</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button 
          onClick={() => setActiveTab('morning')}
          style={{ flex: 1, padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '12px', border: 'none', background: activeTab === 'morning' ? 'var(--accent)' : 'var(--glass-bg)', color: activeTab === 'morning' ? '#fff' : 'var(--text-primary)', transition: '0.3s', cursor: 'pointer' }}
        >
          <Sun size={20} /> Morning
        </button>
        <button 
          onClick={() => setActiveTab('night')}
          style={{ flex: 1, padding: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '12px', border: 'none', background: activeTab === 'night' ? '#2f80ed' : 'var(--glass-bg)', color: activeTab === 'night' ? '#fff' : 'var(--text-primary)', transition: '0.3s', cursor: 'pointer' }}
        >
          <Moon size={20} /> Night
        </button>
      </div>

      <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder={activeTab === 'morning' ? "E.g., Vitamin C Serum" : "E.g., Retinol Night Cream"}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          style={{ padding: '12px 16px' }}
        />
        <button type="submit" className="glass-panel" style={{ width: '48px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)', background: activeTab === 'morning' ? 'var(--accent)' : '#2f80ed', color: '#fff', borderRadius: '16px', cursor: 'pointer' }}>
          <Plus size={24} />
        </button>
      </form>

      <div className="stack-y glass-panel" style={{ padding: '8px', minHeight: '200px' }}>
        {activeItems.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: index < activeItems.length - 1 ? '1px solid var(--glass-border)' : 'none' }}>
            <span style={{ fontWeight: 500 }}>{item.name}</span>
            <button 
              onClick={() => handleRemoveItem(item.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        {activeItems.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>No steps added to your {activeTab} routine yet.</p>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
        <button className="btn-primary" onClick={handleSave} style={{ width: '100%' }}>
          <Save size={20} /> Save Routines
        </button>
      </div>
    </div>
  );
}
