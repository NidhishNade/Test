import React, { useState } from 'react';
import { useSupabase } from './hooks/useSupabase';

import Navbar             from './components/Navbar';
import Footer             from './components/Footer';
import ToastContainer     from './components/ToastContainer';
import ConnectivityStatus from './components/ConnectivityStatus';
import AuthModal          from './components/AuthModal';
import CheckoutModal      from './components/CheckoutModal';
import TicketModal        from './components/TicketModal';

import LandingPage        from './pages/LandingPage';
import Dashboard          from './pages/Dashboard';
import CreateEventStudio  from './pages/CreateEventStudio';

export default function App() {
  const sb = useSupabase();

  const [view, setView]             = useState('landing'); // 'landing' | 'dashboard' | 'studio'
  const [showAuth, setShowAuth]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [checkoutEvent, setCheckoutEvent] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);

  // When auth completes, redirect appropriately
  const handleAuth = async (e) => {
    const ok = await sb.handleAuth(e);
    if (ok) { setShowAuth(false); setView('dashboard'); }
  };

  const handleCreate = async (e) => {
    const ok = await sb.createEvent(e);
    if (ok) setView('dashboard');
  };

  const handleSignOut = async () => {
    await sb.handleSignOut();
    setView('landing');
  };

  // Loading spinner
  if (sb.loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-ring" aria-label="Loading…" />
      </div>
    );
  }

  const currentView = sb.user ? (view === 'landing' ? 'dashboard' : view) : 'landing';

  return (
    <>
      <ToastContainer />
      <ConnectivityStatus isBlocked={sb.isBlocked} />

      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app-wrapper">
        <Navbar
          user={sb.user}
          onSignIn={() => { sb.setIsLogin(true); setShowAuth(true); }}
          onSignUp={() => { sb.setIsLogin(false); setShowAuth(true); }}
          onSignOut={handleSignOut}
          onNavigateDashboard={() => setView('dashboard')}
          onNavigateStudio={() => setView('studio')}
          currentView={currentView}
        />

        <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
          {currentView === 'landing' && (
            <LandingPage
              setShowAuth={setShowAuth}
              setIsLogin={sb.setIsLogin}
            />
          )}

           {currentView === 'dashboard' && (
            <Dashboard
              events={sb.events}
              user={sb.user}
              toggleRSVP={sb.toggleRSVP}
              onBuy={(e, isEdit) => {
                if (isEdit) {
                  sb.setStudioForm({
                    ...e,
                    maxAttendees: e.max_attendees // map back to camelCase for form
                  });
                  setView('studio');
                } else {
                  setCheckoutEvent(e);
                }
              }}
              onViewTicket={(e) => setViewingTicket(e)}
              setView={setView}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )}

          {currentView === 'studio' && (
            <CreateEventStudio
              setView={setView}
              handleCreate={handleCreate}
              formState={sb.studioForm}
              setFormState={sb.setStudioForm}
              isSubmitting={sb.isSubmitting}
            />
          )}
        </main>

        <Footer />
      </div>

      {showAuth && (
        <AuthModal
          isLogin={sb.isLogin}
          setIsLogin={sb.setIsLogin}
          name={sb.name}
          setName={sb.setName}
          email={sb.email}
          setEmail={sb.setEmail}
          password={sb.password}
          setPassword={sb.setPassword}
          authError={sb.authError}
          handleAuth={handleAuth}
          onClose={() => { setShowAuth(false); sb.setAuthError(''); }}
        />
      )}
      {checkoutEvent && (
        <CheckoutModal
          event={checkoutEvent}
          onClose={() => setCheckoutEvent(null)}
          onConfirm={sb.buyTicket}
        />
      )}
      {viewingTicket && (
        <TicketModal
          event={viewingTicket}
          onClose={() => setViewingTicket(null)}
        />
      )}
    </>
  );
}
