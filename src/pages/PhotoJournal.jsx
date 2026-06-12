import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Camera, Upload, X, Save, Trash2,
  Image, ZoomIn, ChevronLeft, ChevronRight,
  Sparkles, CalendarDays, StickyNote, GitCompare,
  Plus, Check
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import './PhotoJournal.css';

const STORAGE_KEY = 'cuitsCare_photos';

function loadPhotos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePhotos(photos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });
}

function formatDateShort(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
}

export default function PhotoJournal() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [photos, setPhotos] = useState(loadPhotos);
  const [mode, setMode] = useState('gallery'); // 'gallery' | 'source-picker' | 'camera' | 'preview' | 'lightbox'
  const [capturedImage, setCapturedImage] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [cameraFacing, setCameraFacing] = useState('user');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);

  // ── Stop camera stream helper ──────────────────────────────────────────────
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsStreamReady(false);
  }, []);

  // ── Open camera ────────────────────────────────────────────────────────────
  const openCamera = useCallback(async (facing = cameraFacing) => {
    setCameraError('');
    setIsStreamReady(false);
    setMode('camera');
    try {
      stopStream();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsStreamReady(true);
        };
      }
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission or use the upload option.');
      console.warn('getUserMedia error:', err);
    }
  }, [cameraFacing, stopStream]);

  // ── Flip camera ────────────────────────────────────────────────────────────
  const flipCamera = () => {
    const next = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(next);
    openCamera(next);
  };

  // ── Capture photo from video ────────────────────────────────────────────────
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    // Mirror if front camera
    if (cameraFacing === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopStream();
    setCapturedImage(dataUrl);
    setNoteText('');
    setMode('preview');
  };

  // ── File picker ─────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCapturedImage(ev.target.result);
      setNoteText('');
      setMode('preview');
    };
    reader.readAsDataURL(file);
    // reset so same file can be picked again
    e.target.value = '';
  };

  // ── Save to journal ──────────────────────────────────────────────────────────
  const savePhoto = () => {
    if (!capturedImage) return;
    setIsSaving(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      const newPhoto = {
        id: Date.now().toString(),
        date: now,
        dateStr: formatDate(now),
        imageData: capturedImage,
        note: noteText.trim(),
      };
      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      savePhotos(updated);
      setCapturedImage(null);
      setNoteText('');
      setIsSaving(false);
      setSaveSuccess(true);
      setMode('gallery');
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 600);
  };

  // ── Delete photo ─────────────────────────────────────────────────────────────
  const deletePhoto = (id) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    savePhotos(updated);
    setDeleteConfirm(null);
    if (mode === 'lightbox') {
      if (updated.length === 0) {
        setMode('gallery');
      } else {
        setLightboxIndex(prev => Math.min(prev, updated.length - 1));
      }
    }
  };

  // ── Lightbox navigation ──────────────────────────────────────────────────────
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setMode('lightbox');
  };

  const lightboxPrev = () => setLightboxIndex(i => (i > 0 ? i - 1 : photos.length - 1));
  const lightboxNext = () => setLightboxIndex(i => (i < photos.length - 1 ? i + 1 : 0));

  // ── Keyboard handling for lightbox ──────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'lightbox') return;
    const handler = (e) => {
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'Escape') setMode('gallery');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [mode, photos.length]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => () => stopStream(), [stopStream]);

  // ── Discard preview ──────────────────────────────────────────────────────────
  const discardPreview = () => {
    setCapturedImage(null);
    setNoteText('');
    setMode('gallery');
  };

  const firstPhoto = photos[photos.length - 1];
  const latestPhoto = photos[0];
  const hasBeforeAfter = photos.length >= 2;

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER — Source Picker Sheet
  // ════════════════════════════════════════════════════════════════════════════
  const renderSourcePicker = () => (
    <div className="pj-sheet-overlay" onClick={() => setMode('gallery')}>
      <div className="pj-sheet scale-in" onClick={e => e.stopPropagation()}>
        <div className="pj-sheet-handle" />
        <h3 className="pj-sheet-title">Add a Photo</h3>
        <p className="pj-sheet-sub">Choose how you'd like to capture your skin today</p>
        <div className="pj-source-options">
          <button className="pj-source-btn hover-lift" onClick={() => openCamera()}>
            <div className="pj-source-icon pj-source-icon--camera">
              <Camera size={28} />
            </div>
            <span className="pj-source-label">Take Photo</span>
            <span className="pj-source-desc">Use your camera</span>
          </button>
          <button
            className="pj-source-btn hover-lift"
            onClick={() => { setMode('gallery'); fileInputRef.current?.click(); }}
          >
            <div className="pj-source-icon pj-source-icon--upload">
              <Upload size={28} />
            </div>
            <span className="pj-source-label">Upload Photo</span>
            <span className="pj-source-desc">From your gallery</span>
          </button>
        </div>
        <button className="pj-sheet-cancel" onClick={() => setMode('gallery')}>Cancel</button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER — Camera View
  // ════════════════════════════════════════════════════════════════════════════
  const renderCamera = () => (
    <div className="pj-camera-fullscreen fade-in">
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="pj-camera-topbar">
        <button className="pj-icon-btn pj-icon-btn--glass" onClick={() => { stopStream(); setMode('gallery'); }}>
          <X size={22} />
        </button>
        <span className="pj-camera-title">Capture Skin Photo</span>
        <button className="pj-icon-btn pj-icon-btn--glass" onClick={flipCamera}>
          <Camera size={22} />
        </button>
      </div>

      {cameraError ? (
        <div className="pj-camera-error">
          <Camera size={48} strokeWidth={1.2} />
          <p>{cameraError}</p>
          <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => { setMode('gallery'); fileInputRef.current?.click(); }}>
            <Upload size={18} /> Upload Instead
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className={`pj-camera-video ${cameraFacing === 'user' ? 'pj-mirrored' : ''}`}
          autoPlay
          playsInline
          muted
        />
      )}

      {!cameraError && (
        <div className="pj-camera-controls">
          <div className="pj-camera-hint">{isStreamReady ? 'Tap shutter to capture' : 'Starting camera\u2026'}</div>
          <button
            className={`pj-shutter-btn ${!isStreamReady ? 'pj-shutter-btn--disabled' : ''}`}
            onClick={capturePhoto}
            disabled={!isStreamReady}
          >
            <div className="pj-shutter-inner" />
          </button>
        </div>
      )}
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER — Preview & Note
  // ════════════════════════════════════════════════════════════════════════════
  const renderPreview = () => (
    <div className="pj-preview-fullscreen fade-in">
      <div className="pj-preview-topbar">
        <button className="pj-icon-btn pj-icon-btn--glass" onClick={discardPreview}>
          <X size={22} />
        </button>
        <span className="pj-camera-title">Preview</span>
        <div style={{ width: 44 }} />
      </div>

      <div className="pj-preview-image-wrap">
        <img src={capturedImage} alt="Preview" className="pj-preview-image" />
        <div className="pj-preview-date-badge">
          <CalendarDays size={13} />
          <span>{formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      <div className="pj-preview-form glass-panel">
        <div className="pj-note-label">
          <StickyNote size={16} />
          <span>Add a note <span className="pj-optional">(optional)</span></span>
        </div>
        <textarea
          className="input-field pj-note-input"
          placeholder="e.g. Day 7 of new routine, skin feeling smoother\u2026"
          value={noteText}
          onChange={e => setNoteText(e.target.value)}
          rows={3}
          maxLength={200}
        />
        <div className="pj-char-count">{noteText.length}/200</div>

        <button
          className="btn-primary pj-save-btn"
          onClick={savePhoto}
          disabled={isSaving}
        >
          {isSaving ? (
            <><span className="pj-spinner" /> Saving\u2026</>
          ) : (
            <><Save size={20} /> Save to Journal</>
          )}
        </button>
        <button className="btn-secondary" onClick={discardPreview}>
          Discard
        </button>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER — Lightbox
  // ════════════════════════════════════════════════════════════════════════════
  const renderLightbox = () => {
    const photo = photos[lightboxIndex];
    if (!photo) return null;
    return (
      <div className="pj-lightbox fade-in" onClick={() => setMode('gallery')}>
        <div className="pj-lightbox-inner" onClick={e => e.stopPropagation()}>
          <div className="pj-lightbox-topbar">
            <button className="pj-icon-btn pj-icon-btn--glass" onClick={() => setMode('gallery')}>
              <X size={22} />
            </button>
            <span className="pj-lb-counter">{lightboxIndex + 1} / {photos.length}</span>
            <button
              className="pj-icon-btn pj-icon-btn--danger"
              onClick={() => setDeleteConfirm(photo.id)}
            >
              <Trash2 size={20} />
            </button>
          </div>

          <div className="pj-lightbox-img-wrap">
            <img src={photo.imageData} alt={photo.dateStr} className="pj-lightbox-img" />
            {photos.length > 1 && (
              <>
                <button className="pj-lb-nav pj-lb-nav--left" onClick={lightboxPrev}>
                  <ChevronLeft size={26} />
                </button>
                <button className="pj-lb-nav pj-lb-nav--right" onClick={lightboxNext}>
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>

          <div className="pj-lightbox-info glass-panel">
            <div className="pj-lb-date">
              <CalendarDays size={15} />
              <span>{photo.dateStr}</span>
            </div>
            {photo.note && (
              <div className="pj-lb-note">
                <StickyNote size={14} />
                <span>{photo.note}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER — Gallery (main view)
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Camera view (full-screen) */}
      {mode === 'camera' && renderCamera()}

      {/* Preview view (full-screen) */}
      {mode === 'preview' && renderPreview()}

      {/* Lightbox overlay */}
      {mode === 'lightbox' && renderLightbox()}

      {/* Source picker bottom sheet */}
      {mode === 'source-picker' && renderSourcePicker()}

      {/* Delete confirm overlay */}
      {deleteConfirm && (
        <div className="pj-confirm-overlay fade-in">
          <div className="pj-confirm-card scale-in glass-panel">
            <div className="pj-confirm-icon"><Trash2 size={28} /></div>
            <h4>Delete Photo?</h4>
            <p>This cannot be undone. Your skin memory will be lost.</p>
            <div className="pj-confirm-actions">
              <button className="pj-confirm-cancel" onClick={() => setDeleteConfirm(null)}>Keep it</button>
              <button className="pj-confirm-delete" onClick={() => deletePhoto(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Gallery ─────────────────────────────────────────────────── */}
      <div className={`pj-container pb-nav ${mode !== 'gallery' && mode !== 'source-picker' ? 'pj-hidden' : ''} fade-in`}>

        {/* Header */}
        <div className="pj-header pad-screen">
          <button className="pj-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </button>
          <div className="pj-header-text">
            <h2 className="pj-title">Photo Journal <span>📸</span></h2>
            <p className="pj-subtitle">Track your skin transformation</p>
          </div>
        </div>

        {/* Success toast */}
        {saveSuccess && (
          <div className="pj-toast scale-in">
            <Check size={18} />
            <span>Photo saved to journal!</span>
          </div>
        )}

        {/* Add Photo CTA */}
        <div className="pad-screen" style={{ paddingTop: 0 }}>
          <button
            className="pj-add-btn btn-primary hover-lift"
            onClick={() => setMode('source-picker')}
          >
            <div className="pj-add-icon">
              <Plus size={22} />
            </div>
            <div className="pj-add-text">
              <span className="pj-add-label">Add Skin Photo</span>
              <span className="pj-add-hint">Camera or upload</span>
            </div>
          </button>
        </div>

        {/* Before & After Section */}
        {hasBeforeAfter && (
          <div className="pad-screen" style={{ paddingTop: 0 }}>
            <div className="pj-ba-card glass-panel">
              <div className="pj-ba-header" onClick={() => setShowBeforeAfter(v => !v)}>
                <div className="pj-ba-title-row">
                  <GitCompare size={18} />
                  <span>Before &amp; After</span>
                  <span className="pj-ba-badge">{photos.length} photos</span>
                </div>
                <ChevronRight
                  size={18}
                  className={`pj-ba-chevron ${showBeforeAfter ? 'pj-ba-chevron--open' : ''}`}
                />
              </div>
              {showBeforeAfter && (
                <div className="pj-ba-body scale-in">
                  <div className="pj-ba-grid">
                    <div className="pj-ba-item">
                      <div className="pj-ba-label-pill pj-ba-label-pill--before">BEFORE</div>
                      <img
                        src={firstPhoto.imageData}
                        alt="Before"
                        className="pj-ba-img"
                        onClick={() => openLightbox(photos.length - 1)}
                      />
                      <span className="pj-ba-date">{formatDateShort(firstPhoto.date)}</span>
                    </div>
                    <div className="pj-ba-divider">
                      <Sparkles size={20} />
                    </div>
                    <div className="pj-ba-item">
                      <div className="pj-ba-label-pill pj-ba-label-pill--after">NOW</div>
                      <img
                        src={latestPhoto.imageData}
                        alt="After"
                        className="pj-ba-img"
                        onClick={() => openLightbox(0)}
                      />
                      <span className="pj-ba-date">{formatDateShort(latestPhoto.date)}</span>
                    </div>
                  </div>
                  <p className="pj-ba-caption">
                    <Sparkles size={13} /> {photos.length} photo{photos.length !== 1 ? 's' : ''} captured &mdash; your journey is glowing ✨
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Photo Grid */}
        <div className="pad-screen" style={{ paddingTop: 0 }}>
          {photos.length === 0 ? (
            <div className="pj-empty fade-in">
              <div className="pj-empty-icon">
                <Image size={48} strokeWidth={1} />
              </div>
              <h3 className="pj-empty-title">Your Journal is Empty</h3>
              <p className="pj-empty-sub">
                Capture your first skin photo to start tracking your glow-up. Small steps lead to big transformations! 🌿
              </p>
            </div>
          ) : (
            <>
              <div className="pj-grid-header">
                <span className="pj-grid-count">{photos.length} photo{photos.length !== 1 ? 's' : ''}</span>
                <span className="pj-grid-hint">Tap to view</span>
              </div>
              <div className="pj-photo-grid">
                {photos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="pj-photo-card glass-panel scale-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="pj-photo-img-wrap" onClick={() => openLightbox(idx)}>
                      <img src={photo.imageData} alt={photo.dateStr} className="pj-photo-img" />
                      <div className="pj-photo-overlay">
                        <ZoomIn size={22} />
                      </div>
                      {idx === 0 && (
                        <div className="pj-photo-latest-badge">Latest</div>
                      )}
                    </div>

                    <div className="pj-photo-info">
                      <div className="pj-photo-date">
                        <CalendarDays size={12} />
                        <span>{formatDateShort(photo.date)}</span>
                      </div>
                      {photo.note && (
                        <p className="pj-photo-note">{photo.note}</p>
                      )}
                    </div>

                    <button
                      className="pj-photo-delete"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(photo.id); }}
                      aria-label="Delete photo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
