import React, { useState, useEffect, useRef } from 'react';
import { Plus, LogOut, LogIn, Menu, X, LayoutDashboard, Home } from 'lucide-react';

export default function Navbar({
  user, currentView,
  onSignIn, onSignUp, onSignOut,
  onNavigateDashboard, onNavigateStudio,
}) {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on view change
  useEffect(() => setMobileOpen(false), [currentView]);

  // Close drawer on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const initial = (user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?').toUpperCase();
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Member';

  return (
    <>
      {/* ── Navbar ───────────────────────────── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">

          {/* Logo */}
          <button
            className="navbar-logo"
            onClick={user ? onNavigateDashboard : () => {}}
            aria-label="Eventify home"
          >
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, var(--m-red), #c1121f)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', fontWeight: 900, color: 'white',
              boxShadow: '0 2px 8px rgba(230,57,70,0.4)',
              flexShrink: 0
            }}>E</div>
            Eventify<span className="navbar-logo-dot">.</span>
          </button>

          {/* Desktop nav links */}
          <div className="navbar-nav">
            {user && (
              <>
                <button
                  className={`navbar-link ${currentView === 'dashboard' ? 'active' : ''}`}
                  onClick={onNavigateDashboard}
                >
                  <LayoutDashboard size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Discover
                </button>
                <button
                  className={`navbar-link ${currentView === 'studio' ? 'active' : ''}`}
                  onClick={onNavigateStudio}
                >
                  <Plus size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Create Event
                </button>
              </>
            )}
          </div>

          {/* Desktop actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                {currentView !== 'studio' && (
                  <button
                    onClick={onNavigateStudio}
                    className="btn-primary"
                    style={{ padding: '9px 20px', fontSize: '0.85rem' }}
                    aria-label="Create a new event"
                  >
                    <Plus size={15} /> Create
                  </button>
                )}

                <button className="navbar-user-chip" onClick={onNavigateDashboard}>
                  <div className="navbar-avatar">{initial}</div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    {displayName.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={onSignOut}
                  className="navbar-sign-out"
                  aria-label="Sign out of Eventify"
                >
                  <LogOut size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button onClick={onSignIn} className="navbar-link">
                  Log in
                </button>
                <button
                  onClick={onSignUp}
                  className="btn-primary"
                  style={{ padding: '9px 22px', fontSize: '0.875rem' }}
                >
                  Join free
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen
              ? <X size={22} color="var(--text-primary)" />
              : <Menu size={22} color="var(--text-primary)" />
            }
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ─────────────────────── */}
      {mobileOpen && (
        <div className="navbar-drawer" ref={drawerRef} role="dialog" aria-label="Navigation menu">
          {user ? (
            <>
              {/* User row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0 12px' }}>
                <div className="navbar-avatar" style={{ width: 44, height: 44, fontSize: '1.1rem' }}>{initial}</div>
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Signed in as</p>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{displayName}</p>
                </div>
              </div>
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 12px' }} />

              <button
                className={`drawer-link ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => { onNavigateDashboard(); setMobileOpen(false); }}
              >
                <LayoutDashboard size={18} /> Discover events
              </button>

              {currentView !== 'studio' && (
                <button
                  className="drawer-link"
                  onClick={() => { onNavigateStudio(); setMobileOpen(false); }}
                >
                  <Plus size={18} /> Create Event
                </button>
              )}

              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
              <button
                className="drawer-link"
                onClick={() => { onSignOut(); setMobileOpen(false); }}
                style={{ color: '#e11d48' }}
              >
                <LogOut size={18} /> Sign out
              </button>
            </>
          ) : (
            <>
              <button
                className="drawer-link"
                onClick={() => { onSignIn(); setMobileOpen(false); }}
              >
                <LogIn size={18} /> Log in
              </button>
              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                onClick={() => { onSignUp(); setMobileOpen(false); }}
              >
                Join free
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
