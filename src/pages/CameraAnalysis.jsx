import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, CheckCircle, Search, AlertCircle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import './CameraAnalysis.css';

export default function CameraAnalysis() {
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
        setResults({
          issue: "Mild redness & Dehydration",
          description: "We detected some dry patches on your cheeks and slight inflammation.",
          recommendation: "Try a hydrating serum with Hyaluronic Acid and Centella Asiatica."
        });
      }, 2500);
    }
  };

  const retakePhoto = () => {
    setImgSrc(null);
    setResults(null);
    startCamera();
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
            <button className="retake-btn glass-panel" onClick={retakePhoto}>
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
                <div className="diag-header">
                  <AlertCircle size={28} color="var(--accent)" />
                  <h3>{results.issue}</h3>
                </div>
                <p>{results.description}</p>
              </div>

              <div className="glass-panel recommendation-box stack-y">
                <h4>Suggested Action</h4>
                <div className="suggested-product">
                  <div className="check-icon"><CheckCircle size={24} color="var(--success)" /></div>
                  <p>{results.recommendation}</p>
                </div>
                <button className="btn-primary" style={{ marginTop: '12px' }}>Shop Suggested Products</button>
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
