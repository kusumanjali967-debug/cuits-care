import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, BookOpen, Sparkles, Save, CalendarDays, Tag } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import './SkinDiary.css';

const STORAGE_KEY = 'cuitsCare_diary';

const MOODS = [
  { emoji: '🤩', label: 'Amazing', color: '#f59e0b' },
  { emoji: '😊', label: 'Good',    color: '#678b66' },
  { emoji: '😐', label: 'Okay',    color: '#8b8bae' },
  { emoji: '😟', label: 'Bad',     color: '#d88c7d' },
  { emoji: '😣', label: 'Awful',   color: '#cf6679' },
];

const TAGS = [
  { label: 'Breakout',  color: '#cf6679', bg: 'rgba(207,102,121,0.12)' },
  { label: 'Glowing',   color: '#678b66', bg: 'rgba(103,139,102,0.12)' },
  { label: 'Dry',       color: '#a06b3c', bg: 'rgba(160,107,60,0.12)'  },
  { label: 'Oily',      color: '#7b5ea7', bg: 'rgba(123,94,167,0.12)'  },
  { label: 'Irritated', color: '#d88c7d', bg: 'rgba(216,140,125,0.12)' },
  { label: 'Great Day', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
];

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });
}

function formatTime(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function SkinDiary() {
  const navigate = useNavigate();

  const [entries, setEntries]           = useState([]);
  const [note, setNote]                 = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [saved, setSaved]               = useState(false);
  const [deletingId, setDeletingId]     = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const persistEntries = (updated) => {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleTag = (label) => {
    setSelectedTags(prev =>
      prev.includes(label) ? prev.filter(t => t !== label) : [...prev, label]
    );
  };

  const handleSave = () => {
    const trimmed = note.trim();
    if (!trimmed && !selectedMood && selectedTags.length === 0) return;

    const now = new Date().toISOString();
    const entry = {
      id:      Date.now().toString(),
      date:    now,
      dateStr: formatDate(now),
      timeStr: formatTime(now),
      mood:    selectedMood,
      tags:    [...selectedTags],
      note:    trimmed,
    };

    persistEntries([entry, ...entries]);
    setNote('');
    setSelectedMood(null);
    setSelectedTags([]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      persistEntries(entries.filter(e => e.id !== id));
      setDeletingId(null);
    }, 380);
  };

  const moodForEntry = (moodEmoji) => MOODS.find(m => m.emoji === moodEmoji) || null;
  const canSave = note.trim().length > 0 || selectedMood !== null || selectedTags.length > 0;

  return (
    <div className="diary-container pb-nav fade-in">

      {/* Header */}
      <div className="diary-header pad-screen">
        <button
          className="diary-back-btn hover-lift"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="diary-header-text">
          <h2 className="diary-title">
            Skin Diary <span className="diary-title-icon">📓</span>
          </h2>
          <p className="diary-subtitle">Track your skin's daily story</p>
        </div>
        <div className="diary-header-icon">
          <BookOpen size={22} strokeWidth={1.8} />
        </div>
      </div>

      <div className="pad-screen diary-content">

        {/* Write Entry Card */}
        <div className="glass-panel diary-write-card scale-in">
          <div className="diary-write-header">
            <CalendarDays size={16} strokeWidth={2} className="diary-write-icon" />
            <span className="diary-today-label">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </span>
          </div>

          <textarea
            ref={textareaRef}
            className="diary-textarea input-field"
            placeholder={"How is your skin feeling today? ✍️\nDescribe any changes, new products tried, reactions…"}
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
          />

          <div className="diary-section-label">
            <span>How does your skin feel?</span>
          </div>
          <div className="diary-mood-row">
            {MOODS.map(m => (
              <button
                key={m.emoji}
                className={`diary-mood-btn${selectedMood === m.emoji ? ' diary-mood-active' : ''}`}
                style={selectedMood === m.emoji ? { borderColor: m.color, background: `${m.color}1a` } : {}}
                onClick={() => setSelectedMood(prev => prev === m.emoji ? null : m.emoji)}
                title={m.label}
              >
                <span className="diary-mood-emoji">{m.emoji}</span>
                <span className="diary-mood-label">{m.label}</span>
              </button>
            ))}
          </div>

          <div className="diary-section-label">
            <Tag size={13} strokeWidth={2.5} />
            <span>Quick tags</span>
          </div>
          <div className="diary-tags-row">
            {TAGS.map(tag => {
              const active = selectedTags.includes(tag.label);
              return (
                <button
                  key={tag.label}
                  className={`diary-tag-chip${active ? ' diary-tag-active' : ''}`}
                  style={active
                    ? { background: tag.bg, color: tag.color, borderColor: tag.color }
                    : {}
                  }
                  onClick={() => toggleTag(tag.label)}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>

          <button
            className={`btn-primary diary-save-btn${saved ? ' diary-save-success' : ''}`}
            onClick={handleSave}
            disabled={!canSave}
          >
            {saved ? (
              <>&#x2705; Entry Saved!</>
            ) : (
              <>
                <Save size={18} strokeWidth={2.5} />
                Save Entry
              </>
            )}
          </button>
        </div>

        {/* Entries List */}
        <div className="diary-entries-section">
          <div className="diary-entries-header">
            <h3 className="diary-entries-title">Past Entries</h3>
            {entries.length > 0 && (
              <span className="diary-entries-count">{entries.length}</span>
            )}
          </div>

          {entries.length === 0 ? (
            <div className="diary-empty glass-panel">
              <div className="diary-empty-sparkle">
                <Sparkles size={36} strokeWidth={1.5} />
              </div>
              <p className="diary-empty-title">Your skin story starts here</p>
              <p className="diary-empty-sub">
                Write your first entry above &mdash; every entry helps you understand your skin better &#127800;
              </p>
            </div>
          ) : (
            <div className="diary-entries-list">
              {entries.map((entry, idx) => {
                const moodInfo  = entry.mood ? moodForEntry(entry.mood) : null;
                const isDeleting = deletingId === entry.id;
                return (
                  <div
                    key={entry.id}
                    className={`diary-entry-card glass-panel${isDeleting ? ' diary-entry-deleting' : ' diary-entry-enter'}`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="diary-entry-top">
                      <div className="diary-entry-meta">
                        <span className="diary-entry-date">{entry.dateStr}</span>
                        <span className="diary-entry-time">{entry.timeStr}</span>
                      </div>
                      <div className="diary-entry-right">
                        {moodInfo && (
                          <span
                            className="diary-entry-mood"
                            title={moodInfo.label}
                            style={{ background: `${moodInfo.color}18` }}
                          >
                            {moodInfo.emoji}
                          </span>
                        )}
                        <button
                          className="diary-delete-btn hover-lift"
                          onClick={() => handleDelete(entry.id)}
                          aria-label="Delete entry"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </div>
                    </div>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="diary-entry-tags">
                        {entry.tags.map(tagLabel => {
                          const tagInfo = TAGS.find(t => t.label === tagLabel);
                          return (
                            <span
                              key={tagLabel}
                              className="diary-entry-tag-pill"
                              style={tagInfo ? {
                                color: tagInfo.color,
                                background: tagInfo.bg,
                                border: `1px solid ${tagInfo.color}44`,
                              } : {}}
                            >
                              {tagLabel}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {entry.note ? (
                      <p className="diary-entry-note">{entry.note}</p>
                    ) : (
                      <p className="diary-entry-note diary-note-empty">No note written</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
