import React, { useState } from 'react';
import { useFirebase } from './hooks/useFirebase';

import Navbar             from './components/Navbar';
import Footer             from './components/Footer';
import ToastContainer     from './components/ToastContainer';
import ConnectivityStatus from './components/ConnectivityStatus';
import AuthModal          from './components/AuthModal';

import LandingPage        from './pages/LandingPage';
import Dashboard          from './pages/Dashboard';
import CreateEventStudio  from './pages/CreateEventStudio';

export default function App() {
  const fb = useFirebase();

  const [view, setView]             = useState('landing'); // 'landing' | 'dashboard' | 'studio'
  const [showAuth, setShowAuth]     = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // When auth completes, redirect appropriately
  const handleAuth = async (e) => {
    const ok = await fb.handleAuth(e);
    if (ok) { setShowAuth(false); setView('dashboard'); }
  };

  const handleCreate = async (e) => {
    const ok = await fb.createEvent(e);
    if (ok) setView('dashboard');
  };

  const handleSignOut = async () => {
    await fb.handleSignOut();
    setView('landing');
  };

  // Loading spinner
  if (fb.loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-ring" aria-label="Loading…" />
      </div>
    );
  }

  const currentView = fb.user ? (view === 'landing' ? 'dashboard' : view) : 'landing';

  return (
    <>
      <ToastContainer />
      <ConnectivityStatus isBlocked={fb.isBlocked} />

      <a href="#main-content" className="skip-link">Skip to content</a>
      <div className="app-wrapper">
        <Navbar
          user={fb.user}
          onSignIn={() => { fb.setIsLogin(true); setShowAuth(true); }}
          onSignUp={() => { fb.setIsLogin(false); setShowAuth(true); }}
          onSignOut={handleSignOut}
          onNavigateDashboard={() => setView('dashboard')}
          onNavigateStudio={() => setView('studio')}
          currentView={currentView}
        />

        <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
          {currentView === 'landing' && (
            <LandingPage
              setShowAuth={setShowAuth}
              setIsLogin={fb.setIsLogin}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              events={fb.events}
              user={fb.user}
              toggleRSVP={fb.toggleRSVP}
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
              formState={fb.studioForm}
              setFormState={fb.setStudioForm}
              isSubmitting={fb.isSubmitting}
            />
          )}
        </main>

        <Footer />
      </div>

      {showAuth && (
        <AuthModal
          isLogin={fb.isLogin}
          setIsLogin={fb.setIsLogin}
          name={fb.name}
          setName={fb.setName}
          email={fb.email}
          setEmail={fb.setEmail}
          password={fb.password}
          setPassword={fb.setPassword}
          authError={fb.authError}
          handleAuth={handleAuth}
          onClose={() => { setShowAuth(false); fb.setAuthError(''); }}
        />
      )}
    </>
  );
}
