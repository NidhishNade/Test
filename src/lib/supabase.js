import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://recyqjgjkxgwghpeluse.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_mKkozU_ZdjamM08pnN1W1w_LgAVKbNC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
