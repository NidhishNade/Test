import React, { useState } from 'react';
import { Github, Instagram, Twitter, Linkedin, MapPin } from 'lucide-react';

const COLS = [
  {
    title: 'Navigate',
    links: ['Find Groups', 'Top Events', 'Start Hosting', 'Blog'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Safety Hub', 'Terms of Use', 'Privacy Policy'],
  },
  {
    title: 'Company',
    links: ['Our Story', 'Careers', 'Press Kit', 'Partners'],
  },
];

const SOCIALS = [
  { Icon: Instagram, label: 'Instagram', href: '#' },
  { Icon: Twitter,   label: 'Twitter / X', href: '#' },
  { Icon: Linkedin,  label: 'LinkedIn', href: '#' },
  { Icon: Github,    label: 'GitHub', href: '#' },
];

const CITIES = ['London', 'Tokyo', 'Berlin', 'New York', 'Sydney', 'Amsterdam'];

export default function Footer() {
  const [nlEmail, setNlEmail] = useState('');
  const [nlDone, setNlDone]   = useState(false);

  const handleNl = (e) => {
    e.preventDefault();
    if (!nlEmail) return;
    setNlDone(true);
    setNlEmail('');
    setTimeout(() => setNlDone(false), 4000);
  };

  return (
    <footer className="footer">
      {/* ── Top section ────────────────────────── */}
      <div className="container">
        <div className="footer-top">
          {/* Brand + social */}
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <span style={{ color: 'var(--m-red)' }}>E</span>ventify
            </div>
            <p className="footer-tagline">
              The premier community platform connecting people through passion, one event at a time.
            </p>
            <div className="footer-social-row">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="footer-social-btn"
                  aria-label={label}
                  rel="noreferrer noopener"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav link columns */}
          <div className="footer-links-grid">
            {COLS.map(col => (
              <div className="footer-links-col" key={col.title}>
                <h4>{col.title}</h4>
                {col.links.map(l => (
                  <a key={l} href="#" className="footer-link">{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter ────────────────────────── */}
      <div className="footer-newsletter">
        <div className="container">
          <div className="footer-nl-copy">
            <h4>Weekly event picks 🎯</h4>
            <p>Handpicked events delivered to your inbox every Friday.</p>
          </div>
          <form className="footer-nl-form" onSubmit={handleNl}>
            {nlDone ? (
              <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>
                ✓ You're subscribed! Check your inbox.
              </p>
            ) : (
              <>
                <input
                  type="email"
                  className="footer-nl-input"
                  placeholder="your@email.com"
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="footer-nl-btn">
                  Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────── */}
      <div className="container">
        <div className="footer-bottom">
          <p>© 2026 Eventify. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy</a>
            <a href="#" className="footer-bottom-link">Terms</a>
            <a href="#" className="footer-bottom-link">Cookies</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <MapPin size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
            {CITIES.map((c, i) => (
              <React.Fragment key={c}>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{c}</span>
                {i < CITIES.length - 1 && (
                  <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem' }}>·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
