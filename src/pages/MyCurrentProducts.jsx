import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

export default function MyCurrentProducts() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const [products, setProducts] = useState(userData.currentProducts || []);
  const [newProduct, setNewProduct] = useState("");

  const addProduct = (e) => {
    e.preventDefault();
    if (newProduct.trim() !== '') {
      setProducts([...products, { id: Date.now(), name: newProduct.trim() }]);
      setNewProduct('');
    }
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = () => {
    updateUserData({ currentProducts: products });
    navigate(-1);
  };

  return (
    <div className="pad-screen fade-in" style={{ paddingTop: '40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="login-header" style={{ marginBottom: '32px' }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2>Current Products</h2>
        <p>Keeping track helps us give better recommendations</p>
      </div>

      <form onSubmit={addProduct} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input 
          type="text" 
          className="input-field" 
          placeholder="E.g., CeraVe Hydrating Cleanser"
          value={newProduct}
          onChange={(e) => setNewProduct(e.target.value)}
          style={{ padding: '12px 16px' }}
        />
        <button type="submit" className="glass-panel" style={{ width: '48px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid var(--glass-border)', background: 'var(--accent)', color: '#fff', borderRadius: '16px', cursor: 'pointer' }}>
          <Plus size={24} />
        </button>
      </form>

      <div className="stack-y">
        {products.map(prod => (
          <div key={prod.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
            <span style={{ fontWeight: 500 }}>{prod.name}</span>
            <button 
              onClick={() => removeProduct(prod.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '4px' }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        
        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>No products added yet.</p>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={20} /> Save Products
        </button>
      </div>
    </div>
  );
}
