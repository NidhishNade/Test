import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function ConnectivityStatus({ isBlocked }) {
  if (!isBlocked) return null;

  return (
    <div
      className="connectivity-banner"
      role="status"
      aria-live="polite"
      aria-label="Connection warning"
    >
      <div className="connectivity-dot" />
      <ShieldAlert size={15} aria-hidden="true" />
      <span>
        Cloud connection blocked. Check your ad blocker or firewall.
      </span>
    </div>
  );
}
