import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './supabaseConfig';

const { url, publishableKey } = getSupabaseConfig();

export const supabase = createClient(url, publishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
