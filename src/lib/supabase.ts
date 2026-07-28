import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment Variable Resolution with Fallbacks
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
const procEnv = typeof process !== 'undefined' ? process.env || {} : {};

const SUPABASE_URL =
  metaEnv.VITE_SUPABASE_URL ||
  procEnv.SUPABASE_URL ||
  'https://your-supabase-project.supabase.co';

const SUPABASE_ANON_KEY =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  procEnv.SUPABASE_ANON_KEY ||
  'your-supabase-anon-key';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    if (!SUPABASE_URL || SUPABASE_URL.includes('your-supabase-project')) {
      console.warn(
        'Supabase URL is not configured yet. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
      );
    }
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabaseClient();
