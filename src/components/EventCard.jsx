import React, { useState } from 'react';
import { Clock, MapPin, Users, CheckCircle2, Pencil, Ticket } from 'lucide-react';
import avatar1 from '../assets/avatar_1.png';
import avatar2 from '../assets/avatar_2.png';
import avatar3 from '../assets/avatar_3.png';
import avatar4 from '../assets/avatar_4.png';

const AVATARS = [avatar1, avatar2, avatar3, avatar4];

const CATEGORY_COLORS = {
  Music:      { bg: 'rgba(124,58,237,0.18)', color: '#7c3aed', border: 'rgba(124,58,237,0.3)', grad: 'linear-gradient(135deg,#4c1d95,#7c3aed)' },
  Technology: { bg: 'rgba(37,99,235,0.18)',  color: '#93c5fd', border: 'rgba(37,99,235,0.3)',  grad: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' },
  Social:     { bg: 'rgba(217,119,6,0.18)',  color: '#fcd34d', border: 'rgba(217,119,6,0.3)',  grad: 'linear-gradient(135deg,#78350f,#d97706)' },
  Outdoors:   { bg: 'rgba(22,163,74,0.18)',  color: '#4ade80', border: 'rgba(22,163,74,0.3)',  grad: 'linear-gradient(135deg,#14532d,#16a34a)' },
  Wellness:   { bg: 'rgba(219,39,119,0.18)', color: '#f9a8d4', border: 'rgba(219,39,119,0.3)', grad: 'linear-gradient(135deg,#831843,#db2777)' },
  Art:        { bg: 'rgba(234,88,12,0.18)',  color: '#fdba74', border: 'rgba(234,88,12,0.3)',  grad: 'linear-gradient(135deg,#7c2d12,#ea580c)' },
  Gaming:     { bg: 'rgba(124,58,237,0.18)', color: '#c4b5fd', border: 'rgba(124,58,237,0.3)', grad: 'linear-gradient(135deg,#3b0764,#7c3aed)' },
};

const CATEGORY_EMOJIS = {
  Music: '🎵', Technology: '💻', Social: '☕',
  Outdoors: '🏔️', Wellness: '🌸', Art: '🎨', Gaming: '🎮',
};

/* ── Image avatar for the event creator ──────────── */
function CreatorAvatar({ name, gradient }) {
  const hash = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const avatarImage = AVATARS[hash % AVATARS.length];

  return (
    <div
      className="creator-avatar"
      style={{ background: 'none' }}
      title={name ? `Created by ${name}` : 'Unknown creator'}
      aria-label={`Created by ${name || 'unknown'}`}
    >
      <img src={avatarImage} alt={name || 'Creator'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

/* ── RSVP count with subtle pulse on change ─────────── */
function RSVPCount({ count }) {
  const [prev, setPrev] = useState(count);
  const [pulse, setPulse] = useState(false);

  if (count !== prev) {
    setPrev(count);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  }

  return (
    <span
      className={`event-card-attendees ${pulse ? 'rsvp-pulse' : ''}`}
      aria-live="polite"
      aria-label={`${count} people going`}
    >
      <Users size={13} />
      {count} going
    </span>
  );
}

export default function EventCard({ event, user, toggleRSVP, onBuy, onViewTicket, isPreview = false }) {
  const isGoing = event.rsvps?.includes(user?.id);
  const isPaid  = (event.price || 0) > 0;
  const isCreator = user?.id === event.creator_id;
  const theme   = CATEGORY_COLORS[event.category] || {
    bg: 'rgba(230,57,70,0.18)', color: '#f87171',
    border: 'rgba(230,57,70,0.3)', grad: 'linear-gradient(135deg,#7f1d1d,var(--m-red))',
  };
  const emoji = CATEGORY_EMOJIS[event.category] || '📅';

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'Date TBD';

  return (
    <div className="event-card">
      {/* ── Image / placeholder ──────── */}
      <div className="event-card-img-wrap">
        {event.image ? (
          <img
            className="event-card-img"
            src={event.image}
            alt={event.title || 'Event cover'}
            loading="lazy"
          />
        ) : (
          <div
            className="event-placeholder-img"
            style={{ background: theme.grad }}
          >
            <span role="img" aria-label={event.category} style={{ fontSize: '3rem' }}>
              {emoji}
            </span>
          </div>
        )}
        <div className="event-card-img-overlay" />
        {event.category && (
          <div
            className="event-cat-badge"
            style={{ background: theme.bg, color: theme.color, border: `1px solid ${theme.border}` }}
          >
            <span>{emoji}</span>
            {event.category}
          </div>
        )}
        {(isPaid || event.price > 0) && (
          <div className="event-price-badge">
            ${event.price}
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────── */}
      <div className="event-card-body">
        <p className="event-card-date">
          <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          {formattedDate}
        </p>

        <h3 className="event-card-title">{event.title || 'Untitled event…'}</h3>

        {event.description && (
          <p className="event-card-desc">{event.description}</p>
        )}

        <div className="event-card-meta">
          <span className="event-card-location">
            <MapPin size={13} />
            {event.location || 'Location TBD'}
          </span>
          <RSVPCount count={event.rsvps?.length || 0} />
        </div>

        {/* ── RSVP footer ──────────────── */}
        {!isPreview && (
          <div className="event-card-footer" style={{ position: 'relative', zIndex: 5, pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              {/* Creator avatar */}
              <CreatorAvatar
                name={event.creatorName || event.creator_email?.split('@')[0]}
                gradient={theme.grad}
              />
              
              {isCreator && (
                <button
                  onClick={() => onBuy(event, true)} // Reusing onBuy with a flag for edit
                  className="edit-mini-btn"
                  title="Edit Event"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>

            {/* RSVP button */}
            {isGoing ? (
              <button
                onClick={() => isPaid ? onViewTicket(event) : toggleRSVP(event.id, event.rsvps)}
                className="rsvp-btn rsvp-btn-active"
                aria-label={isPaid ? "View your ticket" : "Cancel RSVP"}
              >
                {isPaid ? (
                   <><Ticket size={18} /> View Ticket 🎟️</>
                ) : (
                   <><CheckCircle2 size={18} /> You're going</>
                )}
              </button>
            ) : isPaid ? (
              <button
                onClick={() => onBuy(event)}
                className="rsvp-btn rsvp-btn-paid"
                aria-label={`Buy ticket for ${event.title}`}
              >
                Get Ticket — ${event.price}
              </button>
            ) : (
              <button
                onClick={() => toggleRSVP(event.id, event.rsvps)}
                className="rsvp-btn rsvp-btn-default"
                aria-label={`Attend ${event.title}`}
              >
                RSVP — Join FREE
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
