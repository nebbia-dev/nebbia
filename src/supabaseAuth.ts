import { queryOptions } from '@tanstack/react-query';
import { supabase } from './supabaseClient';

export const authSessionQueryOptions = queryOptions({
  queryKey: ['supabase', 'auth', 'session'],
  queryFn: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false,
});

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error('Supabase non ha restituito una sessione valida.');
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
