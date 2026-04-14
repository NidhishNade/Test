import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Ticket, ShieldCheck, Download, Share2 } from 'lucide-react';

export default function TicketModal({ event, onClose }) {
  
  // Lock body scroll when open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal-box ticket-modal-wrap" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn ticket-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="ticket-container">
          {/* Top Section: Branding & Status */}
          <div className="ticket-header">
            <div className="ticket-logo">
              <span className="logo-dot">●</span> Eventify
            </div>
            <div className="ticket-status">
              <ShieldCheck size={14} /> SECURED TICKET
            </div>
          </div>

          {/* Main Info Section */}
          <div className="ticket-main">
            <div className="ticket-event-type">{event.category}</div>
            <h2 className="ticket-title">{event.title}</h2>
            
            <div className="ticket-details-grid">
              <div className="detail-item">
                <Calendar size={14} />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}</span>
              </div>
              <div className="detail-item">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Perforation Line */}
          <div className="ticket-perforation">
            <div className="perf-circle left" />
            <div className="perf-line" />
            <div className="perf-circle right" />
          </div>

          {/* Bottom Section: QR & Meta */}
          <div className="ticket-footer">
            <div className="qr-section">
              <div className="fake-qr">
                {/* Simulated QR Code Pattern */}
                {[...Array(25)].map((_, i) => (
                  <div key={i} className={`qr-pixel ${Math.random() > 0.5 ? 'active' : ''}`} />
                ))}
              </div>
              <p className="qr-scancode">#{event.id?.slice(0, 8).toUpperCase()}</p>
            </div>

            <div className="ticket-meta">
              <div className="meta-group">
                <label>Attendee</label>
                <div className="meta-value">Verified Member</div>
              </div>
              <div className="meta-group">
                <label>Price Paid</label>
                <div className="meta-value">${event.price}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="ticket-actions">
           <button className="btn-secondary ticket-action-btn">
             <Download size={18} /> Save to Phone
           </button>
           <button className="btn-secondary ticket-action-btn">
             <Share2 size={18} /> Share
           </button>
        </div>
      </div>

      <style>{`
        .ticket-modal-wrap {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
          overflow: visible !important;
          max-width: 400px;
        }
        .ticket-close {
          top: -40px !important;
          right: 0 !important;
          background: rgba(255,255,255,0.2) !important;
          color: white !important;
        }
        .ticket-container {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .ticket-header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          border-bottom: 1px dashed #e2e8f0;
        }
        .ticket-logo {
          font-weight: 900;
          font-size: 1.1rem;
          color: #0f172a;
        }
        .logo-dot { color: #e63946; margin-right: 4px; }
        .ticket-status {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #15803d;
          background: #dcfce7;
          padding: 4px 10px;
          border-radius: 99px;
        }
        .ticket-main {
          padding: 2rem;
          background: white;
        }
        .ticket-event-type {
          font-size: 0.7rem;
          font-weight: 800;
          color: #e63946;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }
        .ticket-title {
          font-size: 1.5rem;
          font-weight: 900;
          color: #0d1117;
          line-height: 1.2;
          margin-bottom: 1.25rem;
        }
        .ticket-details-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }
        .ticket-perforation {
          position: relative;
          height: 20px;
          display: flex;
          align-items: center;
          background: white;
        }
        .perf-line {
          flex: 1;
          height: 1.5px;
          border-top: 2px dashed #e2e8f0;
        }
        .perf-circle {
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.6);
          position: absolute;
          border-radius: 50%;
          backdrop-filter: blur(8px);
        }
        .perf-circle.left { left: -10px; }
        .perf-circle.right { right: -10px; }

        .ticket-footer {
          padding: 2rem;
          background: white;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .qr-section {
          text-align: center;
        }
        .fake-qr {
          width: 80px;
          height: 80px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2px;
          padding: 6px;
          background: #f1f5f9;
          border-radius: 8px;
        }
        .qr-pixel {
          background: #e2e8f0;
          border-radius: 1px;
        }
        .qr-pixel.active {
          background: #0f172a;
        }
        .qr-scancode {
          font-size: 0.6rem;
          font-weight: 700;
          color: #94a3b8;
          margin-top: 6px;
          font-family: monospace;
        }
        .ticket-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .meta-group label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .meta-value {
          font-size: 0.9rem;
          font-weight: 800;
          color: #1e293b;
        }
        .ticket-actions {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
        }
        .ticket-action-btn {
          flex: 1;
          background: rgba(255,255,255,0.1);
          border: 1.5px solid rgba(255,255,255,0.2);
          color: white;
          justify-content: center;
        }
        .ticket-action-btn:hover {
          background: white;
          color: #0d1117;
        }
      `}</style>
    </div>
  );
}
