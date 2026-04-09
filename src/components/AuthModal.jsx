import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';

/* ── Field-level validators ───────────────────────────── */
const validators = {
  name:     v => v.trim().length < 2 ? 'Name must be at least 2 characters' : '',
  email:    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address',
  password: v => v.length < 6 ? 'Password must be at least 6 characters' : '',
};

const calcStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8)            s++;
  if (/[A-Z]/.test(pw))         s++;
  if (/[0-9]/.test(pw))         s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const strengthMeta = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

export default function AuthModal({
  isLogin, setIsLogin, onClose, handleAuth,
  authError, name, setName, email, setEmail,
  password, setPassword,
}) {
  const [showPw, setShowPw]           = useState(false);
  const [touched, setTouched]         = useState({});
  const [submitting, setSubmitting]   = useState(false);
  const firstFieldRef                 = useRef(null);
  const modalRef                      = useRef(null);

  const strength = !isLogin ? calcStrength(password) : 0;

  // Focus trap — Tab key cycles within modal
  useEffect(() => {
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;
      const el = modalRef.current;
      if (!el) return;
      const focusable = Array.from(
        el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(node => !node.disabled);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, []);

  // Auto-focus first visible field
  useEffect(() => {
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [isLogin]);

  // Escape key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const fieldError = (field, value) => touched[field] ? validators[field](value) : '';
  const nameErr   = !isLogin ? fieldError('name', name) : '';
  const emailErr  = fieldError('email', email);
  const pwErr     = fieldError('password', password);

  const onSubmit = async (e) => {
    // Mark all as touched to show errors
    setTouched({ name: true, email: true, password: true });
    const hasErrors = (!isLogin && validators.name(name)) ||
                      validators.email(email) ||
                      validators.password(password);
    if (hasErrors) return;

    setSubmitting(true);
    await handleAuth(e);
    setSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-subtitle">
      <div className="modal-box" ref={modalRef} onClick={e => e.stopPropagation()}>

        {/* ── Header ──────────────────────────── */}
        <div className="modal-header">
          <div className="modal-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 7V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V7L12 2Z" fill="white" opacity="0.9"/>
              <path d="M9 12L11 14L15 10" stroke="#c1121f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <button onClick={onClose} className="modal-close-btn" aria-label="Close dialog">
            <X size={18} />
          </button>

          <h1 className="modal-title" id="modal-title">
            {isLogin ? 'Welcome back.' : 'Join the party.'}
          </h1>
          <p className="modal-subtitle" id="modal-subtitle">
            {isLogin
              ? 'Sign in to discover events near you.'
              : 'Create a free account and start exploring.'}
          </p>
        </div>

        {/* ── Body ────────────────────────────── */}
        <div className="modal-body">
          <form onSubmit={onSubmit} className="auth-form" noValidate>

            {/* Name — signup only */}
            {!isLogin && (
              <div>
                <label style={labelStyle} htmlFor="auth-name">Display name</label>
                <div className="auth-input-wrap">
                  <input
                    ref={isLogin ? undefined : firstFieldRef}
                    id="auth-name"
                    type="text"
                    className={`auth-input ${nameErr ? 'input-error' : (touched.name && name ? 'input-ok' : '')}`}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, name: true }))}
                    placeholder="How should we call you?"
                    required
                    aria-describedby={nameErr ? 'name-err' : undefined}
                    autoComplete="name"
                  />
                  {touched.name && name && !nameErr && <FieldOk />}
                </div>
                {nameErr && <p id="name-err" className="field-error">{nameErr}</p>}
              </div>
            )}

            {/* Email */}
            <div>
              <label style={labelStyle} htmlFor="auth-email">Email address</label>
              <div className="auth-input-wrap">
                <input
                  ref={isLogin ? firstFieldRef : undefined}
                  id="auth-email"
                  type="email"
                  className={`auth-input ${emailErr ? 'input-error' : (touched.email && email ? 'input-ok' : '')}`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="you@example.com"
                  required
                  aria-describedby={emailErr ? 'email-err' : undefined}
                  autoComplete="email"
                />
                {touched.email && email && !emailErr && <FieldOk />}
              </div>
              {emailErr && <p id="email-err" className="field-error">{emailErr}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle} htmlFor="auth-password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input ${pwErr ? 'input-error' : (touched.password && password ? 'input-ok' : '')}`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder={isLogin ? 'Your password' : 'Min. 6 characters'}
                  required
                  minLength={6}
                  aria-describedby={pwErr ? 'pw-err' : undefined}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="auth-eye-button"
                  onClick={() => setShowPw(v => !v)}
                  tabIndex={-1}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {pwErr && <p id="pw-err" className="field-error">{pwErr}</p>}

              {/* Strength meter — signup only */}
              {!isLogin && password.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                    {[1,2,3,4].map(i => (
                      <div
                        key={i}
                        style={{
                          height: '4px', flex: 1, borderRadius: '99px',
                          background: i <= strength ? strengthColor[strength] : 'var(--border)',
                          transition: 'background 0.35s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: strengthColor[strength] }}>
                    {strengthMeta[strength]}
                    {strength >= 3 && <CheckCircle2 size={11} style={{ marginLeft: 4, verticalAlign: 'middle' }} />}
                  </span>
                </div>
              )}
            </div>

            {/* Server-level error banner */}
            {authError && (
              <div className="auth-error" role="alert">
                <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{authError}</span>
              </div>
            )}

            {/* Divider */}
            <div className="auth-divider">
              <span>secure {isLogin ? 'sign in' : 'sign up'}</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', fontWeight: 900 }}
              disabled={submitting}
            >
              {submitting
                ? <><Loader2 size={18} className="animate-spin" /> Please wait…</>
                : isLogin ? 'Sign in →' : 'Create account →'
              }
            </button>
          </form>

          {/* Switch mode */}
          <div className="modal-switch">
            {isLogin ? "Don't have an account?" : "Already a member?"}
            <button onClick={() => { setIsLogin(!isLogin); setTouched({}); }}>
              {isLogin ? ' Create account' : ' Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────── */
const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  letterSpacing: '0.02em',
};

function FieldOk() {
  return (
    <CheckCircle2
      size={16}
      color="#22c55e"
      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
    />
  );
}
