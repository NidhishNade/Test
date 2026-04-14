import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, Plus, ArrowUpDown } from 'lucide-react';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const CATEGORIES = ['All', 'Music', 'Technology', 'Social', 'Outdoors', 'Wellness', 'Art', 'Gaming'];

const CATEGORY_EMOJIS = {
  All: '✨', Music: '🎵', Technology: '💻', Social: '☕',
  Outdoors: '🏔️', Wellness: '🌸', Art: '🎨', Gaming: '🎮',
};

const TABS = [
  { id: 'Upcoming',   label: 'Upcoming' },
  { id: 'MyEvents',   label: 'My Events' },
  { id: 'MyTickets',  label: 'My Tickets' }
];

const SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest first' },
  { value: 'oldest',   label: 'Oldest first' },
  { value: 'popular',  label: 'Most popular' },
  { value: 'az',       label: 'A → Z' },
];

/* ── Animated counter hook ───────────────────────────── */
function useCountUp(target, duration = 900) {
  const [count, setCount] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

/* ── Stat chip with animated number ─────────────────── */
function StatChip({ value, label }) {
  const animated = useCountUp(value);
  return (
    <div className="dashboard-stat-chip">
      <span className="dashboard-stat-num">{animated}</span>
      <span className="dashboard-stat-lbl">{label}</span>
    </div>
  );
}

/* ── Tab indicator helper ────────────────────────────── */
function TabBar({ active, onChange }) {
  const underlineRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeBtn = container.querySelector('.dashboard-tab.active');
    if (!activeBtn || !underlineRef.current) return;
    const { offsetLeft, offsetWidth } = activeBtn;
    underlineRef.current.style.left  = `${offsetLeft}px`;
    underlineRef.current.style.width = `${offsetWidth}px`;
  }, [active]);

  return (
    <div className="dashboard-tabs" ref={containerRef}>
      {TABS.map(t => (
        <button
          key={t.id}
          className={`dashboard-tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
      <span className="tab-underline" ref={underlineRef} />
    </div>
  );
}

export default function Dashboard({
  events, user, toggleRSVP, onBuy, onViewTicket, setView,
  searchTerm, setSearchTerm,
  activeCategory, setActiveCategory,
  eventsLoading = false,
}) {
  const [sortBy, setSortBy]       = useState('newest');
  const [activeTab, setActiveTab] = useState('Upcoming');

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const myRsvpCount = events.filter(e => e.rsvps?.includes(user?.id)).length;

  /* ── Handle tab switch ──────────────── */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveCategory('All');
  };

  /* ── Filter + sort ──────────────────── */
  const filteredEvents = events.filter(event => {
    const isPast = new Date(event.date) < new Date();
    const isGoing = user && event.rsvps?.includes(user.id);
    const isCreatedByMe = user && event.creator_id === user.id;
    const isPaid = (event.price || 0) > 0;

    // 1. Tab-level filtering
    if (activeTab === 'Upcoming' && isPast) return false;
    if (activeTab === 'MyEvents' && !isCreatedByMe) return false;
    if (activeTab === 'MyTickets' && (!isGoing || !isPaid || isPast)) return false;

    // 2. Search filtering
    const matchesSearch =
      !searchTerm ||
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // 3. Category filtering
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    if (!matchesCategory) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest')  return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest')  return new Date(a.date) - new Date(b.date);
    if (sortBy === 'popular') return (b.rsvps?.length || 0) - (a.rsvps?.length || 0);
    if (sortBy === 'az')      return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  return (
    <div className="animate-slide-up">
      {/* ── Compact hero banner ────────── */}
      <div className="dashboard-hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="welcome-label">
            {getGreeting()}, {user.displayName?.split(' ')[0] || 'Explorer'} 👋
          </span>

          <div className="dashboard-hero-row">
            <h1 className="dashboard-hero-title">Find your people.</h1>
            <div className="dashboard-stats-row">
              <StatChip value={myRsvpCount} label="RSVPed" />
              <StatChip value={events.length} label="Events live" />
            </div>
          </div>

          <TabBar active={activeTab} onChange={handleTabChange} />
        </div>
      </div>

      <div className="container dashboard-body">
        {/* ── Search + Sort row ─────────── */}
        <div className="dashboard-search-row">
          <div className="search-container dashboard-search" style={{ marginTop: 0, flex: 1 }}>
            <div className="search-field">
              <Search style={{ color: 'var(--m-red)', flexShrink: 0 }} size={18} />
              <input
                type="text"
                placeholder="Search events…"
                className="search-input"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                aria-label="Search events"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sort dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort events"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Category filter pills ──────── */}
        <div className="dashboard-filter-row">
          <div>
            <h2 className="dashboard-section-title">
              {activeTab === 'My Events' ? 'My Events' : activeCategory === 'All' ? 'All Events' : `${activeCategory} Events`}
            </h2>
            <p className="dashboard-event-count">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </p>
          </div>

          {activeTab !== 'My Events' && (
            <div className="dashboard-pills-scroll" role="group" aria-label="Filter by category">
              {CATEGORIES.filter(c => c !== 'My Events').map(cat => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  <span className="category-pill-emoji">{CATEGORY_EMOJIS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Event grid ────────────────── */}
        {eventsLoading ? (
          <LoadingSkeleton count={6} />
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Sparkles size={48} style={{ color: 'var(--m-teal)', margin: '0 auto 1.5rem', display: 'block' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>No events found</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '340px', margin: '0 auto 2rem', fontSize: '0.95rem' }}>
              {activeTab === 'My Events'
                ? "You haven't created any events yet. Launch your first one!"
                : 'Try a different search or category filter.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setSearchTerm(''); setActiveCategory('All'); setActiveTab('Upcoming'); }}
                className="btn-secondary"
                style={{ padding: '12px 28px' }}
              >
                Reset filters
              </button>
              {activeTab === 'My Events' && (
                <button onClick={() => setView('studio')} className="btn-primary" style={{ padding: '12px 28px' }}>
                  <Plus size={16} /> Create Event
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event, i) => (
              <div
                key={event.id}
                className="event-card-wrapper animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                <EventCard
                  event={event}
                  user={user}
                  toggleRSVP={toggleRSVP}
                  onBuy={onBuy}
                  onViewTicket={onViewTicket}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
