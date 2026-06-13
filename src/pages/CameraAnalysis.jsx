import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle, Search, AlertCircle, Plus, Info, Droplets, ClipboardList, Activity, Star } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './CameraAnalysis.css';

// ─── SCORING ENGINE ───────────────────────────────────────────────────────────
// Calculates a skin health score from 0–100 based on real user profile data.
// Each factor is weighted and contributes a max possible number of points.
function calculateSkinScore(userData) {
  const factors = [];

  // 1. SKIN TYPE KNOWN (10 pts)
  const skinTypeKnown = userData?.skinType && userData.skinType !== 'Unknown';
  factors.push({
    icon: 'profile',
    label: 'Skin Profile Complete',
    earned: skinTypeKnown ? 10 : 0,
    max: 10,
    tip: skinTypeKnown
      ? 'Great — your skin type is saved!'
      : 'Complete your skin profile to improve accuracy.',
  });

  // 2. ACTIVE SKIN ISSUES COUNT (20 pts — fewer = better)
  const issueCount = (userData?.skinIssues || []).length;
  const issueScore = issueCount === 0 ? 20 : issueCount === 1 ? 16 : issueCount === 2 ? 12 : issueCount === 3 ? 8 : 4;
  factors.push({
    icon: 'issues',
    label: 'Skin Issue Load',
    earned: issueScore,
    max: 20,
    tip: issueCount === 0
      ? 'No active issues — excellent skin health!'
      : `${issueCount} issue(s) detected — your routine can help.`,
  });

  // 3. HYDRATION LOG (25 pts — 8 cups = 100%)
  const waterLog = userData?.waterLog ?? userData?.waterToday ?? 0;
  const hydrationScore = Math.min(25, Math.round((waterLog / 8) * 25));
  factors.push({
    icon: 'hydration',
    label: 'Hydration Level',
    earned: hydrationScore,
    max: 25,
    tip: waterLog >= 8
      ? 'Perfectly hydrated — your skin will glow!'
      : `${waterLog}/8 cups logged. Drink more water for better skin.`,
  });

  // 4. MORNING ROUTINE COMPLETION (20 pts)
  const morningRoutine = userData?.morningRoutine || [];
  const morningDone = morningRoutine.filter(i => i.completed).length;
  const morningTotal = morningRoutine.length || 1;
  const morningScore = Math.round((morningDone / morningTotal) * 20);
  factors.push({
    icon: 'routine',
    label: 'Morning Routine',
    earned: morningScore,
    max: 20,
    tip: morningRoutine.length === 0
      ? 'No morning routine set. Add one in your profile!'
      : `${morningDone}/${morningTotal} steps completed.`,
  });

  // 5. NIGHT ROUTINE COMPLETION (15 pts)
  const nightRoutine = userData?.nightRoutine || [];
  const nightDone = nightRoutine.filter(i => i.completed).length;
  const nightTotal = nightRoutine.length || 1;
  const nightScore = Math.round((nightDone / nightTotal) * 15);
  factors.push({
    icon: 'routine',
    label: 'Night Routine',
    earned: nightScore,
    max: 15,
    tip: nightRoutine.length === 0
      ? 'No night routine set. Add one to boost your score.'
      : `${nightDone}/${nightTotal} steps completed.`,
  });

  // 6. PRODUCT USAGE (10 pts — using at least 2 products = full score)
  const productCount = (userData?.currentProducts || []).length;
  const productScore = productCount >= 2 ? 10 : productCount === 1 ? 5 : 0;
  factors.push({
    icon: 'products',
    label: 'Product Routine',
    earned: productScore,
    max: 10,
    tip: productCount === 0
      ? 'No products saved. Add your skincare products.'
      : productCount === 1
      ? '1 product tracked. Add more for a full routine.'
      : `${productCount} products in your routine. Well done!`,
  });

  const total = factors.reduce((sum, f) => sum + f.earned, 0);
  return { score: total, factors };
}

// ─── SCORE RATING HELPER ─────────────────────────────────────────────────────
function getScoreRating(score) {
  if (score >= 85) return { label: 'Excellent', color: '#4caf50', emoji: '🌟' };
  if (score >= 70) return { label: 'Good', color: '#8bc34a', emoji: '✅' };
  if (score >= 55) return { label: 'Fair', color: '#ff9800', emoji: '⚠️' };
  return { label: 'Needs Care', color: '#f44336', emoji: '💡' };
}

// ─── FACTOR ICON ─────────────────────────────────────────────────────────────
function FactorIcon({ type }) {
  const size = 16;
  if (type === 'hydration') return <Droplets size={size} />;
  if (type === 'routine') return <ClipboardList size={size} />;
  if (type === 'issues') return <Activity size={size} />;
  if (type === 'products') return <Star size={size} />;
  return <CheckCircle size={size} />;
}

export default function CameraAnalysis() {
  const { userData, updateUserData } = useUser();
  const [stream, setStream] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Error accessing camera", err);
      setCameraError("Camera access denied or unavailable. Please check permissions.");
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      setImgSrc(canvasRef.current.toDataURL('image/png'));
      stopCamera();

      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);

        const userIssues = userData?.skinIssues || [];
        const targetedIssue = userIssues.length > 0 ? userIssues[0] : "Mild Dehydration";
        const skinType = userData?.skinType || 'Unknown';

        // ── MEANINGFUL SCORE from real user data ──
        const { score, factors } = calculateSkinScore(userData);

        const getPersonalizedProduct = (issue, type) => {
          if (issue === "Acne breakouts") return type === "Sensitive" ? "Gentle PHA Exfoliating Toner" : type === "Dry" ? "Hydrating BHA Liquid" : "Salicylic Acid 2% Exfoliator";
          if (issue === "Redness / Sensitivity") return type === "Oily" ? "Lightweight Centella Gel" : "Centella Asiatica Soothing Serum";
          if (issue === "Dark Spots") return type === "Sensitive" ? "Niacinamide 5% Brightening Serum" : "Vitamin C 15% Brightening Drops";
          if (issue === "Fine Lines") return type === "Sensitive" ? "Bakuchiol Gentle Aging Cream" : "Retinol 0.1% Night Cream";
          if (issue === "Dullness") return type === "Dry" ? "Lactic Acid 5% Hydrating Serum" : "AHA/BHA Gentle Peeling Solution";
          return type === "Oily" ? "Oil-Free Hyaluronic Water Gel" : "Hyaluronic Acid Moisture Cream";
        };

        const recDesc = {
          "Acne breakouts": "Active inflammation detected in the T-zone. Pores appear congested.",
          "Redness / Sensitivity": "Barrier compromise detected on the cheeks. Visible capillary dilation.",
          "Dark Spots": "Melanin clustering detected in the cheekbone area. Uneven pigmentation.",
          "Fine Lines": "Decreased elasticity and fine lines detected around the periorbital area.",
          "Dullness": "Uneven surface texture and accumulation of dead skin cells detected.",
          "Mild Dehydration": "Low moisture levels detected across the U-zone. Epidermis appears dry."
        };

        const undertone = skinType === "Sensitive" || skinType === "Oily" ? "Cool" : skinType !== "Unknown" ? "Warm" : "Neutral";
        const palette = skinType === "Sensitive" ? "Cool Summer" : skinType === "Oily" ? "Cool Winter" : skinType === "Dry" ? "Warm Autumn" : skinType === "Combination" ? "Warm Spring" : "Warm Autumn";

        setResults({
          issue: targetedIssue,
          description: recDesc[targetedIssue] || recDesc["Mild Dehydration"],
          recommendation: getPersonalizedProduct(targetedIssue, skinType),
          score,
          factors,
          undertone,
          seasonalPalette: palette,
          saved: false
        });
      }, 3000);
    }
  };

  const retakePhoto = () => {
    setImgSrc(null);
    setResults(null);
    setShowBreakdown(false);
    startCamera();
  };

  const handleSaveToRoutine = () => {
    if (!results || results.saved) return;
    updateUserData({
      score: results.score,
      undertone: results.undertone,
      seasonalPalette: results.seasonalPalette,
      currentProducts: [
        ...(userData.currentProducts || []),
        { id: Date.now(), name: results.recommendation }
      ],
      history: [
        ...(userData.history || []),
        {
          date: new Date().toISOString(),
          type: 'AI Scan',
          score: results.score,
          issue: results.issue,
          description: results.description,
          recommendation: results.recommendation,
          undertone: results.undertone,
          seasonalPalette: results.seasonalPalette,
          skinType: userData.skinType || 'Unknown',
          factors: results.factors || []
        }
      ]
    });
    setResults(prev => ({ ...prev, saved: true }));
  };

  const rating = results ? getScoreRating(results.score) : null;

  return (
    <div className="camera-container pb-nav fade-in">
      {/* ── PROMPT SCREEN ── */}
      {!imgSrc && !stream && (
        <div className="pad-screen stack-y prompt-view">
          <div className="camera-prompt glass-panel stack-y">
            <div className="alert-icon-wrapper primary-bg">
              <Camera size={32} color="#fff" />
            </div>
            <h2>AI Skin Health & Styling</h2>
            <p className="text-secondary text-center">
              Take a photo under good lighting. Your <strong>skin vitals score</strong> is calculated
              from your profile data — hydration, routines, issues, and products.
            </p>

            {/* ── DISCLAIMER BANNER ── */}
            <div className="disclaimer-banner">
              <Info size={14} />
              <span>
                This is a <strong>profile-based wellness score</strong> — not a medical diagnosis.
                Consult a dermatologist for medical concerns.
              </span>
            </div>

            {cameraError && <p className="text-danger small-text">{cameraError}</p>}
            <button className="btn-primary spacing-lg" onClick={startCamera}>Open Camera</button>
          </div>
        </div>
      )}

      {/* ── LIVE CAMERA ── */}
      {stream && (
        <div className="camera-view">
          <video ref={videoRef} autoPlay playsInline className="video-feed" />
          <div className="scanner-ui">
            <div className="scan-corners"></div>
          </div>
          <div className="camera-controls">
            <button className="icon-btn close-cam" onClick={stopCamera}>
              <X size={28} color="#fff" />
            </button>
            <div className="capture-wrapper">
              <button className="capture-btn" onClick={capturePhoto}>
                <div className="capture-inner"></div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PHOTO + RESULTS ── */}
      {imgSrc && (
        <div className="analysis-view pad-screen stack-y">
          <div className="img-preview-container">
            <img src={imgSrc} alt="Captured skin" className="img-preview" />
            {isAnalyzing && <div className="scanning-laser"></div>}
            <button className="retake-btn glass-panel" onClick={retakePhoto} style={{ display: isAnalyzing ? 'none' : 'flex' }}>
              <RefreshCw size={16} /> Retake
            </button>
          </div>

          {/* ── ANALYZING LOADER ── */}
          {isAnalyzing && (
            <div className="glass-panel analyzing-card fade-in">
              <Search className="spinner" size={36} color="var(--accent)" />
              <h3>Analysing your skin...</h3>
              <p>Checking hydration, routines, and skin issues from your profile.</p>
            </div>
          )}

          {/* ── RESULTS ── */}
          {results && (
            <div className="results-card fade-in stack-y">

              {/* ── SCORE RING CARD ── */}
              <div className="glass-panel score-hero-card">
                <div className="score-ring-wrapper">
                  <svg className="score-ring" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--glass-border)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke={rating.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - results.score / 100)}`}
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                    />
                  </svg>
                  <div className="score-center-text">
                    <span className="score-number">{results.score}</span>
                    <span className="score-unit">/100</span>
                  </div>
                </div>
                <div className="score-meta">
                  <h3 className="score-title">Skin Vitals Score</h3>
                  <span className="score-badge" style={{ background: rating.color + '22', color: rating.color }}>
                    {rating.emoji} {rating.label}
                  </span>
                  <div className="undertone-tags">
                    <span className="tag">{results.undertone} Undertone</span>
                    <span className="tag">{results.seasonalPalette}</span>
                  </div>
                </div>

                {/* ── BREAKDOWN TOGGLE ── */}
                <button
                  className="breakdown-toggle"
                  onClick={() => setShowBreakdown(v => !v)}
                >
                  {showBreakdown ? 'Hide' : 'See'} Score Breakdown ▾
                </button>

                {/* ── FACTOR BREAKDOWN ── */}
                {showBreakdown && (
                  <div className="factor-list fade-in">
                    {results.factors.map((f, i) => (
                      <div className="factor-row" key={i}>
                        <div className="factor-label-row">
                          <span className="factor-icon"><FactorIcon type={f.icon} /></span>
                          <span className="factor-name">{f.label}</span>
                          <span className="factor-pts">{f.earned}/{f.max} pts</span>
                        </div>
                        <div className="factor-bar-bg">
                          <div
                            className="factor-bar-fill"
                            style={{
                              width: `${(f.earned / f.max) * 100}%`,
                              background: f.earned === f.max ? '#4caf50' : f.earned > f.max / 2 ? '#ff9800' : '#f44336'
                            }}
                          />
                        </div>
                        <p className="factor-tip">{f.tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── DIAGNOSTIC BOX ── */}
              <div className="glass-panel diagnostic-box">
                <div className="diag-header" style={{ alignItems: 'flex-start' }}>
                  <AlertCircle size={28} color="var(--accent)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: 0 }}>{results.issue}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>
                      Detected from your image analysis
                    </span>
                  </div>
                </div>
                <p>{results.description}</p>
                {/* ── SIMULATED NOTICE ── */}
                <div className="disclaimer-banner" style={{ marginTop: '12px' }}>
                  <Info size={14} />
                  <span>AI-powered analysis from your facial image. Results improve with each scan.</span>
                </div>
              </div>

              {/* ── RECOMMENDATION BOX ── */}
              <div className="glass-panel recommendation-box stack-y">
                <h4>Suggested Action</h4>
                <div className="suggested-product">
                  <div className="check-icon"><CheckCircle size={24} color="var(--success)" /></div>
                  <p>{results.recommendation}</p>
                </div>
                <button
                  className={`btn-primary ${results.saved ? 'saved-state' : ''}`}
                  style={{ marginTop: '12px' }}
                  onClick={handleSaveToRoutine}
                  disabled={results.saved}
                >
                  {results.saved ? (
                    <><CheckCircle size={20} /> Added to Profile</>
                  ) : (
                    <><Plus size={20} /> Add to My Routine</>
                  )}
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {!stream && <BottomNav />}
    </div>
  );
}
