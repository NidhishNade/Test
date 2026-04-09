import React, { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, Search, MapPin,
  Music, Monitor, Coffee, Mountain, Flower2, Palette, Gamepad2,
  ChevronRight, Star, Users,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Music: Music, Technology: Monitor, Social: Coffee,
  Outdoors: Mountain, Wellness: Flower2, Art: Palette, Gaming: Gamepad2,
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
  { emoji: '🎵', title: 'Jazz Night at Blue Note',  meta: 'Tonight · Soho',        color: '#1e1040', delay: '0ms' },
  { emoji: '💻', title: 'React & Coffee Meetup',    meta: 'Tomorrow · Shoreditch', color: '#0a2035', delay: '150ms' },
  { emoji: '🧘', title: 'Sunday Morning Yoga',      meta: 'Sun · Hyde Park',       color: '#0a2a1a', delay: '300ms' },
];

const HOW_STEPS = [
  { n: '01', title: 'Find your interest',  desc: 'Browse events across every category—music, tech, outdoors, and more.', icon: '🔍' },
  { n: '02', title: 'Meet your people',    desc: 'RSVP and connect with others who share your passions in real life.',   icon: '🤝' },
  { n: '03', title: 'Host your own',       desc: 'Launch an event with our studio tool in under two minutes.',           icon: '🚀' },
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
      <div className="how-step-icon-wrap">{step.icon}</div>
      <div className="step-number">{step.n}</div>
      <h3 className="how-step-title">{step.title}</h3>
      <p className="how-step-desc">{step.desc}</p>
    </div>
  );
}

export default function LandingPage({ setShowAuth, setIsLogin }) {
  const [searchQuery, setSearchQuery]   = useState('');
  const [locationQuery, setLocationQuery] = useState('');

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
                    style={{ animationDelay: b.delay }}
                  >
                    <div className="hero-badge-icon" style={{ background: b.color }}>
                      {b.emoji}
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
                  className="category-pill-rich"
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
                {['A','B','C','D'].map((l, i) => (
                  <div key={l} className="cta-avatar" style={{ marginLeft: i > 0 ? '-10px' : 0 }}>{l}</div>
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
