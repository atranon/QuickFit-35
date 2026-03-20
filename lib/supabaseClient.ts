import { createClient, SupabaseClient } from '@supabase/supabase-js';

/*
  WHY GRACEFUL DEGRADATION:

  Not every environment will have Supabase configured:
  - Local development without a .env file
  - A fork of the project that doesn't use Supabase
  - A build that accidentally lost the env vars

  Instead of crashing the entire app, we export `supabase` as
  either a real client or null. Every file that uses it checks
  for null first. This means:
  - With Supabase configured: full auth + cloud sync
  - Without Supabase: app works perfectly in localStorage-only mode
*/

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase not configured — running in offline mode. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable cloud sync.');
}

export { supabase };

// Helper to check if Supabase is available
export const isSupabaseConfigured = (): boolean => supabase !== null;
