import { supabase } from '../lib/supabase';
import { WorkoutFolder } from '../types';

// ─── Types matching the DB schema ────────────────────────────────────────────
interface DBFolder {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  folder_exercises: DBFolderExercise[];
}

interface DBFolderExercise {
  id: string;
  exercise_id: string;
  position: number;
  custom_sets: string | null;
  notes: string | null;
}

// ─── Mapping DB → app ─────────────────────────────────────────────────────────
function dbFolderToApp(db: DBFolder): WorkoutFolder {
  const exercises = (db.folder_exercises ?? [])
    .sort((a, b) => a.position - b.position)
    .map((fe) => ({
      exerciseId: fe.exercise_id,
      customSets: fe.custom_sets ?? undefined,
      notes: fe.notes ?? undefined,
    }));

  return {
    id: db.id,
    name: db.name,
    createdAt: new Date(db.created_at).getTime(),
    exercises,
  };
}

// ─── Fetch all folders for a user ────────────────────────────────────────────
export async function fetchFolders(userId: string): Promise<WorkoutFolder[]> {
  const { data, error } = await supabase
    .from('workout_folders')
    .select('*, folder_exercises(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchFolders: ${error.message}`);
  return ((data ?? []) as DBFolder[]).map(dbFolderToApp);
}

// ─── Create a new folder ──────────────────────────────────────────────────────
export async function createFolder(userId: string, name: string): Promise<WorkoutFolder> {
  const { data, error } = await supabase
    .from('workout_folders')
    .insert({ user_id: userId, name })
    .select('*, folder_exercises(*)')
    .single();

  if (error) throw new Error(`createFolder: ${error.message}`);
  return dbFolderToApp(data as DBFolder);
}

// ─── Rename a folder ──────────────────────────────────────────────────────────
export async function renameFolder(folderId: string, name: string): Promise<void> {
  const { error } = await supabase
    .from('workout_folders')
    .update({ name })
    .eq('id', folderId);

  if (error) throw new Error(`renameFolder: ${error.message}`);
}

// ─── Delete a folder (cascades to folder_exercises) ──────────────────────────
export async function deleteFolder(folderId: string): Promise<void> {
  const { error } = await supabase
    .from('workout_folders')
    .delete()
    .eq('id', folderId);

  if (error) throw new Error(`deleteFolder: ${error.message}`);
}

// ─── Add an exercise to a folder ──────────────────────────────────────────────
export async function addExerciseToFolder(
  folderId: string,
  exerciseId: string,
  position: number,
): Promise<void> {
  const { error } = await supabase.from('folder_exercises').insert({
    folder_id: folderId,
    exercise_id: exerciseId,
    position,
  });

  if (error) throw new Error(`addExerciseToFolder: ${error.message}`);
}

// ─── Remove an exercise from a folder ─────────────────────────────────────────
export async function removeExerciseFromFolder(
  folderId: string,
  exerciseId: string,
): Promise<void> {
  const { error } = await supabase
    .from('folder_exercises')
    .delete()
    .eq('folder_id', folderId)
    .eq('exercise_id', exerciseId);

  if (error) throw new Error(`removeExerciseFromFolder: ${error.message}`);
}

// ─── Reorder exercises in a folder ────────────────────────────────────────────
// Sends one update per row (position change)
export async function reorderExercisesInFolder(
  folderId: string,
  exerciseIds: string[], // ordered list of exercise IDs
): Promise<void> {
  const updates = exerciseIds.map((exerciseId, position) =>
    supabase
      .from('folder_exercises')
      .update({ position })
      .eq('folder_id', folderId)
      .eq('exercise_id', exerciseId),
  );

  const results = await Promise.all(updates);
  const err = results.find((r) => r.error);
  if (err?.error) throw new Error(`reorderExercisesInFolder: ${err.error.message}`);
}
