import { supabase } from '../lib/supabase';

// ─── Fetch all favorite exercise IDs for a user ───────────────────────────────
// NOTE: user_id filter removed — Row Level Security (RLS) on user_favorites
// must enforce `auth.uid() = user_id` so the server does the ownership check,
// not the client. This also prevents any client-side spoofing of user_id.
export async function fetchFavorites(): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('exercise_id')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchFavorites: ${error.message}`);
  return (data ?? []).map((row) => row.exercise_id as string);
}

// ─── Add a favorite ───────────────────────────────────────────────────────────
// user_id is omitted from the insert — the RLS policy / column DEFAULT
// sets it to auth.uid() server-side so the client cannot spoof another user.
export async function addFavorite(exerciseId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorites')
    .insert({ exercise_id: exerciseId });

  if (error && !error.message.includes('duplicate')) {
    throw new Error(`addFavorite: ${error.message}`);
  }
}

// ─── Remove a favorite ────────────────────────────────────────────────────────
// user_id filter removed — RLS ensures only the authenticated user's rows
// are visible/deletable, so the extra .eq('user_id') is redundant and
// gives attackers confirmation the field name exists.
export async function removeFavorite(exerciseId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('exercise_id', exerciseId);

  if (error) throw new Error(`removeFavorite: ${error.message}`);
}
