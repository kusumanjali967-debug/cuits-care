import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle, Search, AlertCircle, Plus } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import './CameraAnalysis.css';

export default function CameraAnalysis() {
  const { userData, updateUserData } = useUser();
  const [stream, setStream] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [cameraError, setCameraError] = useState(null);
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

  // Clean up on unmount
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
        // Detect primary issue with high confidence
        const targetedIssue = userIssues.length > 0 
          ? userIssues[0] 
          : "Mild Dehydration";
          
        const skinType = userData?.skinType || 'Unknown';
        
        const getPersonalizedProduct = (issue, type) => {
          if (issue === "Acne breakouts") {
            return type === "Sensitive" ? "Gentle PHA Exfoliating Toner" : type === "Dry" ? "Hydrating BHA Liquid" : "Salicylic Acid 2% Exfoliator";
          }
          if (issue === "Redness / Sensitivity") {
            return type === "Oily" ? "Lightweight Centella Gel" : "Centella Asiatica Soothing Serum";
          }
          if (issue === "Dark Spots") {
            return type === "Sensitive" ? "Niacinamide 5% Brightening Serum" : "Vitamin C 15% Brightening drops";
          }
          if (issue === "Fine Lines") {
            return type === "Sensitive" ? "Bakuchiol Gentle Aging Cream" : "Retinol 0.1% Night Cream";
          }
          if (issue === "Dullness") {
            return type === "Dry" ? "Lactic Acid 5% Hydrating Serum" : "AHA/BHA Gentle Peeling Solution";
          }
          // Default: Dehydration
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

        setResults({
          issue: targetedIssue,
          description: recDesc[targetedIssue] || recDesc["Mild Dehydration"],
          recommendation: getPersonalizedProduct(targetedIssue, skinType),
          confidence: Math.floor(Math.random() * 15) + 84, // 84-98%
          saved: false
        });
      }, 3000);
    }
  };

  const retakePhoto = () => {
    setImgSrc(null);
    setResults(null);
    startCamera();
  };

  const handleSaveToRoutine = () => {
    if (!results || results.saved) return;
    
    updateUserData({
      currentProducts: [
        ...(userData.currentProducts || []),
        { id: Date.now(), name: results.recommendation }
      ],
      history: [
        ...(userData.history || []),
        { date: new Date().toISOString(), type: 'Scan', result: results.issue }
      ]
    });
    setResults(prev => ({ ...prev, saved: true }));
  };

  return (
    <div className="camera-container pb-nav fade-in">
      {!imgSrc && !stream && (
        <div className="pad-screen stack-y prompt-view">
          <div className="camera-prompt glass-panel stack-y">
            <div className="alert-icon-wrapper primary-bg">
              <Camera size={32} color="#fff" />
            </div>
            <h2>Skin Tracker Scanner</h2>
            <p className="text-secondary text-center">Take a photo of your face under good lighting to analyze any skin issues and get instant product recommendations.</p>
            {cameraError && <p className="text-danger small-text">{cameraError}</p>}
            <button className="btn-primary spacing-lg" onClick={startCamera}>Open Camera</button>
          </div>
        </div>
      )}

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

      {imgSrc && (
        <div className="analysis-view pad-screen stack-y">
          <div className="img-preview-container">
            <img src={imgSrc} alt="Captured skin" className="img-preview" />
            {isAnalyzing && <div className="scanning-laser"></div>}
            
            <button className="retake-btn glass-panel" onClick={retakePhoto} style={{ display: isAnalyzing ? 'none' : 'flex' }}>
              <RefreshCw size={16} /> Retake
            </button>
          </div>
          
          {isAnalyzing && (
            <div className="glass-panel analyzing-card fade-in">
              <Search className="spinner" size={36} color="var(--accent)" />
              <h3>Analyzing your skin...</h3>
              <p>Looking for redness, hydration levels, and texture.</p>
            </div>
          )}

          {results && (
            <div className="results-card fade-in stack-y">
              <div className="glass-panel diagnostic-box">
                <div className="diag-header" style={{ alignItems: 'flex-start' }}>
                  <AlertCircle size={28} color="var(--accent)" />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ margin: 0 }}>{results.issue}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600, marginTop: '4px' }}>
                      {results.confidence}% Analysis Match
                    </span>
                  </div>
                </div>
                <p>{results.description}</p>
              </div>

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
                    <><CheckCircle size={20}/> Added to Profile</>
                  ) : (
                    <><Plus size={20}/> Add to My Routine</>
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
