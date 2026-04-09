import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LogIn, 
  LogOut, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  ChevronRight,
  Loader2,
  Sparkles,
  Search,
  Users,
  Clock,
  ArrowRight,
  ArrowLeft,
  Github,
  X,
  ChevronLeft
} from 'lucide-react';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// --- Sub-components (Architectural Refactor) ---

const LandingPage = ({ setShowAuth, setIsLogin }) => (
  <div className="animate-slide-up">
    {/* Hero Section */}
    <section className="hero">
      <div className="container">
        <div className="flex flex-col lg-flex-row items-center gap-12">
          <div className="lg-w-1-2 text-center">
            <h1 className="text-5xl lg-text-7xl font-black leading-tight tracking-tighter mb-8">
              The people platform—Where interests become friendships
            </h1>
            <p className="text-xl text-text-muted mb-10 leading-relaxed">
              Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Eventify.
            </p>
            <div className="flex flex-col gap-4 justify-center">
              <button 
                onClick={() => { setShowAuth(true); setIsLogin(false); }}
                className="btn-primary text-lg py-5 px-12"
              >
                Join the community
              </button>
            </div>
          </div>
          <div className="lg-w-1-2 flex justify-center">
             <div className="relative">
                <div className="absolute bg-m-red-5 rounded-full blur-3xl" style={{ inset: '-1rem' }}></div>
                <img src="https://www.meetup.com/blog/wp-content/uploads/2023/11/Meetup_Red_Logo_DuoTone.png" alt="Community" className="relative w-full max-w-sm mx-auto opacity-10" />
             </div>
          </div>
        </div>
      </div>
    </section>

    {/* Discovery Section */}
    <div className="container relative z-10" style={{ marginTop: '-3rem' }}>
      <div className="search-container">
        <div className="flex items-center gap-3 flex-grow px-4 border-r border-border md-block">
          <Search className="text-m-red" size={20} />
          <input type="text" placeholder='Search for "Design"' className="search-input text-lg font-bold" />
        </div>
        <div className="flex items-center gap-3 flex-grow px-4">
          <MapPin className="text-m-teal" size={20} />
          <input type="text" placeholder='London, UK' className="search-input text-lg font-bold" />
        </div>
        <button className="btn-primary px-12 py-4 font-black">Find Events</button>
      </div>
    </div>

    {/* Categories */}
    <section className="section bg-white pt-24 pb-12">
      <div className="container">
        <h3 className="text-center font-black uppercase tracking-[0.2em] text-xs text-text-muted mb-10">Browse by category</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {['Music', 'Technology', 'Social', 'Outdoors', 'Wellness', 'Art', 'Gaming'].map(cat => (
            <button key={cat} className="category-pill hover:scale-105 active:scale-95 transition-all">{cat}</button>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="section text-center mt-20" style={{ background: 'rgba(0, 121, 138, 0.05)', borderRadius: '3rem', margin: '5rem 3rem' }}>
      <div className="container py-20 relative">
        <h2 className="text-4xl mb-6 font-black tracking-tight leading-tight">Your next adventure <br/>starts right here</h2>
        <p className="text-xl text-text-muted mb-12 font-medium">Meet new people who share your interests through thousands of online and in-person events daily.</p>
        <button 
              onClick={() => { setShowAuth(true); setIsLogin(false); }}
              className="btn-primary py-5 px-16 text-lg font-black"
        >
          Get Started
        </button>
      </div>
    </section>
  </div>
);

const EventCard = ({ event, user, toggleRSVP, isPreview = false }) => {
  const isGoing = event.rsvps?.includes(user?.uid);
  
  return (
    <div className={`event-card ${isPreview ? 'shadow-lg' : ''}`}>
      <div className="relative" style={{ height: '224px', overflow: 'hidden' }}>
        <img 
          src={event.image || 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80'} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute category-pill" style={{ top: '1.25rem', left: '1.25rem', background: 'white' }}>
          {event.category || 'Special'}
        </div>
      </div>
      <div className="event-card-content">
        <div className="flex items-center gap-2 text-m-red font-black text-xs uppercase mb-3">
          <Clock size={16} />
          {event.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Setting Time...'}
        </div>
        <h3 className="text-2xl font-black mb-3 min-h-[64px] line-clamp-2">{event.title || 'Drafting Title...'}</h3>
        <div className="text-sm text-text-muted flex items-center gap-3 mb-6 font-bold">
          <MapPin size={18} className="text-m-teal" />
          {event.location || 'Setting Location...'}
        </div>
        
        {!isPreview && (
          <div className="flex items-center justify-between py-4" style={{ borderTop: '1px solid #e8e8e8', marginTop: 'auto' }}>
            <div className="text-sm font-black flex items-center gap-2">
              <Users size={18} className="text-m-teal" />
              <span>{event.rsvps?.length || 0} attending</span>
            </div>
            <button 
              onClick={() => toggleRSVP(event.id, event.rsvps)}
              className="btn-primary"
              style={{ padding: '8px 24px', fontSize: '0.875rem' }}
            >
              {isGoing ? 'Going' : 'Attend'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ events, user, toggleRSVP, setView, searchTerm, setSearchTerm, activeCategory, setActiveCategory }) => {
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesMyEvents = activeCategory === 'My Events' ? event.creatorId === user?.uid : true;
    return matchesSearch && matchesCategory && matchesMyEvents;
  });

  return (
    <div className="animate-slide-up">
      <div className="bg-white border-b border-border py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-m-red-5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-black uppercase tracking-widest text-m-red mb-4 block">Welcome back, {user.displayName?.split(' ')[0] || 'Explorer'}</span>
            <h1 className="text-5xl md-text-6xl mb-8 font-black tracking-tighter leading-tight italic">Find your people. <br/>Join the party.</h1>
            <div className="flex gap-8">
              <button 
                onClick={() => setActiveCategory('All')} 
                className={`btn-ghost font-black px-0 pb-3 text-lg ${activeCategory !== 'My Events' ? 'text-m-red' : ''}`}
                style={{ borderBottom: activeCategory !== 'My Events' ? '4px solid var(--m-red)' : 'none' }}
              >
                Upcoming
              </button>
              <button 
                onClick={() => setActiveCategory('My Events')} 
                className={`btn-ghost font-black px-0 pb-3 text-lg ${activeCategory === 'My Events' ? 'text-m-red' : ''}`}
                style={{ borderBottom: activeCategory === 'My Events' ? '4px solid var(--m-red)' : 'none' }}
              >
                My Events
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <div className="search-container" style={{ marginTop: '-40px', marginBottom: '80px' }}>
          <div className="flex items-center gap-3 flex-grow px-4 border-r border-border md-block">
            <Search className="text-m-red" size={20} />
            <input 
              type="text" 
              placeholder='Search for "Music"' 
              className="search-input text-lg font-bold" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-primary px-12 py-4 font-black">Find Events</button>
        </div>

        <div className="flex flex-col md-flex justify-between items-end gap-6 mb-16 px-6">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">
              {activeCategory === 'All' ? 'All Events' : `${activeCategory} Events`}
            </h2>
            <p className="text-text-muted font-bold">Handpicked for your interests</p>
          </div>
          <button onClick={() => setView('studio')} className="btn-primary flex items-center gap-3 py-4 px-8">
            <Plus size={20} /> 
            Create your experience
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {['All', 'Music', 'Technology', 'Social', 'Outdoors', 'Wellness', 'Art', 'Gaming'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className="category-pill hover-scale"
              style={{ borderColor: activeCategory === cat ? 'var(--m-red)' : '', color: activeCategory === cat ? 'var(--m-red)' : '' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-40 mx-6" style={{ background: 'white', border: '2px dashed #e8e8e8', borderRadius: '3rem' }}>
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="text-m-teal" size={48} />
            </div>
            <h3 className="text-3xl font-black mb-3">No events found</h3>
            <p className="text-text-muted max-w-sm mx-auto mb-12 text-lg font-medium">Try searching for something else or browse categories.</p>
            <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="btn-secondary py-5 px-12 text-lg">Reset Filter</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3 gap-12 px-6">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                user={user} 
                toggleRSVP={toggleRSVP} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CreateEventStudio = ({ setView, handleCreate, formState, setFormState, isSubmitting }) => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80', label: 'Tech' },
    { url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80', label: 'Concert' },
    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', label: 'Social' },
    { url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80', label: 'Workshop' },
    { url: 'https://images.unsplash.com/photo-1531050171651-a3a4ca0b740a?auto=format&fit=crop&w=800&q=80', label: 'Meetup' },
    { url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80', label: 'Exhibition' }
  ];

  return (
    <div className="studio-container animate-fade-in">
      <div className="studio-grid">
        <div className="studio-form-side border-r border-border/50">
          <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted hover:text-m-red mb-12 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
          </button>
          
          <h1 className="text-4xl font-black mb-2 tracking-tighter italic">Event Studio</h1>
          <p className="text-text-muted mb-12 font-bold text-lg">Build an event the community won't forget.</p>

          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div className="input-group">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block">Basic Information</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input 
                  value={formState.title} 
                  onChange={e => setFormState({...formState, title: e.target.value})} 
                  placeholder="The Title" 
                  className="text-2xl font-black"
                  style={{ padding: '1rem 0', border: 'none', borderBottom: '2px solid #e8e8e8', background: 'transparent' }}
                  required 
                />
                <textarea 
                  value={formState.description} 
                  onChange={e => setFormState({...formState, description: e.target.value})} 
                  rows="3" 
                  placeholder="What is the vibe? What should people bring?" 
                  className="text-lg font-bold"
                  style={{ padding: '1rem 0', border: 'none', borderBottom: '2px solid #e8e8e8', background: 'transparent' }}
                  required 
                />
              </div>
            </div>

            <div className="grid md-grid-cols-2 gap-8">
              <div className="input-group mb-0">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block">Schedule</label>
                <input 
                  type="datetime-local" 
                  value={formState.date} 
                  onChange={e => setFormState({...formState, date: e.target.value})} 
                  className="font-black"
                  required 
                />
              </div>
              <div className="input-group mb-0">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block">Location</label>
                <input 
                  value={formState.location} 
                  onChange={e => setFormState({...formState, location: e.target.value})} 
                  placeholder="Venue or London, UK" 
                  className="font-black"
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-6 block">Visual Theme</label>
              <div className="preset-grid">
                {images.map(img => (
                  <div 
                    key={img.url}
                    onClick={() => setFormState({...formState, image: img.url, category: img.label})}
                    className={`preset-thumb relative ${formState.image === img.url ? 'active' : ''}`}
                  >
                    <img src={img.url} alt={img.label} className="object-cover h-full" />
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full" 
              disabled={isSubmitting}
              style={{ padding: '1.5rem', fontSize: '1.25rem', marginTop: '3rem', fontStyle: 'italic', fontWeight: '900', opacity: isSubmitting ? 0.5 : 1 }}
            >
              {isSubmitting ? 'Launching...' : 'Launch Event'} {!isSubmitting && <ChevronRight size={24} strokeWidth={3} />}
            </button>
          </form>
        </div>

        <div className="studio-preview-side lg-flex" style={{ background: '#fafafa' }}>
          <div className="preview-sticky">
            <div className="flex items-center justify-center gap-4 mb-10">
               <div style={{ height: '1px', width: '2rem', background: '#e8e8e8' }}></div>
               <span className="text-xs font-black uppercase tracking-widest text-text-muted">Live Workspace</span>
               <div style={{ height: '1px', width: '2rem', background: '#e8e8e8' }}></div>
            </div>
            <EventCard event={formState} isPreview={true} />
            
            <div className="mt-16 relative" style={{ padding: '2rem', background: 'white', borderRadius: '2rem', border: '2px dashed #e8e8e8' }}>
               <div className="absolute flex items-center justify-center" style={{ top: '-1rem', left: '-1rem', width: '3rem', height: '3rem', background: 'var(--m-red)', borderRadius: '1rem', color: 'white', boxShadow: 'var(--shadow-md)' }}>
                  <Sparkles size={24} />
               </div>
              <h4 className="text-lg font-black italic mb-4">Architect's Advice 🏛️</h4>
              <p className="text-sm text-text-muted leading-relaxed font-bold">"A great event starts with a great title. Keep it punchy, invite curiosity, and always, always use a high-quality visual theme."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component (Final Architectural Clean) ---

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'studio'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Event Studio State
  const [studioForm, setStudioForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image: 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80',
    category: 'Tech'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(docs);
    });
    return unsubscribe;
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      setShowAuth(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err.code, err.message);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setAuthError('This email is already registered. Try logging in instead.');
          break;
        case 'auth/weak-password':
          setAuthError('Password is too weak. Please use at least 6 characters.');
          break;
        case 'auth/invalid-email':
          setAuthError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setAuthError('Invalid email or password. Please try again.');
          break;
        default:
          setAuthError('An error occurred. Check your connection or enable Email Auth in Firebase.');
      }
    }
  };

  const createEvent = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!user) {
      alert('You must be logged in to create an event.');
      return;
    }

    if (!navigator.onLine) {
      alert('You are offline. Please check your internet connection.');
      return;
    }

    setIsSubmitting(true);
    console.info('🚀 APP: Initiating event launch sequence...');
    console.info('💾 Firestore: Attempting to save document...');
    
    // Create a timeout promise
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore Connection Timed Out (15s). Please check your AdBlocker or firewall.')), 15000)
    );

    try {
      const saveTask = addDoc(collection(db, 'events'), {
        ...studioForm,
        creatorId: user.uid,
        creatorEmail: user.email,
        rsvps: []
      });

      // Race the save task against the timeout
      const docRef = await Promise.race([saveTask, timeout]);
      
      console.info('✅ Firestore: Save successful! ID:', docRef.id);
      
      // Force return up to dashboard
      console.info('🔄 View switching to Dashboard...');
      setCurrentView('dashboard');
      
      setStudioForm({
        title: '',
        description: '',
        date: '',
        location: '',
        image: 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80',
        category: 'Tech'
      });
    } catch (err) {
      console.error('❌ Firestore Error:', err);
      alert(`Failed to create event: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRSVP = async (eventId, rsvps) => {
    if (!user) {
      setShowAuth(true);
      setIsLogin(true);
      return;
    }
    const eventRef = doc(db, 'events', eventId);
    const isRsvped = rsvps?.includes(user.uid);
    
    try {
      await updateDoc(eventRef, {
        rsvps: isRsvped ? arrayRemove(user.uid) : arrayUnion(user.uid)
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <Loader2 className="animate-spin text-m-red" size={64} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-[0.4em] text-m-red animate-pulse">Initializing Architecture</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-dark">
      {/* Sticky Navbar */}
      <nav className="nav-bar">
        <div className="container flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="flex items-center justify-center font-black italic shadow-md" style={{ width: '40px', height: '40px', background: 'var(--m-red)', borderRadius: '12px', color: 'white', fontSize: '1.25rem' }}>E</div>
            <span className="logo">Eventify</span>
          </div>
          
          <div className="flex items-center gap-8">
            {user ? (
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setCurrentView('studio')} 
                  className="btn-primary" 
                  style={{ padding: '8px 20px', fontSize: '0.75rem', display: currentView === 'studio' ? 'none' : 'flex' }}
                >
                  <Plus size={16} /> Create Event
                </button>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center font-black text-m-teal" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 121, 138, 0.1)' }}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                  <div className="md-block" style={{ display: 'none' }}>
                     <p className="text-xs font-black uppercase tracking-widest text-text-muted mb-1" style={{ lineHeight: 1 }}>Authenticated</p>
                     <p className="text-sm font-black whitespace-nowrap">{user.displayName || user.email?.split('@')[0]}</p>
                  </div>
                </div>
                <div style={{ width: '1px', background: '#e8e8e8', height: '2rem' }}></div>
                <button onClick={() => signOut(auth)} className="text-sm font-black uppercase tracking-widest text-text-muted hover-m-red flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <button onClick={() => { setShowAuth(true); setIsLogin(true); }} className="text-sm font-black uppercase tracking-widest text-text-muted">Log in</button>
                <button onClick={() => { setShowAuth(true); setIsLogin(false); }} className="btn-primary text-sm px-8 py-3">Join</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-80px)]">
        {user ? (
          currentView === 'studio' ? (
            <CreateEventStudio 
              setView={setCurrentView} 
              handleCreate={createEvent}
              formState={studioForm}
              setFormState={setStudioForm}
              isSubmitting={isSubmitting}
            />
          ) : (
            <Dashboard 
              events={events} 
              user={user} 
              toggleRSVP={toggleRSVP} 
              setView={setCurrentView} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          )
        ) : (
          <LandingPage 
            setShowAuth={setShowAuth} 
            setIsLogin={setIsLogin} 
          />
        )}
      </main>

      {showAuth && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowAuth(false)} className="absolute" style={{ top: '2rem', right: '2rem', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center font-black italic text-2xl mb-8" style={{ width: '3.5rem', height: '3.5rem', background: 'var(--m-red)', borderRadius: '1rem', color: 'white', margin: '0 auto 2rem' }}>E</div>
              <h1 className="text-4xl font-black italic tracking-tighter mb-4 leading-none">{isLogin ? 'Welcome back.' : 'Join the party.'}</h1>
              <p className="text-text-muted font-bold">
                {isLogin ? "New to the platform? " : "Already an insider? "}
                <button onClick={() => setIsLogin(!isLogin)} className="text-m-teal font-black italic ml-1" style={{ borderBottom: '2px solid' }}>
                  {isLogin ? 'Create account' : 'Sign in'}
                </button>
              </p>
            </div>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {!isLogin && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Community Identity</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Display Name" required />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Email Workspace</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Secure Key</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 chars" required minLength={6} />
              </div>
              {authError && (
                <div className="text-m-red text-center font-black py-4" style={{ background: 'rgba(246, 64, 96, 0.05)', borderRadius: '1rem' }}>
                  {authError}
                </div>
              )}
              <button type="submit" className="btn-primary w-full py-5 text-xl font-black italic mt-4">
                  {isLogin ? 'Sign in' : 'Initialize Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="py-24" style={{ background: 'white', borderTop: '1px solid #e8e8e8' }}>
        <div className="container">
          <div className="flex flex-col md-flex justify-between items-start gap-12 mb-16 px-6">
            <div style={{ maxWidth: '300px' }}>
               <div className="flex items-center gap-2 mb-6">
                 <div className="flex items-center justify-center font-black italic text-sm" style={{ width: '2rem', height: '2rem', background: 'var(--m-red)', borderRadius: '0.5rem', color: 'white' }}>E</div>
                 <span className="logo" style={{ fontSize: '1.5rem' }}>Eventify</span>
               </div>
               <p className="text-text-muted font-bold leading-relaxed mb-8">Connecting people through passion, one experiment at a time. The premier community platform for London.</p>
               <div className="flex gap-4">
                 <div className="flex items-center justify-center" style={{ width: '2.5rem', height: '2.5rem', background: '#f9f9f9', borderRadius: '0.75rem', color: 'var(--text-muted)' }}><Github size={20} /></div>
               </div>
            </div>
            <div className="grid md-grid-cols-2 lg-grid-cols-3 gap-12 flex-grow">
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-dark">Navigate</h4>
                  <div className="flex flex-col gap-4 text-sm font-black text-text-muted">
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Find Groups</a>
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Top Events</a>
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Start Hosting</a>
                  </div>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-dark">Support</h4>
                  <div className="flex flex-col gap-4 text-sm font-black text-text-muted">
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Help Center</a>
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Safety Hub</a>
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Terms of Use</a>
                  </div>
               </div>
               <div className="lg-block" style={{ display: 'none', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 className="text-xs font-black uppercase tracking-widest text-text-dark">Community</h4>
                  <div className="flex flex-col gap-4 text-sm font-black text-text-muted">
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Our Story</a>
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Privacy</a>
                    <a href="#" className="btn-ghost" style={{ padding: 0 }}>Careers</a>
                  </div>
               </div>
            </div>
          </div>
          <div className="flex flex-col md-flex justify-between pt-12 gap-6 text-xs font-black uppercase tracking-widest text-text-muted px-6" style={{ borderTop: '1px solid #e8e8e8' }}>
             <p>&copy; 2026 Eventify UK. State of the Art Community Architecture.</p>
             <div className="flex flex-wrap gap-8">
               <span className="btn-ghost" style={{ padding: 0 }}>London</span>
               <span className="btn-ghost" style={{ padding: 0 }}>Tokyo</span>
               <span className="btn-ghost" style={{ padding: 0 }}>Berlin</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
