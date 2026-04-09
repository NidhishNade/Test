import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, Search, MapPin,
  Music, Monitor, Coffee, Mountain, Flower2, Palette, Gamepad2,
  ChevronRight, Star, Users, X
} from 'lucide-react';

import stepFindImg from '../assets/step_find.png';
import stepMeetImg from '../assets/step_meet.png';
import stepHostImg from '../assets/step_host.png';
import badgeMusicImg from '../assets/badge_music.png';
import badgeTechImg from '../assets/badge_tech.png';
import badgeYogaImg from '../assets/badge_yoga.png';
import avatar1 from '../assets/avatar_1.png';
import avatar2 from '../assets/avatar_2.png';
import avatar3 from '../assets/avatar_3.png';
import avatar4 from '../assets/avatar_4.png';
import imgCatMusic from '../assets/cat_music_1775776582134.png';
import imgCatTech from '../assets/cat_technology_1775776595314.png';
import imgCatSocial from '../assets/cat_social_1775776607879.png';
import imgCatOutdoors from '../assets/cat_outdoors_1775776625053.png';
import imgCatWellness from '../assets/cat_wellness_1775776639827.png';
import imgCatArt from '../assets/cat_art_1775776662842.png';

const CATEGORY_ICONS = {
  Music: Music, Technology: Monitor, Social: Coffee,
  Outdoors: Mountain, Wellness: Flower2, Art: Palette, Gaming: Gamepad2,
};

const CATEGORY_IMAGES = {
  Music: imgCatMusic,
  Technology: imgCatTech,
  Social: imgCatSocial,
  Outdoors: imgCatOutdoors,
  Wellness: imgCatWellness,
  Art: imgCatArt,
  Gaming: null,
};

const CATEGORY_COLORS = {
  Music:      { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: 'rgba(124,58,237,0.25)' },
  Technology: { bg: 'rgba(37,99,235,0.12)',  color: '#2563eb', border: 'rgba(37,99,235,0.25)' },
  Social:     { bg: 'rgba(217,119,6,0.12)',  color: '#d97706', border: 'rgba(217,119,6,0.25)' },
  Outdoors:   { bg: 'rgba(22,163,74,0.12)',  color: '#16a34a', border: 'rgba(22,163,74,0.25)' },
  Wellness:   { bg: 'rgba(219,39,119,0.12)', color: '#db2777', border: 'rgba(219,39,119,0.25)' },
  Art:        { bg: 'rgba(234,88,12,0.12)',  color: '#ea580c', border: 'rgba(234,88,12,0.25)' },
  Gaming:     { bg: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: 'rgba(124,58,237,0.25)' },
};

const HERO_BADGES = [
  { img: badgeMusicImg, title: 'Jazz Night at Blue Note',  meta: 'Tonight · Soho',        color: '#1e1040', delay: '0ms' },
  { img: badgeTechImg, title: 'React & Coffee Meetup',    meta: 'Tomorrow · Shoreditch', color: '#0a2035', delay: '150ms' },
  { img: badgeYogaImg, title: 'Sunday Morning Yoga',      meta: 'Sun · Hyde Park',       color: '#0a2a1a', delay: '300ms' },
];

const HOW_STEPS = [
  { n: '01', title: 'Find your interest',  desc: 'Browse events across every category—music, tech, outdoors, and more.', img: stepFindImg },
  { n: '02', title: 'Meet your people',    desc: 'RSVP and connect with others who share your passions in real life.',   img: stepMeetImg },
  { n: '03', title: 'Host your own',       desc: 'Launch an event with our studio tool in under two minutes.',           img: stepHostImg },
];

/* ── Intersection Observer scroll-reveal hook ─────── */
function useReveal(threshold = 0.18) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

/* ── Individual scroll-reveal step card ───────────── */
function HowStepCard({ step, index }) {
  const [ref, visible] = useReveal(0.15);

  return (
    <div
      ref={ref}
      className="how-step-card"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.55s ease ${index * 120}ms, transform 0.55s ease ${index * 120}ms`,
      }}
    >
      <div className="how-step-icon-wrap">
        <img src={step.img} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <div className="step-number">{step.n}</div>
      <h3 className="how-step-title">{step.title}</h3>
      <p className="how-step-desc">{step.desc}</p>
    </div>
  );
}

export default function LandingPage({ setShowAuth, setIsLogin }) {
  const [searchQuery, setSearchQuery]   = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activePreviewCategory, setActivePreviewCategory] = useState(null);

  return (
    <div className="animate-slide-up">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            {/* Left copy */}
            <div className="hero-copy">
              <span className="hero-badge-pill">
                <Zap size={12} /> Thousands of events near you
              </span>

              <h1 className="hero-heading">
                The platform where<br />
                interests become<br />
                <span style={{ color: 'var(--m-red)' }}>friendships.</span>
              </h1>

              <p className="hero-subtext">
                From hiking and reading to networking and skill-sharing—
                thousands of people who share your passions are waiting.
              </p>

              <div className="hero-cta-row hero-cta-group">
                <button
                  onClick={() => { setShowAuth(true); setIsLogin(false); }}
                  className="btn-primary hero-cta-primary"
                >
                  Join free today <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => { setShowAuth(true); setIsLogin(true); }}
                  className="hero-cta-secondary"
                >
                  Sign in
                </button>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                {[
                  { n: '50K+',   l: 'Members',       icon: <Users size={16} /> },
                  { n: '1,200+', l: 'Monthly events', icon: <Star  size={16} /> },
                  { n: '40+',    l: 'Cities',         icon: <MapPin size={16} /> },
                ].map(s => (
                  <div className="hero-stat" key={s.l}>
                    <span className="hero-stat-number">{s.n}</span>
                    <span className="hero-stat-label">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: floating event badges */}
            <div className="hero-badges-panel">
              <div className="hero-badges-inner">
                {HERO_BADGES.map(b => (
                  <div
                    className="hero-badge"
                    key={b.title}
                    style={{ animationDelay: b.delay, cursor: 'pointer' }}
                    onClick={() => setSelectedEvent(b)}
                  >
                    <div className="hero-badge-icon" style={{ background: b.color }}>
                      <img src={b.img} alt="Badge" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div className="hero-badge-text">
                      <p className="hero-badge-title">{b.title}</p>
                      <p className="hero-badge-meta">{b.meta}</p>
                    </div>
                    <div className="hero-badge-arrow">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}

                {/* Live glass card */}
                <div className="hero-glass-card">
                  <div className="hero-glass-row">
                    <div className="hero-glass-dot" style={{ background: '#22c55e' }} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
                      Live near you
                    </span>
                  </div>
                  <p style={{ fontSize: '1.375rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>
                    12 events<br />this weekend
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ── Search Bridge + Search Bar ─────────────────── */}
      <div className="search-bridge">
        <div className="container landing-search-wrapper">
          <div className="search-container">
            <div className="search-field">
              <Search style={{ color: 'var(--m-red)', flexShrink: 0 }} size={18} />
              <input
                type="text"
                placeholder='Search for "Design Workshop"'
                className="search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search events"
              />
            </div>
            <div className="search-divider" />
            <div className="search-field">
              <MapPin style={{ color: 'var(--m-teal)', flexShrink: 0 }} size={18} />
              <input
                type="text"
                placeholder="Your city"
                className="search-input"
                value={locationQuery}
                onChange={e => setLocationQuery(e.target.value)}
                aria-label="Enter your city"
              />
            </div>
            <button className="btn-primary" style={{ padding: '13px 30px', flexShrink: 0, borderRadius: 'var(--radius-full)' }}>
              Find Events
            </button>
          </div>
        </div>
      </div>


      {/* ── Browse by Category ────────────────────────── */}
      <section className="section-categories">
        <div className="container">
          <p className="section-label" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            Browse by interest
          </p>
          <div className="categories-row">
            {Object.entries(CATEGORY_ICONS).map(([cat, Icon]) => {
              const theme = CATEGORY_COLORS[cat] || {};
              return (
                <button
                  key={cat}
                  onClick={() => setActivePreviewCategory(activePreviewCategory === cat ? null : cat)}
                  className={`category-pill-rich ${activePreviewCategory === cat ? 'active' : ''}`}
                  style={{
                    '--cat-bg':     theme.bg,
                    '--cat-color':  theme.color,
                    '--cat-border': theme.border,
                  }}
                >
                  <Icon size={14} />
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Dynamic Category Preview Panel */}
          <div className={`category-preview-panel ${activePreviewCategory ? 'open' : ''}`}>
            {activePreviewCategory && CATEGORY_COLORS[activePreviewCategory] && (
              <div 
                className="category-preview-content"
                style={{ 
                  background: CATEGORY_COLORS[activePreviewCategory].bg,
                  borderColor: CATEGORY_COLORS[activePreviewCategory].border 
                }}
              >
                <div className="preview-info">
                  <h3 style={{ color: CATEGORY_COLORS[activePreviewCategory].color, fontSize: '1.5rem', marginBottom: '8px' }}>
                    {activePreviewCategory} Events
                  </h3>
                  <p style={{ color: 'var(--m-text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                    Discover live events, connect with enthusiasts, and be part of the community.
                  </p>
                  <button 
                    className="btn-primary preview-cta"
                    style={{
                      background: CATEGORY_COLORS[activePreviewCategory].color,
                      boxShadow: `0 4px 14px ${CATEGORY_COLORS[activePreviewCategory].border}`
                    }}
                    onClick={() => { setShowAuth(true); setIsLogin(false); }}
                  >
                    Explore {activePreviewCategory}
                  </button>
                </div>
                <div className="preview-graphic">
                  {(() => {
                    const PreviewImg = CATEGORY_IMAGES[activePreviewCategory];
                    if (PreviewImg) {
                      return <img src={PreviewImg} alt={activePreviewCategory} style={{ width: '220px', height: '220px', objectFit: 'contain', filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.4))' }} />;
                    }
                    const PreviewIcon = CATEGORY_ICONS[activePreviewCategory];
                    return <PreviewIcon size={80} style={{ color: CATEGORY_COLORS[activePreviewCategory].color, opacity: 0.15 }} />;
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How it works — scroll-reveal ──────────────── */}
      <section className="section-how">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Getting started</p>
            <h2 className="section-heading">Your next adventure in 3 steps</h2>
          </div>

          <div className="how-steps-grid">
            {HOW_STEPS.map((step, i) => (
              <HowStepCard key={step.n} step={step} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Event Quick-View Modal */}
      {selectedEvent && (
        <div className="event-preview-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-preview-modal animate-slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
              <X size={20} />
            </button>
            <div className="modal-header-img" style={{ background: selectedEvent.color }}>
              <img src={selectedEvent.img} alt={selectedEvent.title} />
            </div>
            <div className="modal-body">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '4px', color: 'white' }}>{selectedEvent.title}</h2>
              <p className="modal-meta" style={{ color: 'var(--m-text-muted)', marginBottom: '24px' }}>{selectedEvent.meta}</p>
              
              <div className="modal-fake-details" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
                  <Users size={16} style={{ color: 'var(--m-teal)' }}/> <span>48 people attending</span>
                </div>
                <div className="detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
                  <Zap size={16} style={{ color: 'var(--m-red)' }}/> <span>Selling out fast</span>
                </div>
              </div>
              
              <button 
                className="btn-primary modal-cta"
                style={{ width: '100%', padding: '16px' }}
                onClick={() => { setSelectedEvent(null); setShowAuth(true); setIsLogin(false); }}
              >
                Join free to RSVP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="section-cta">
        <div className="cta-card">
          {/* Orbs */}
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />

          <div className="container cta-inner">
            {/* Social proof */}
            <div className="cta-social-proof">
              <div className="cta-avatar-stack">
                {[avatar1, avatar2, avatar3, avatar4].map((src, i) => (
                  <div key={src} className="cta-avatar" style={{ marginLeft: i > 0 ? '-10px' : 0 }}>
                    <img src={src} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <span className="cta-social-text">Join 50,000+ members worldwide</span>
            </div>

            <h2 className="cta-heading">Your next adventure starts right here.</h2>
            <p className="cta-subtext">
              Meet new people who share your interests through thousands of events daily.
            </p>

            {/* Shimmer CTA button */}
            <button
              onClick={() => { setShowAuth(true); setIsLogin(false); }}
              className="btn-primary cta-btn cta-btn-shimmer"
            >
              Get started — it's free <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
