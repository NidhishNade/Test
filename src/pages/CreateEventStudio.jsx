import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import EventCard from '../components/EventCard';

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80', label: 'Technology' },
  { url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80', label: 'Music' },
  { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', label: 'Social' },
  { url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80', label: 'Outdoors' },
  { url: 'https://images.unsplash.com/photo-1531050171651-a3a4ca0b740a?auto=format&fit=crop&w=800&q=80', label: 'Wellness' },
  { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80', label: 'Art' },
];

const STEPS = ['Details', 'Visuals', 'Launch'];

export default function CreateEventStudio({ setView, handleCreate, formState, setFormState, isSubmitting }) {
  const [activeStep, setActiveStep] = useState(0);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const descMax = 280;

  const descLen = formState.description?.length || 0;

  return (
    <div className="studio-container">

      {/* ── Step progress indicator ────────────────── */}
      <div className="studio-progress-bar">
        <div className="container studio-progress-inner">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`studio-step ${i <= activeStep ? 'active' : ''} ${i < activeStep ? 'done' : ''}`}>
                <div className="studio-step-dot">{i < activeStep ? '✓' : i + 1}</div>
                <span className="studio-step-label">{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`studio-step-line ${i < activeStep ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="studio-grid">
        {/* ── Form side ─────────────────────────── */}
        <div className="studio-form-side">
          <button
            onClick={() => setView('dashboard')}
            className="studio-back-btn"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <h1 className="studio-title">Event Studio</h1>
          <p className="studio-subtitle">Build an event the community won't forget.</p>

          {/* Mobile preview toggle */}
          <button
            className="studio-preview-toggle"
            onClick={() => setShowMobilePreview(v => !v)}
          >
            {showMobilePreview ? 'Hide Preview' : 'Show Preview'}
          </button>

          {/* Mobile preview panel */}
          {showMobilePreview && (
            <div className="studio-mobile-preview">
              <p className="studio-preview-label">Live Preview</p>
              <EventCard event={formState} isPreview />
            </div>
          )}

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* ── Step 1: Details ───────────────── */}
            <div className="studio-section">
              <p className="studio-section-label">Event Details</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                <input
                  className="studio-input"
                  value={formState.title}
                  onChange={e => { setFormState({ ...formState, title: e.target.value }); setActiveStep(Math.max(activeStep, 0)); }}
                  placeholder="Event title"
                  required
                  aria-label="Event title"
                />
                <div style={{ position: 'relative' }}>
                  <textarea
                    className="studio-input"
                    value={formState.description}
                    onChange={e => {
                      if (e.target.value.length <= descMax) {
                        setFormState({ ...formState, description: e.target.value });
                        setActiveStep(Math.max(activeStep, 0));
                      }
                    }}
                    rows="3"
                    placeholder="What's the vibe? What should people bring?"
                    required
                    aria-label="Event description"
                    style={{ resize: 'vertical' }}
                  />
                  <span className={`studio-char-counter ${descLen > descMax * 0.85 ? 'warn' : ''}`}>
                    {descLen}/{descMax}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Date + Location ───────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p className="studio-section-label" style={{ marginBottom: '0.5rem' }}>Date & Time</p>
                <input
                  className="studio-input"
                  type="datetime-local"
                  value={formState.date}
                  onChange={e => { setFormState({ ...formState, date: e.target.value }); setActiveStep(Math.max(activeStep, 1)); }}
                  required
                  aria-label="Event date and time"
                />
              </div>
              <div>
                <p className="studio-section-label" style={{ marginBottom: '0.5rem' }}>Location</p>
                <input
                  className="studio-input"
                  value={formState.location}
                  onChange={e => setFormState({ ...formState, location: e.target.value })}
                  placeholder="Venue or city"
                  required
                  aria-label="Event location"
                />
              </div>
            </div>

            {/* ── Max Attendees + Price ────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <p className="studio-section-label" style={{ marginBottom: '0.5rem' }}>
                  Max Attendees <span style={{ fontWeight: 600, textTransform: 'none', opacity: 0.6 }}>(optional)</span>
                </p>
                <input
                  className="studio-input"
                  type="number"
                  min="2"
                  max="10000"
                  value={formState.maxAttendees || ''}
                  onChange={e => setFormState({ ...formState, maxAttendees: e.target.value })}
                  placeholder="Unlimited"
                  aria-label="Maximum attendees"
                />
              </div>
              <div>
                <p className="studio-section-label" style={{ marginBottom: '0.5rem' }}>
                  Ticket Price <span style={{ fontWeight: 600, textTransform: 'none', opacity: 0.6 }}>(USD $)</span>
                </p>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>$</span>
                  <input
                    className="studio-input"
                    type="number"
                    min="0"
                    step="0.01"
                    style={{ paddingLeft: '2rem' }}
                    value={formState.price || ''}
                    onChange={e => setFormState({ ...formState, price: e.target.value })}
                    placeholder="0.00 (Free)"
                    aria-label="Event ticket price"
                  />
                </div>
              </div>
            </div>

            {/* ── Visual Theme ──────────────────── */}
            <div>
              <p className="studio-section-label" style={{ marginBottom: '1rem' }}>
                Visual Theme
                {formState.image && (
                  <span className="studio-selected-badge">{formState.category} selected</span>
                )}
              </p>
              <div className="preset-grid">
                {IMAGES.map(img => (
                  <div
                    key={img.url}
                    onClick={() => { setFormState({ ...formState, image: img.url, category: img.label }); setActiveStep(Math.max(activeStep, 1)); }}
                    className={`preset-thumb ${formState.image === img.url ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${img.label} theme`}
                    onKeyDown={e => e.key === 'Enter' && setFormState({ ...formState, image: img.url, category: img.label })}
                    title={img.label}
                  >
                    <img src={img.url} alt={img.label} />
                    <div className="preset-thumb-label">{img.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary studio-submit-btn"
              disabled={isSubmitting}
              onClick={() => setActiveStep(2)}
            >
              {isSubmitting
                ? <><Loader2 size={18} className="animate-spin" /> Launching…</>
                : <>Launch Event <ChevronRight size={18} strokeWidth={3} /></>
              }
            </button>
          </form>
        </div>

        {/* ── Preview side (desktop) ─────────────── */}
        <div className="studio-preview-side">
          <div className="preview-sticky">
            <div className="preview-header">
              <div className="preview-header-line" />
              <span className="preview-header-label">Live Preview</span>
              <div className="preview-header-line" />
            </div>

            <div className="preview-badge">Preview Mode</div>
            <EventCard event={formState} isPreview />

            <div className="studio-pro-tip">
              <div className="studio-pro-tip-icon">
                <Sparkles size={14} color="white" />
              </div>
              <h4 className="studio-pro-tip-title">Pro Tip 🏛️</h4>
              <p className="studio-pro-tip-text">
                A great title sparks curiosity. Pick a visual theme that matches your event's energy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
