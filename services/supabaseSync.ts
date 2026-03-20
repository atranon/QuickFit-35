import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { createBackup, restoreBackup } from './storageService';
import { BackupData } from '../types';
import type { User } from '@supabase/supabase-js';

/*
  THE SYNC STRATEGY:

  We use a "last write wins" approach. Every sync pushes the
  ENTIRE BackupData blob as one JSON column. Simple, reliable,
  no merge conflicts.

  Sync happens:
  - Automatically after every workout completion (push)
  - On sign-in on a new device (pull + restore)
  - Manually from the Sync & Backup settings (push or pull)

  The tradeoff: we're sending the full backup every time, not
  just the delta. For typical users (under 500 workouts), this
  is a few hundred KB at most — well within reason.
*/

// ============================================
// AUTH FUNCTIONS
// ============================================

export async function signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!supabase) return { user: null, error: 'Cloud sync not configured.' };

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'Sign up succeeded but no user returned.' };

  return { user: data.user, error: null };
}

export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  if (!supabase) return { user: null, error: 'Cloud sync not configured.' };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}

export async function signOut(): Promise<{ error: string | null }> {
  if (!supabase) return { error: 'Cloud sync not configured.' };

  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Subscribe to auth state changes (sign in, sign out, token refresh).
 * Returns an unsubscribe function — call it when the component unmounts.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!supabase) return () => {};

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return () => subscription.unsubscribe();
}

// ============================================
// SYNC FUNCTIONS
// ============================================

/**
 * Push the current localStorage backup to Supabase.
 * Uses upsert — creates the row if it doesn't exist, updates if it does.
 * Returns true on success, false on failure.
 */
export async function pushBackup(): Promise<{ success: boolean; error: string | null }> {
  if (!supabase) return { success: false, error: 'Cloud sync not configured.' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not signed in.' };

  try {
    const backup = createBackup();

    const { error } = await supabase
      .from('user_backups')
      .upsert({
        user_id: user.id,
        backup_data: backup,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (error) return { success: false, error: error.message };
    return { success: true, error: null };
  } catch (e: any) {
    return { success: false, error: e.message || 'Push failed.' };
  }
}

/**
 * Pull the backup from Supabase and restore it to localStorage.
 * Returns the backup data so the UI can show what was restored,
 * or null if there's nothing to pull.
 */
export async function pullAndRestore(): Promise<{ data: BackupData | null; error: string | null }> {
  if (!supabase) return { data: null, error: 'Cloud sync not configured.' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not signed in.' };

  try {
    const { data, error } = await supabase
      .from('user_backups')
      .select('backup_data')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // PGRST116 = "no rows returned" — this just means no backup exists yet
      if (error.code === 'PGRST116') {
        return { data: null, error: null }; // Not an error, just empty
      }
      return { data: null, error: error.message };
    }

    if (!data?.backup_data) return { data: null, error: null };

    const backup = data.backup_data as BackupData;
    restoreBackup(backup);
    return { data: backup, error: null };
  } catch (e: any) {
    return { data: null, error: e.message || 'Pull failed.' };
  }
}

/**
 * Check when the user's cloud backup was last updated.
 * Useful for showing "Last synced: 5 min ago" in the UI.
 */
export async function getLastSyncTime(): Promise<string | null> {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    const { data, error } = await supabase
      .from('user_backups')
      .select('updated_at')
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;
    return data.updated_at;
  } catch {
    return null;
  }
}
