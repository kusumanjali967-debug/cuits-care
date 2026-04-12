import { Sun, CheckCircle, Bell, Droplet } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './Dashboard.css';

export default function Dashboard() {
  const { userData, toggleRoutine } = useUser();
  const completedCount = userData.morningRoutine.filter(r => r.completed).length;
  const totalCount = userData.morningRoutine.length;

  return (
    <div className="dashboard-container pb-nav fade-in">
      <div className="dashboard-header pad-screen">
        <div className="header-text">
          <p className="greeting">Good Morning,</p>
          <h2>{userData.name}</h2>
        </div>
        <button className="icon-btn notif-btn">
          <Bell size={24} />
          <span className="notif-badge">1</span>
        </button>
      </div>

      <div className="pad-screen stack-y spacing-lg">
        {/* Environment Alert */}
        <div className="glass-panel alert-card skin-alert">
          <div className="alert-icon-wrapper uv-alert">
            <Sun size={28} color="#fff" />
          </div>
          <div className="alert-content">
            <h3>Very High UV Index (8)</h3>
            <p>Don't forget to apply SPF 50+. We'll remind you to reapply in 2 hours.</p>
          </div>
        </div>

        {/* Daily Skincare Routine */}
        <section className="dashboard-section stack-y">
          <div className="section-header">
            <h3>Morning Routine</h3>
            <span className="progress-text">{completedCount}/{totalCount}</span>
          </div>
          
          <div className="routine-list stack-y">
            {userData.morningRoutine.map(item => (
              <label key={item.id} className={`routine-item glass-panel ${item.completed ? 'checked' : ''}`} onClick={() => toggleRoutine(item.id)}>
                <div className="routine-icon">
                  {item.completed ? <CheckCircle size={20} color="var(--success)" /> : <span className="checkbox-empty"></span>}
                </div>
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Diet & Health Tracking */}
        <section className="dashboard-section stack-y">
          <div className="section-header">
            <h3>Diet Insights</h3>
          </div>
          <div className="glass-panel insight-card">
            <div className="insight-header">
              <div className="alert-icon-wrapper water-bg">
                <Droplet size={24} color="#fff" />
              </div>
              <h4>Recommendation</h4>
            </div>
            <p>Based on your {userData.skinIssues.length > 0 ? userData.skinIssues[0].toLowerCase() : 'current skin condition'}, try to <strong>increase water intake</strong> today and <strong>stop eating high-sugar foods</strong> to reduce inflammation.</p>
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
