import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Exercise, WorkoutFolder, CategoryId } from '../types';
import { fetchExercises, fetchExercisesByIds, ExerciseFilters } from '../services/exerciseService';
import { fetchFavorites, addFavorite, removeFavorite } from '../services/favoritesService';
import {
  fetchFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  addExerciseToFolder,
  removeExerciseFromFolder,
  reorderExercisesInFolder,
} from '../services/workoutService';

// ─── State shape ─────────────────────────────────────────────────────────────
export interface GymDataState {
  // Auth
  user: User | null;
  session: Session | null;
  isAuthLoading: boolean;

  // Exercises (server-side filtered)
  exercises: Exercise[];
  isExercisesLoading: boolean;
  exerciseError: string | null;

  // Favorites (exercise IDs)
  favorites: string[];
  favoriteExercises: Exercise[];

  // Workout folders
  folders: WorkoutFolder[];
  isFoldersLoading: boolean;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useGymData() {
  const [state, setState] = useState<GymDataState>({
    user: null,
    session: null,
    isAuthLoading: true,
    exercises: [],
    isExercisesLoading: false,
    exerciseError: null,
    favorites: [],
    favoriteExercises: [],
    folders: [],
    isFoldersLoading: false,
  });

  // ── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((s) => ({
        ...s,
        session,
        user: session?.user ?? null,
        isAuthLoading: false,
      }));
      if (session?.user) loadUserData(session.user.id);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState((s) => ({
          ...s,
          session,
          user: session?.user ?? null,
          isAuthLoading: false,
        }));
        if (session?.user) {
          loadUserData(session.user.id);
        } else {
          // Signed out — clear user data
          setState((s) => ({
            ...s,
            favorites: [],
            favoriteExercises: [],
            folders: [],
          }));
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Load user-specific data ───────────────────────────────────────────────
  async function loadUserData(userId: string) {
    setState((s) => ({ ...s, isFoldersLoading: true }));
    try {
      const [favIds, folders] = await Promise.all([
        fetchFavorites(userId),
        fetchFolders(userId),
      ]);

      // Fetch full exercise objects for favorites
      const favExercises = favIds.length > 0
        ? await fetchExercisesByIds(favIds)
        : [];

      setState((s) => ({
        ...s,
        favorites: favIds,
        favoriteExercises: favExercises,
        folders,
        isFoldersLoading: false,
      }));
    } catch (err) {
      console.error('loadUserData error:', err);
      setState((s) => ({ ...s, isFoldersLoading: false }));
    }
  }

  // ── Load exercises (called when filters change) ───────────────────────────
  const loadExercises = useCallback(async (filters: ExerciseFilters = {}) => {
    setState((s) => ({ ...s, isExercisesLoading: true, exerciseError: null }));
    try {
      const exercises = await fetchExercises(filters);
      setState((s) => ({ ...s, exercises, isExercisesLoading: false }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de chargement';
      setState((s) => ({ ...s, exerciseError: msg, isExercisesLoading: false }));
    }
  }, []);

  // ── Auth handlers ─────────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ── Favorites handlers ────────────────────────────────────────────────────
  const toggleFavorite = useCallback(
    async (exercise: Exercise) => {
      const { user } = state;
      if (!user) return;

      const isFav = state.favorites.includes(exercise.id);
      // Optimistic update
      const newFavIds = isFav
        ? state.favorites.filter((id) => id !== exercise.id)
        : [...state.favorites, exercise.id];

      const newFavExercises = isFav
        ? state.favoriteExercises.filter((ex) => ex.id !== exercise.id)
        : [...state.favoriteExercises, exercise];

      setState((s) => ({
        ...s,
        favorites: newFavIds,
        favoriteExercises: newFavExercises,
      }));

      try {
        if (isFav) {
          await removeFavorite(user.id, exercise.id);
        } else {
          await addFavorite(user.id, exercise.id);
        }
      } catch (err) {
        // Rollback on error
        console.error('toggleFavorite error:', err);
        setState((s) => ({
          ...s,
          favorites: state.favorites,
          favoriteExercises: state.favoriteExercises,
        }));
      }
    },
    [state],
  );

  // ── Folder handlers ───────────────────────────────────────────────────────
  const handleCreateFolder = useCallback(
    async (name: string) => {
      if (!state.user) return;
      try {
        const folder = await createFolder(state.user.id, name);
        setState((s) => ({ ...s, folders: [folder, ...s.folders] }));
      } catch (err) {
        console.error('handleCreateFolder error:', err);
      }
    },
    [state.user],
  );

  const handleRenameFolder = useCallback(async (folderId: string, name: string) => {
    setState((s) => ({
      ...s,
      folders: s.folders.map((f) => (f.id === folderId ? { ...f, name } : f)),
    }));
    try {
      await renameFolder(folderId, name);
    } catch (err) {
      console.error('handleRenameFolder error:', err);
    }
  }, []);

  const handleDeleteFolder = useCallback(async (folderId: string) => {
    setState((s) => ({ ...s, folders: s.folders.filter((f) => f.id !== folderId) }));
    try {
      await deleteFolder(folderId);
    } catch (err) {
      console.error('handleDeleteFolder error:', err);
    }
  }, []);

  const handleToggleExerciseInFolder = useCallback(
    async (folderId: string, exerciseId: string) => {
      setState((s) => {
        const folders = s.folders.map((f) => {
          if (f.id !== folderId) return f;
          const exists = f.exercises.some((e) => e.exerciseId === exerciseId);
          return {
            ...f,
            exercises: exists
              ? f.exercises.filter((e) => e.exerciseId !== exerciseId)
              : [...f.exercises, { exerciseId }],
          };
        });
        return { ...s, folders };
      });

      const folder = state.folders.find((f) => f.id === folderId);
      if (!folder) return;
      const exists = folder.exercises.some((e) => e.exerciseId === exerciseId);
      try {
        if (exists) {
          await removeExerciseFromFolder(folderId, exerciseId);
        } else {
          await addExerciseToFolder(folderId, exerciseId, folder.exercises.length);
        }
      } catch (err) {
        console.error('handleToggleExerciseInFolder error:', err);
      }
    },
    [state.folders],
  );

  const handleCreateFolderAndAdd = useCallback(
    async (folderName: string, exerciseId: string) => {
      if (!state.user) return;
      try {
        const folder = await createFolder(state.user.id, folderName);
        await addExerciseToFolder(folder.id, exerciseId, 0);
        const updatedFolder = { ...folder, exercises: [{ exerciseId }] };
        setState((s) => ({ ...s, folders: [updatedFolder, ...s.folders] }));
      } catch (err) {
        console.error('handleCreateFolderAndAdd error:', err);
      }
    },
    [state.user],
  );

  const handleRemoveExerciseFromFolder = useCallback(
    async (folderId: string, exerciseId: string) => {
      setState((s) => ({
        ...s,
        folders: s.folders.map((f) =>
          f.id !== folderId
            ? f
            : { ...f, exercises: f.exercises.filter((e) => e.exerciseId !== exerciseId) },
        ),
      }));
      try {
        await removeExerciseFromFolder(folderId, exerciseId);
      } catch (err) {
        console.error('handleRemoveExerciseFromFolder error:', err);
      }
    },
    [],
  );

  const handleReorderExercisesInFolder = useCallback(
    async (folderId: string, fromIndex: number, toIndex: number) => {
      setState((s) => {
        const folders = s.folders.map((f) => {
          if (f.id !== folderId) return f;
          const updated = [...f.exercises];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return { ...f, exercises: updated };
        });
        return { ...s, folders };
      });

      const folder = state.folders.find((f) => f.id === folderId);
      if (!folder) return;
      const updated = [...folder.exercises];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);

      try {
        await reorderExercisesInFolder(
          folderId,
          updated.map((e) => e.exerciseId),
        );
      } catch (err) {
        console.error('handleReorderExercisesInFolder error:', err);
      }
    },
    [state.folders],
  );

  return {
    ...state,
    // Actions
    loadExercises,
    signInWithGoogle,
    signOut,
    toggleFavorite,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    handleToggleExerciseInFolder,
    handleCreateFolderAndAdd,
    handleRemoveExerciseFromFolder,
    handleReorderExercisesInFolder,
  };
}
