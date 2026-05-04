import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import './Onboarding.css';

const COMMON_ISSUES = [
  "Acne breakouts", "Redness / Sensitivity", "Dark Spots", 
  "Fine Lines", "Dullness"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const [step, setStep] = useState(1);
  const [knowsSkinType, setKnowsSkinType] = useState(null);
  
  const [tempSkinType, setTempSkinType] = useState("");
  const [tempIssues, setTempIssues] = useState([]);
  
  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => step > 1 ? setStep(s => s - 1) : navigate(-1);
  
  const selectSkinType = (type) => {
    setTempSkinType(type);
    handleNext();
  };

  const toggleIssue = (issue) => {
    setTempIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  const finishOnboarding = () => {
    updateUserData({ skinType: tempSkinType || 'Unknown', skinIssues: tempIssues });
    navigate('/dashboard');
  };

  return (
    <div className="onboarding-container pad-screen fade-in">
      <div className="onboarding-header slide-up">
        <button className="icon-btn hover-lift" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      <div className="onboarding-content stack-y">
        {step === 1 && (
          <div className="step-card slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-gradient">Let's get to know your skin</h2>
            <p>Do you already know your skin type?</p>
            
            <div className="options-grid">
              <button className="option-btn glass-panel hover-lift" onClick={() => { setKnowsSkinType(true); handleNext(); }}>
                Yes, I know it
              </button>
              <button className="option-btn glass-panel hover-lift" onClick={() => { setKnowsSkinType(false); handleNext(); }}>
                No, help me figure it out
              </button>
            </div>
          </div>
        )}

        {step === 2 && knowsSkinType === true && (
          <div className="step-card slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-gradient">What is your skin type?</h2>
            <div className="options-grid stack-y">
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Dry")}>Dry</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Oily")}>Oily</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Combination")}>Combination</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Normal")}>Normal</button>
            </div>
          </div>
        )}

        {step === 2 && knowsSkinType === false && (
          <div className="step-card slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-gradient">How does your skin feel midday?</h2>
            <div className="options-grid stack-y">
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Dry")}>Tight and flaky</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Oily")}>Shiny all over</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Combination")}>Shiny only on nose/forehead</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Normal")}>Comfortable, not too shiny or dry</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-card slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-gradient">Any specific skin issues?</h2>
            <p>Select all that apply</p>
            <div className="tags-container">
              {COMMON_ISSUES.map(issue => {
                const isActive = tempIssues.includes(issue);
                return (
                  <button 
                    key={issue} 
                    className="tag-btn glass-panel hover-lift"
                    onClick={() => toggleIssue(issue)}
                    style={{
                      background: isActive ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                      color: isActive ? '#fff' : 'var(--text-primary)',
                      borderColor: isActive ? 'transparent' : 'var(--glass-border)',
                      fontWeight: isActive ? 600 : 500
                    }}
                  >
                    {issue}
                  </button>
                )
              })}
            </div>
            
            <button className="btn-primary hover-lift" style={{ marginTop: '32px' }} onClick={finishOnboarding}>
              <span>Complete Profile</span> <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
