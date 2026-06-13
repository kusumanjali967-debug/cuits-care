import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, RefreshCw, CheckCircle, X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import './Onboarding.css';

const COMMON_ISSUES = [
  "Acne breakouts", "Redness / Sensitivity", "Dark Spots",
  "Fine Lines", "Dullness"
];

// Simple skin tone detection from canvas pixel average
function detectSkinToneFromCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  // Sample center region (face area)
  const cx = Math.floor(width / 2), cy = Math.floor(height / 2);
  const sampleW = Math.floor(width * 0.3), sampleH = Math.floor(height * 0.4);
  const imageData = ctx.getImageData(cx - sampleW / 2, cy - sampleH / 2, sampleW, sampleH);
  const data = imageData.data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
  }
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);
  const brightness = (r + g + b) / 3;
  // Determine undertone from color ratios
  const undertone = r > b + 15 ? 'Warm' : b > r + 10 ? 'Cool' : 'Neutral';
  // Detect oiliness hint from brightness (brighter = more reflective/oily)
  const oilinessHint = brightness > 175 ? 'Oily' : brightness < 100 ? 'Dry' : 'Normal';
  return { undertone, oilinessHint, brightness };
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateUserData, register, authError, setAuthError } = useUser();
  const { t } = useLanguage();

  // ── Account creation state (step 0) ───────────────────────────────────────
  const [regName, setRegName]               = useState('');
  const [regEmail, setRegEmail]             = useState('');
  const [regPassword, setRegPassword]       = useState('');
  const [regConfirm, setRegConfirm]         = useState('');
  const [showRegPw, setShowRegPw]           = useState(false);
  const [showRegCf, setShowRegCf]           = useState(false);
  const [regLoading, setRegLoading]         = useState(false);
  const [regLocalErr, setRegLocalErr]       = useState('');

  const [step, setStep] = useState(0);   // 0 = account creation
  const [knowsSkinType, setKnowsSkinType] = useState(null);
  const [tempSkinType, setTempSkinType]   = useState('');
  const [tempIssues, setTempIssues]       = useState([]);
  const [answersList, setAnswersList]     = useState([]);

  // Camera step state
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImg, setCapturedImg] = useState(null);
  const [skinScanResult, setSkinScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraSkipped, setCameraSkipped] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // totalSteps (skins steps only, not counting step 0)
  const totalSteps = knowsSkinType === false ? 9 : 4;

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setCameraStream(stream);
    } catch {
      setCameraError("Camera not available. Please allow camera access or skip this step.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); setCameraStream(null); }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const imgData = canvasRef.current.toDataURL('image/jpeg', 0.7);
    setCapturedImg(imgData);
    stopCamera();
    setIsAnalyzing(true);
    setTimeout(() => {
      const result = detectSkinToneFromCanvas(canvasRef.current);
      setSkinScanResult(result);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => {
    if (step > 1) {
      if (step === 2) { setKnowsSkinType(null); setAnswersList([]); }
      else if (knowsSkinType === false && step > 2) setAnswersList(prev => prev.slice(0, -1));
      if (step === 2) { setCapturedImg(null); setSkinScanResult(null); setCameraSkipped(false); }
      setStep(s => s - 1);
    } else if (step === 1) {
      setStep(0); // Go back to account creation
    } else {
      navigate(-1);
    }
  };

  /* ── Handle account creation (step 0) ────────────────────────────────── */
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegLocalErr('');
    setAuthError('');

    if (!regName.trim())  { setRegLocalErr('Please enter your name.'); return; }
    if (!regEmail.trim()) { setRegLocalErr('Please enter your email.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) { setRegLocalErr('Please enter a valid email address.'); return; }
    if (regPassword.length < 6) { setRegLocalErr('Password must be at least 6 characters.'); return; }
    if (regPassword !== regConfirm) { setRegLocalErr('Passwords do not match.'); return; }

    setRegLoading(true);
    const result = await register(regName.trim(), regEmail.trim().toLowerCase(), regPassword);
    setRegLoading(false);

    if (result) {
      setStep(1); // proceed to skin quiz
    }
    // authError is set inside register() on failure (e.g. email already exists)
  };

  const selectSkinType = (type) => { setTempSkinType(type); handleNext(); };

  const handleQuestionSelect = (type) => {
    const updated = [...answersList, type];
    setAnswersList(updated);
    // Step mapping: questions are at steps 3-7 in unknown path
    if (step === 7) {
      setTempSkinType(calculateSkinType(updated));
      handleNext();
    } else {
      handleNext();
    }
  };

  const calculateSkinType = (list) => {
    const counts = { Dry: 0, Oily: 0, Combination: 0, Normal: 0, Sensitive: 0 };
    list.forEach(t => { if (counts[t] !== undefined) counts[t]++; });
    // Boost with camera hint if available
    if (skinScanResult && !cameraSkipped) counts[skinScanResult.oilinessHint] = (counts[skinScanResult.oilinessHint] || 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const toggleIssue = (issue) => {
    setTempIssues(prev => prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]);
  };

  const finishOnboarding = () => {
    const finalType = tempSkinType || 'Unknown';
    const updates = { skinType: finalType, skinIssues: tempIssues };
    if (skinScanResult && !cameraSkipped) {
      updates.undertone = skinScanResult.undertone;
    }
    updateUserData(updates);
    navigate('/dashboard');
  };

  // STEP RENDERING
  // Step 1: Do you know your skin type?
  // Step 2 (camera): Skin selfie for analysis
  // Step 3+ (known): Pick type → Issues → Done
  // Step 3-7 (unknown): 5 questions → Issues → Done

  const isFinalIssueStep = (knowsSkinType === true && step === 4) || (knowsSkinType === false && step === 9);
  const isQuizStep = knowsSkinType === false && step >= 3 && step <= 7;
  const quizNum = isQuizStep ? step - 2 : 0;

  const quizSteps = [
    { label: 'q1', a: ['q1_a1', 'q1_a2', 'q1_a3', 'q1_a4', 'q1_a5'] },
    { label: 'q2', a: ['q2_a1', 'q2_a2', 'q2_a3', 'q2_a4', 'q2_a5'] },
    { label: 'q3', a: ['q3_a1', 'q3_a2', 'q3_a3', 'q3_a4', 'q3_a5'] },
    { label: 'q4', a: ['q4_a1', 'q4_a2', 'q4_a3', 'q4_a4', 'q4_a5'] },
    { label: 'q5', a: ['q5_a1', 'q5_a2', 'q5_a3', 'q5_a4', 'q5_a5'] },
  ];
  const questionTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'];

  return (
    <div className="onboarding-container pad-screen fade-in">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Progress header */}
      <div className="onboarding-header slide-up">
        <button className="icon-btn hover-lift" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        {step > 0 && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>
        )}
      </div>

      <div className="onboarding-content stack-y">

        {/* ── STEP 0: Create Account ── */}
        {step === 0 && (
          <div className="step-card card-3d slide-up">
            <h2 className="text-gradient">Create Your Account 🌸</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>Join Cuits Care to save your skin journey</p>

            {/* Error */}
            {(regLocalErr || authError) && (
              <div className="fade-in" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 14px', borderRadius: 12,
                background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.25)',
                color: '#f44336', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4,
              }}>
                <AlertCircle size={16} />{regLocalErr || authError}
              </div>
            )}

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} noValidate>
              {/* Username */}
              <div className="input-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input type="text" className="input-field with-icon" placeholder="e.g. glowqueen99"
                    value={regName} onChange={e => setRegName(e.target.value)} autoComplete="username" required />
                </div>
              </div>

              {/* Email */}
              <div className="input-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input type="email" className="input-field with-icon" placeholder="you@example.com"
                    value={regEmail} onChange={e => setRegEmail(e.target.value)} autoComplete="email" required />
                </div>
              </div>

              {/* Password */}
              <div className="input-group">
                <label>Password <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.78rem' }}>(min. 6 characters)</span></label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Lock size={18} className="input-icon" />
                  <input type={showRegPw ? 'text' : 'password'} className="input-field with-icon"
                    placeholder="••••••••" value={regPassword} onChange={e => setRegPassword(e.target.value)}
                    autoComplete="new-password" style={{ paddingRight: 40 }} required />
                  <button type="button" onClick={() => setShowRegPw(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                    {showRegPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="input-group">
                <label>Confirm Password</label>
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <Lock size={18} className="input-icon" />
                  <input type={showRegCf ? 'text' : 'password'} className="input-field with-icon"
                    placeholder="••••••••" value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                    autoComplete="new-password" style={{ paddingRight: 40, borderColor: regConfirm && regConfirm !== regPassword ? '#f44336' : '' }} required />
                  <button type="button" onClick={() => setShowRegCf(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex' }}>
                    {showRegCf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regConfirm && regConfirm !== regPassword && (
                  <p style={{ fontSize: '0.75rem', color: '#f44336', margin: '4px 0 0' }}>Passwords do not match</p>
                )}
              </div>

              <button type="submit" className="btn-primary neon-glow" disabled={regLoading}
                style={{ marginTop: 4 }}>
                {regLoading ? '⏳ Creating account...' : '🌸 Create Account & Continue →'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 12 }}>
              Already have an account?{' '}
              <span onClick={() => navigate('/login')}
                style={{ color: 'var(--accent)', fontWeight: 700, cursor: 'pointer' }}>Log In</span>
            </p>
          </div>
        )}
        {step === 1 && (
          <div className="step-card card-3d slide-up">
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

        {/* ── STEP 2: Camera skin analysis ── */}
        {step === 2 && (
          <div className="step-card card-3d slide-up">
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
              📸 Skin Selfie (Optional)
            </span>
            <h2 className="text-gradient" style={{ fontSize: '1.35rem' }}>Let AI see your skin</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Take a quick selfie in good lighting. Our AI reads your skin tone and brightness to give you more accurate results.
            </p>

            {/* Camera view */}
            {cameraStream && !capturedImg && (
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '3px solid var(--accent)' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, border: '3px dashed rgba(255,255,255,0.4)', borderRadius: '17px', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
                  <button onClick={stopCamera} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', color: '#fff' }}>
                    <X size={20} />
                  </button>
                  <button onClick={capturePhoto}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fff', border: '4px solid var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)' }} />
                  </button>
                </div>
              </div>
            )}

            {/* Captured photo */}
            {capturedImg && (
              <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '3px solid var(--success)' }}>
                <img src={capturedImg} alt="Captured" style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                {isAnalyzing && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#fff' }}>
                    <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontWeight: 600 }}>Analysing skin tone...</span>
                  </div>
                )}
                {skinScanResult && !isAnalyzing && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '16px', color: '#fff' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ background: 'var(--accent)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {skinScanResult.undertone} Undertone
                      </span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Hint: {skinScanResult.oilinessHint} skin
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              {!cameraStream && !capturedImg && (
                <button className="btn-primary" onClick={startCamera} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Camera size={18} /> Open Camera for Skin Analysis
                </button>
              )}
              {capturedImg && !isAnalyzing && (
                <>
                  <button className="btn-primary" onClick={handleNext} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <CheckCircle size={18} /> Use This Photo & Continue
                  </button>
                  <button className="btn-secondary" onClick={() => { setCapturedImg(null); setSkinScanResult(null); startCamera(); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '14px', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <RefreshCw size={16} /> Retake
                  </button>
                </>
              )}
              {cameraError && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center' }}>{cameraError}</p>}
              <button
                onClick={() => { setCameraSkipped(true); handleNext(); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem', cursor: 'pointer', padding: '8px', textDecoration: 'underline' }}>
                Skip this step
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 (known): Pick skin type ── */}
        {step === 3 && knowsSkinType === true && (
          <div className="step-card card-3d slide-up">
            <h2 className="text-gradient">{t('whatIsSkinType')}</h2>
            <div className="options-grid stack-y">
              {['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'].map(type => (
                <button key={type} className="option-btn glass-panel hover-lift" onClick={() => selectSkinType(type)}>{type}</button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEPS 3-7 (unknown): 5 Questions ── */}
        {isQuizStep && (() => {
          const q = quizSteps[quizNum - 1];
          return (
            <div className="step-card card-3d slide-up" key={step}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                Question {quizNum} of 5
              </span>
              {skinScanResult && !cameraSkipped && (
                <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '12px', padding: '8px 12px', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📸 Camera detected: {skinScanResult.undertone} undertone · {skinScanResult.oilinessHint} hint
                </div>
              )}
              <h2 className="text-gradient" style={{ fontSize: '1.35rem' }}>{t(q.label)}</h2>
              <div className="options-grid stack-y" style={{ marginTop: '12px' }}>
                {q.a.map((ak, i) => (
                  <button key={ak} className="option-btn glass-panel hover-lift" onClick={() => handleQuestionSelect(questionTypes[i])}>
                    {t(ak)}
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── STEP 8 (unknown): Result reveal ── */}
        {step === 8 && knowsSkinType === false && (
          <div className="step-card card-3d slide-up" style={{ textAlign: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🎉</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>Your Skin Type</span>
            <h2 className="text-gradient" style={{ fontSize: '2rem', margin: '8px 0' }}>{tempSkinType}</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.5 }}>
              Based on your answers{!cameraSkipped && skinScanResult ? ' and skin selfie analysis' : ''}, we identified your skin type. You can always change this later.
            </p>
            {skinScanResult && !cameraSkipped && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, padding: '6px 14px', borderRadius: '16px' }}>
                  {skinScanResult.undertone} Undertone Detected
                </span>
              </div>
            )}
            <button className="btn-primary hover-lift" style={{ marginTop: '24px' }} onClick={handleNext}>
              Next <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* ── FINAL STEP: Skin Issues ── */}
        {isFinalIssueStep && (
          <div className="step-card card-3d slide-up">
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase' }}>Final Step ✨</span>
            <h2 className="text-gradient">{t('anyIssues')}</h2>
            <p>{t('selectAllApply')}</p>
            <div className="tags-container">
              {COMMON_ISSUES.map(issue => {
                const isActive = tempIssues.includes(issue);
                return (
                  <button key={issue} className="tag-btn glass-panel hover-lift"
                    onClick={() => toggleIssue(issue)}
                    style={{
                      background: isActive ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                      color: isActive ? '#fff' : 'var(--text-primary)',
                      borderColor: isActive ? 'transparent' : 'var(--glass-border)',
                      fontWeight: isActive ? 600 : 500
                    }}>
                    {issue}
                  </button>
                );
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
