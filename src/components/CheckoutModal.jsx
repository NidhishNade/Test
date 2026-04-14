import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CreditCard, Lock, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { toast } from './ToastContainer';

export default function CheckoutModal({ event, onClose, onConfirm }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Auto-close on success after a delay
  useEffect(() => {
    if (isDone) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDone, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handlePay = async () => {
    setIsProcessing(true);
    const success = await onConfirm(event);
    setIsProcessing(false);
    if (success) {
      setIsDone(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && !isProcessing && onClose()}>
      <div className="modal-box checkout-modal" onClick={e => e.stopPropagation()}>
        {!isDone && (
          <button className="modal-close-btn" onClick={onClose} disabled={isProcessing}>
            <X size={20} />
          </button>
        )}

        <div className="checkout-content">
          {!isDone ? (
            <>
              <div className="checkout-header">
                <div className="checkout-badge">
                  <ShieldCheck size={14} /> Secure Checkout
                </div>
                <h2 className="checkout-title">Complete your purchase</h2>
                <p className="checkout-subtitle">Secure your spot at <b>{event.title}</b></p>
              </div>

              <div className="checkout-summary">
                <div className="summary-row">
                  <span>Ticket Price</span>
                  <span>${event.price || '0.00'}</span>
                </div>
                <div className="summary-row">
                  <span>Booking Fee</span>
                  <span className="text-free">FREE</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>${event.price || '0.00'}</span>
                </div>
              </div>

              <div className="checkout-payment-box">
                <div className="payment-method-header">
                  <CreditCard size={16} />
                  <span>Simulated Payment</span>
                  <span className="payment-badge">SIMULATED</span>
                </div>
                <div className="payment-body">
                  <p>In this demonstration, your "payment" is securely simulated within our local environment. No real funds will be transferred.</p>
                  <div className="payment-visual">
                    <div className="visual-card">
                      <div className="card-chip" />
                      <div className="card-number">•••• •••• •••• 4242</div>
                      <div className="card-footer">
                        <span>JOHN DOE</span>
                        <span>12 / 29</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary checkout-pay-btn" 
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing…</>
                ) : (
                  <>Complete Purchase — ${event.price}</>
                )}
              </button>

              <div className="checkout-footer">
                <Lock size={12} />
                <span>Your transaction is simulated and encrypted</span>
              </div>
            </>
          ) : (
            <div className="checkout-success">
              <div className="success-icon-wrapper">
                <div className="success-icon-pulse" />
                <div className="success-icon">
                  <CheckCircle size={40} color="white" />
                </div>
              </div>
              <h2 className="success-title">You're going! 🎉</h2>
              <p className="success-text">Your ticket for <b>{event.title}</b> has been secured. Check your dashboard for details.</p>
              
              <div className="success-sparkles">
                <Sparkles size={16} className="sparkle s1" />
                <Sparkles size={16} className="sparkle s2" />
                <Sparkles size={16} className="sparkle s3" />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .checkout-modal {
          max-width: 480px;
          max-height: 90vh; /* Don't go off screen */
          padding: 0;
          overflow-y: auto; /* Allow internal scrolling if content is tall */
          background: #0a0a0b;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          flex-direction: column;
        }
        .checkout-content {
          padding: 2.5rem;
          flex: 1;
        }
        .checkout-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .checkout-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(34,197,94,0.1);
          color: #22c55e;
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .checkout-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin-bottom: 0.5rem;
        }
        .checkout-subtitle {
          color: rgba(255,255,255,0.6);
          font-size: 0.95rem;
        }
        .checkout-summary {
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          color: rgba(255,255,255,0.7);
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        .summary-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 0.75rem 0;
        }
        .summary-row.total {
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 0;
        }
        .text-free {
          color: #22c55e;
          font-weight: 700;
        }
        .checkout-payment-box {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .payment-method-header {
          background: rgba(255,255,255,0.05);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .payment-badge {
          margin-left: auto;
          font-size: 0.65rem;
          background: rgba(255,255,255,0.15);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
        }
        .payment-body {
          padding: 1.25rem;
          color: rgba(255,255,255,0.5);
          font-size: 0.8rem;
          line-height: 1.5;
        }
        .payment-visual {
          margin-top: 1.25rem;
          perspective: 1000px;
        }
        .visual-card {
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          width: 100%;
          height: 120px;
          border-radius: 10px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
        }
        .card-chip {
          width: 32px;
          height: 24px;
          background: rgba(255,255,255,0.3);
          border-radius: 4px;
        }
        .card-number {
          font-family: monospace;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.65rem;
          font-weight: 600;
          opacity: 0.8;
        }
        .checkout-pay-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 12px;
        }
        .checkout-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
        }
        .checkout-success {
          text-align: center;
          padding: 2rem 0;
          position: relative;
        }
        .success-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
        }
        .success-icon {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          background: #22c55e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(34,197,94,0.4);
        }
        .success-icon-pulse {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          background: #22c55e;
          animation: success-pulse 2s infinite;
          z-index: 1;
        }
        @keyframes success-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        .success-title {
          color: white;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .success-text {
          color: rgba(255,255,255,0.6);
          line-height: 1.6;
        }
        .success-sparkles {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none;
        }
        .sparkle {
          position: absolute;
          color: #22c55e;
          animation: sparkle-anim 2s infinite;
        }
        .sparkle.s1 { top: 10%; left: 20%; animation-delay: 0.2s; }
        .sparkle.s2 { top: 20%; right: 15%; animation-delay: 0.5s; }
        .sparkle.s3 { bottom: 20%; left: 10%; animation-delay: 0.8s; }
        @keyframes sparkle-anim {
          0% { transform: scale(0) rotate(0); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
