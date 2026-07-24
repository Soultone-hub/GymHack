import { supabase } from '../lib/supabase';
import { Exercise, CategoryId } from '../types';

export interface ExerciseFilters {
  category?: CategoryId | null;
  equipment?: string[];
  search?: string;
}

// ─── Fetch a list of exercises with optional server-side filters ──────────────
export async function fetchExercises(filters: ExerciseFilters = {}): Promise<Exercise[]> {
  let query = supabase.from('exercises').select('*');

  if (filters.category) {
    query = query.eq('body_part', filters.category);
  }

  if (filters.equipment && filters.equipment.length > 0) {
    query = query.in('equipment', filters.equipment);
  }

  if (filters.search && filters.search.trim()) {
    // Case-insensitive partial match on the exercise name
    query = query.ilike('name', `%${filters.search.trim()}%`);
  }

  const { data, error } = await query.order('name');
  if (error) throw new Error(`fetchExercises: ${error.message}`);
  return (data ?? []) as Exercise[];
}

// ─── Fetch a single exercise by its ID ───────────────────────────────────────
export async function fetchExerciseById(id: string): Promise<Exercise | null> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Exercise;
}

// ─── Fetch multiple exercises by ID (used in workout runner) ─────────────────
export async function fetchExercisesByIds(ids: string[]): Promise<Exercise[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .in('id', ids);

  if (error) throw new Error(`fetchExercisesByIds: ${error.message}`);
  return (data ?? []) as Exercise[];
}
