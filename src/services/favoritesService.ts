import { supabase } from '../lib/supabase';

// ─── Fetch all favorite exercise IDs for a user ───────────────────────────────
export async function fetchFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('exercise_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchFavorites: ${error.message}`);
  return (data ?? []).map((row) => row.exercise_id as string);
}

// ─── Add a favorite ───────────────────────────────────────────────────────────
export async function addFavorite(userId: string, exerciseId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorites')
    .insert({ user_id: userId, exercise_id: exerciseId });

  if (error && !error.message.includes('duplicate')) {
    throw new Error(`addFavorite: ${error.message}`);
  }
}

// ─── Remove a favorite ────────────────────────────────────────────────────────
export async function removeFavorite(userId: string, exerciseId: string): Promise<void> {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId);

  if (error) throw new Error(`removeFavorite: ${error.message}`);
}
