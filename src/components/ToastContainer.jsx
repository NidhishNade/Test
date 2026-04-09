import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, X } from 'lucide-react';

let _addToast = null;

export const toast = {
  success: (msg) => _addToast?.({ msg, type: 'success' }),
  error:   (msg) => _addToast?.({ msg, type: 'error' }),
  info:    (msg) => _addToast?.({ msg, type: 'info' }),
};

const ICON_MAP = {
  success: <CheckCircle2 size={16} color="#22c55e" />,
  error:   <ShieldAlert  size={16} color="var(--m-red)" />,
  info:    <Sparkles     size={16} color="var(--m-teal)" />,
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = ({ msg, type }) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    return () => { _addToast = null; };
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          <span className="toast-icon">{ICON_MAP[t.type]}</span>
          <span className="toast-msg">{t.msg}</span>
          <button
            onClick={() => dismiss(t.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', marginLeft: 'auto',
              display: 'flex', alignItems: 'center', padding: '2px',
              flexShrink: 0,
            }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
