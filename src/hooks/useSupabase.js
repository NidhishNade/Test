import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from '../components/ToastContainer';

const DEFAULT_FORM = {
  title: '', description: '', date: '', location: '',
  image: 'https://images.unsplash.com/photo-1540575861501-7c0b7b09d346?auto=format&fit=crop&w=800&q=80',
  category: 'Technology',
  price: 0
};

export function useSupabase() {
  const [user, setUser]         = useState(null);
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Events fetcher
  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data);
    }
  }, []);

  // Events listener (Real-time)
  useEffect(() => {
    fetchEvents();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auth handler
  const handleAuth = useCallback(async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name }
          }
        });
        if (error) throw error;
        // If confirmation is off, this is enough. If on, tell user.
        if (data?.session) {
           toast.success('Account created! Welcome 🎉');
        } else {
           toast.info('Please check your email to confirm your account!');
        }
      }
      setName(''); setEmail(''); setPassword('');
      if (isLogin) toast.success('Welcome back! 👋');
      return true;
    } catch (err) {
      console.error('Auth Error:', err);
      let msg = err.message;
      if (msg.toLowerCase().includes('rate limit')) {
        msg = 'Rate limit exceeded. Please wait a minute or disable email confirmation in Supabase dashboard.';
      }
      setAuthError(msg);
      return false;
    }
  }, [isLogin, email, password, name]);

  // Create event
  const createEvent = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    if (!user) { toast.error('You must be logged in to create an event.'); return; }

    setIsSubmitting(true);
    try {
      // Mapping frontend camelCase to backend snake_case
      const { maxAttendees, ...rest } = studioForm;
      
      const payload = {
        ...rest,
        price: parseFloat(studioForm.price) || 0,
        max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
        creator_id: user.id,
        creator_email: user.email,
        rsvps: []
      };

      const { error } = await supabase.from('events').insert(payload);

      if (error) throw error;

      await fetchEvents(); // Manually refresh list
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

  // Buy Ticket (Simulated Payment)
  const buyTicket = useCallback(async (event) => {
    if (!user) { toast.error('Please sign in to buy a ticket.'); return false; }
    
    try {
      // 1. Simulate a delay for "processing"
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 2. Add user to RSVPs
      const isRsvped = event.rsvps?.includes(user.id);
      if (isRsvped) {
        toast.info("You already have a ticket!");
        return true;
      }

      const newRsvps = [...(event.rsvps || []), user.id];
      
      const { error } = await supabase
        .from('events')
        .update({ rsvps: newRsvps })
        .eq('id', event.id);

      if (error) throw error;

      await fetchEvents(); // Refresh to show new RSVP count
      toast.success(`Payment successful! Ticket secured for ${event.title} 🎉`);
      return true;
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error('Payment failed. Please try again.');
      return false;
    }
  }, [user]);

  // RSVP toggle
  const toggleRSVP = useCallback(async (eventId, rsvps = []) => {
    if (!user) return false;
    const isRsvped = rsvps.includes(user.id);
    const newRsvps = isRsvped 
      ? rsvps.filter(id => id !== user.id) 
      : [...rsvps, user.id];

    try {
      const { error } = await supabase
        .from('events')
        .update({ rsvps: newRsvps })
        .eq('id', eventId);

      if (error) throw error;
      toast.success(isRsvped ? 'Removed from RSVP' : "You're going! 🎉");
      return true;
    } catch (err) {
      toast.error('Failed to update RSVP.');
      return false;
    }
  }, [user]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    toast.info('Signed out');
  }, []);

  return {
    user, events, loading, isBlocked: false, isSubmitting,
    isLogin, setIsLogin,
    name, setName,
    email, setEmail,
    password, setPassword,
    authError, setAuthError,
    studioForm, setStudioForm,
    handleAuth,
    createEvent,
    toggleRSVP,
    buyTicket,
    handleSignOut,
  };
}
