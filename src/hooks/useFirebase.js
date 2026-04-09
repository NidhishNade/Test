import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged, signOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile
} from 'firebase/auth';
import {
  collection, addDoc, onSnapshot, query,
  orderBy, doc, updateDoc, arrayUnion, arrayRemove
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from '../components/ToastContainer';

const DEFAULT_FORM = {
  title: '', description: '', date: '', location: '',
  image: 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80',
  category: 'Technology'
};

export function useFirebase() {
  const [user, setUser]         = useState(null);
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auth form state
  const [isLogin, setIsLogin]     = useState(true);
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [authError, setAuthError] = useState('');

  // Studio form state
  const [studioForm, setStudioForm] = useState(DEFAULT_FORM);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isLocal) {
        fetch('https://firestore.googleapis.com/google.firestore.v1.Firestore/Check', { mode: 'no-cors' })
          .catch(() => setIsBlocked(true));
      }
    });
    return unsub;
  }, []);

  // Events listener
  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // Auth handler
  const handleAuth = useCallback(async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      }
      setName(''); setEmail(''); setPassword('');
      toast.success(isLogin ? 'Welcome back! 👋' : 'Account created! Welcome 🎉');
      return true;
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':  setAuthError('This email is already registered. Try signing in.'); break;
        case 'auth/weak-password':         setAuthError('Password is too weak — use at least 6 characters.'); break;
        case 'auth/invalid-email':         setAuthError('Please enter a valid email address.'); break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':    setAuthError('Invalid email or password. Please try again.'); break;
        default: setAuthError('Something went wrong. Check your connection and try again.');
      }
      return false;
    }
  }, [isLogin, email, password, name]);

  // Create event
  const createEvent = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!user) { toast.error('You must be logged in to create an event.'); return; }
    if (!navigator.onLine) { toast.error('You appear to be offline.'); return; }

    setIsSubmitting(true);
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out. Check your ad blocker or firewall.')), 15000)
    );

    try {
      await Promise.race([
        addDoc(collection(db, 'events'), {
          ...studioForm,
          creatorId: user.uid,
          creatorEmail: user.email,
          rsvps: []
        }),
        timeout
      ]);
      toast.success('Event launched! 🚀');
      setStudioForm(DEFAULT_FORM);
      return true;
    } catch (err) {
      toast.error(`Failed to create: ${err.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, user, studioForm]);

  // RSVP toggle
  const toggleRSVP = useCallback(async (eventId, rsvps) => {
    if (!user) return false;
    const ref = doc(db, 'events', eventId);
    const isRsvped = rsvps?.includes(user.uid);
    try {
      await updateDoc(ref, { rsvps: isRsvped ? arrayRemove(user.uid) : arrayUnion(user.uid) });
      toast.success(isRsvped ? 'Removed from RSVP' : "You're going! 🎉");
      return true;
    } catch {
      toast.error('Failed to update RSVP.');
      return false;
    }
  }, [user]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    await signOut(auth);
    toast.info('Signed out');
  }, []);

  return {
    user, events, loading, isBlocked, isSubmitting,
    isLogin, setIsLogin,
    name, setName,
    email, setEmail,
    password, setPassword,
    authError, setAuthError,
    studioForm, setStudioForm,
    handleAuth,
    createEvent,
    toggleRSVP,
    handleSignOut,
  };
}
