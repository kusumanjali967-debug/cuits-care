import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import './Onboarding.css';

const COMMON_ISSUES = [
  "Acne breakouts", "Redness / Sensitivity", "Dark Spots", 
  "Fine Lines", "Dullness"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUserData } = useUser();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [knowsSkinType, setKnowsSkinType] = useState(null);
  
  const [tempSkinType, setTempSkinType] = useState("");
  const [tempIssues, setTempIssues] = useState([]);
  
  // Track selected answer types for each of the 5 questionnaire steps
  const [answersList, setAnswersList] = useState([]);

  const totalSteps = knowsSkinType === false ? 7 : 3;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    if (step > 1) {
      // If we go back from step 2, reset knowsSkinType state
      if (step === 2) {
        setKnowsSkinType(null);
        setAnswersList([]);
      } else if (knowsSkinType === false) {
        // Pop the last answer from the list when going back
        setAnswersList(prev => prev.slice(0, -1));
      }
      setStep(s => s - 1);
    } else {
      navigate(-1);
    }
  };
  
  const selectSkinType = (type) => {
    setTempSkinType(type);
    handleNext();
  };

  const handleQuestionSelect = (type) => {
    const updatedAnswers = [...answersList, type];
    setAnswersList(updatedAnswers);
    
    if (step === 6) {
      // This was the 5th and final question, calculate final skin type
      const finalType = calculateSkinType(updatedAnswers);
      setTempSkinType(finalType);
      handleNext();
    } else {
      handleNext();
    }
  };

  const calculateSkinType = (list) => {
    const counts = { Dry: 0, Oily: 0, Combination: 0, Normal: 0, Sensitive: 0 };
    list.forEach(t => {
      if (counts[t] !== undefined) counts[t]++;
    });
    
    let maxType = 'Normal';
    let maxCount = -1;
    for (const [type, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    }
    return maxType;
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
          <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <div className="onboarding-content stack-y">
        {step === 1 && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <h2 className="text-gradient">{t('onboardingTitle')}</h2>
            <p>{t('knowsSkinTypeQ')}</p>
            
            <div className="options-grid">
              <button className="option-btn glass-panel hover-lift" onClick={() => { setKnowsSkinType(true); handleNext(); }}>
                {t('yesKnow')}
              </button>
              <button className="option-btn glass-panel hover-lift" onClick={() => { setKnowsSkinType(false); handleNext(); }}>
                {t('noHelp')}
              </button>
            </div>
          </div>
        )}

        {/* User Knows Skin Type */}
        {step === 2 && knowsSkinType === true && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <h2 className="text-gradient">{t('whatIsSkinType')}</h2>
            <div className="options-grid stack-y">
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Dry")}>Dry</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Oily")}>Oily</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Combination")}>Combination</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Normal")}>Normal</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => selectSkinType("Sensitive")}>Sensitive</button>
            </div>
          </div>
        )}

        {/* User Does NOT Know Skin Type - Multi-step Questionnaire */}
        {step === 2 && knowsSkinType === false && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>Question 1 of 5</span>
            <h2 className="text-gradient" style={{ fontSize: '1.45rem' }}>{t('q1')}</h2>
            <div className="options-grid stack-y" style={{ marginTop: '12px' }}>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Dry")}>{t('q1_a1')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Oily")}>{t('q1_a2')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Combination")}>{t('q1_a3')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Normal")}>{t('q1_a4')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Sensitive")}>{t('q1_a5')}</button>
            </div>
          </div>
        )}

        {step === 3 && knowsSkinType === false && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>Question 2 of 5</span>
            <h2 className="text-gradient" style={{ fontSize: '1.45rem' }}>{t('q2')}</h2>
            <div className="options-grid stack-y" style={{ marginTop: '12px' }}>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Dry")}>{t('q2_a1')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Oily")}>{t('q2_a2')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Combination")}>{t('q2_a3')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Normal")}>{t('q2_a4')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Sensitive")}>{t('q2_a5')}</button>
            </div>
          </div>
        )}

        {step === 4 && knowsSkinType === false && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>Question 3 of 5</span>
            <h2 className="text-gradient" style={{ fontSize: '1.45rem' }}>{t('q3')}</h2>
            <div className="options-grid stack-y" style={{ marginTop: '12px' }}>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Dry")}>{t('q3_a1')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Oily")}>{t('q3_a2')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Combination")}>{t('q3_a3')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Normal")}>{t('q3_a4')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Sensitive")}>{t('q3_a5')}</button>
            </div>
          </div>
        )}

        {step === 5 && knowsSkinType === false && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>Question 4 of 5</span>
            <h2 className="text-gradient" style={{ fontSize: '1.45rem' }}>{t('q4')}</h2>
            <div className="options-grid stack-y" style={{ marginTop: '12px' }}>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Dry")}>{t('q4_a1')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Oily")}>{t('q4_a2')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Combination")}>{t('q4_a3')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Normal")}>{t('q4_a4')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Sensitive")}>{t('q4_a5')}</button>
            </div>
          </div>
        )}

        {step === 6 && knowsSkinType === false && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>Question 5 of 5</span>
            <h2 className="text-gradient" style={{ fontSize: '1.45rem' }}>{t('q5')}</h2>
            <div className="options-grid stack-y" style={{ marginTop: '12px' }}>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Dry")}>{t('q5_a1')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Oily")}>{t('q5_a2')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Combination")}>{t('q5_a3')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Normal")}>{t('q5_a4')}</button>
              <button className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect("Sensitive")}>{t('q5_a5')}</button>
            </div>
          </div>
        )}

        {/* Final Issues step (Step 3 for knowing, Step 7 for questionnaire) */}
        {((step === 3 && knowsSkinType === true) || (step === 7 && knowsSkinType === false)) && (
          <div className="step-card card-3d slide-up" style={{ animationDelay: '0.1s', padding: '24px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>Final Step</span>
            <h2 className="text-gradient">{t('anyIssues')}</h2>
            <p>{t('selectAllApply')}</p>
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
              <span>{t('completeProfile')}</span> <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

