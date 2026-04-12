import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft, Save } from 'lucide-react';

const COMMON_ISSUES = [
  "Acne breakouts", "Redness / Sensitivity", "Dark Spots", 
  "Fine Lines", "Dullness", "Oily T-Zone", "Dry Patches", "Large Pores"
];

export default function MySkinIssues() {
  const navigate = useNavigate();
  const { userData, updateUserData } = useUser();
  const [selectedIssues, setSelectedIssues] = useState(userData.skinIssues || []);

  const toggleIssue = (issue) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const handleSave = () => {
    updateUserData({ skinIssues: selectedIssues });
    navigate(-1);
  };

  return (
    <div className="pad-screen fade-in" style={{ paddingTop: '40px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="login-header" style={{ marginBottom: '32px' }}>
        <button className="icon-btn" onClick={() => navigate(-1)} style={{ marginBottom: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h2>My Skin Issues</h2>
        <p>Update any concerns you are currently experiencing</p>
      </div>

      <div className="tags-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {COMMON_ISSUES.map(issue => {
          const isActive = selectedIssues.includes(issue);
          return (
            <button 
              key={issue}
              className="tag-btn glass-panel"
              onClick={() => toggleIssue(issue)}
              style={{
                backgroundColor: isActive ? 'var(--accent)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-primary)',
                borderColor: isActive ? 'var(--accent)' : 'var(--glass-border)'
              }}
            >
              {issue}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
        <button className="btn-primary" onClick={handleSave}>
          <Save size={20} /> Save Changes
        </button>
      </div>
    </div>
  );
}
