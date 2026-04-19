import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Clock } from 'lucide-react';

export default function MyScanHistory() {
  const navigate = useNavigate();
  const { userData } = useUser();
  const history = userData.history || [];

  return (
    <div className="pad-screen fade-in stack-y" style={{ minHeight: '100vh', paddingTop: '40px' }}>
      <div className="login-header spacing-lg">
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={24} />
        </button>
        <h2>Scan History</h2>
        <p>Your past skin analysis results</p>
      </div>

      <div className="stack-y">
        {history.length > 0 ? (
          history.slice().reverse().map((item, index) => {
            const date = new Date(item.date).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            });
            return (
              <div key={index} className="glass-panel" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--accent-light)', padding: '12px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} color="var(--accent)" />
                </div>
                <div className="stack-y" style={{ gap: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.result}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{date} • {item.type}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
            <p>No scans found.</p>
            <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>Use the camera to log your first scan!</p>
          </div>
        )}
      </div>
    </div>
  );
}
