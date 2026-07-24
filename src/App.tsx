import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, CategoryId, Exercise, WorkoutFolder } from './types';
import { HomeView } from './views/HomeView';
import { ExerciseListView } from './views/ExerciseListView';
import { ExerciseDetailView } from './views/ExerciseDetailView';
import { WorkoutsView } from './views/WorkoutsView';
import { FavoritesView } from './views/FavoritesView';
import { ActiveWorkoutRunner } from './components/ActiveWorkoutRunner';
import { EquipmentSheet } from './components/EquipmentSheet';
import { AddToWorkoutModal } from './components/AddToWorkoutModal';
import { BottomNav } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { useGymData } from './hooks/useGymData';

import { fetchExercisesByIds } from './services/exerciseService';

export default function App() {
  const gym = useGymData();

  // ── Navigation state ────────────────────────────────────────────────────────
  const [currentView, setCurrentView]           = useState<ViewMode>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [searchQuery, setSearchQuery]           = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  // ── Modals & Sheets ─────────────────────────────────────────────────────────
  const [isEquipmentSheetOpen, setIsEquipmentSheetOpen]   = useState(false);
  const [exerciseToAdd, setExerciseToAdd]                 = useState<Exercise | null>(null);
  const [activeRunningFolder, setActiveRunningFolder]     = useState<WorkoutFolder | null>(null);

  // ── Load exercises whenever filters change ──────────────────────────────────
  useEffect(() => {
    if (currentView === 'list' || currentView === 'home') {
      gym.loadExercises({
        category: selectedCategory,
        equipment: selectedEquipment,
        search: searchQuery,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedEquipment, searchQuery, currentView]);

  // ── Load exercises for favorite exercises (needed in WorkoutsView / Runner) ─
  // allExercises for the workout runner comes from gym.exercises (already loaded)
  // For the runner we also need exercises not currently filtered, so we load them
  // lazily when a folder is opened
  const [runnerExercises, setRunnerExercises] = useState<Exercise[]>([]);

  const handleStartSession = useCallback(async (folder: WorkoutFolder) => {
    // Fetch all exercises referenced by this folder
    const ids = folder.exercises.map((e) => e.exerciseId);
    // They may already be in gym.exercises — just filter
    const cached = ids
      .map((id) => gym.exercises.find((ex) => ex.id === id))
      .filter(Boolean) as Exercise[];

    // Kick off a fallback load for any not-yet-loaded
    if (cached.length === ids.length) {
      setRunnerExercises(cached);
    } else {
      const fetched = await fetchExercisesByIds(ids);
      setRunnerExercises(fetched);
    }

    setActiveRunningFolder(folder);
    setCurrentView('active-workout');
  }, [gym.exercises]);

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (gym.isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!gym.user) {
    return (
      <AuthScreen
        onSignInWithGoogle={gym.signInWithGoogle}
        onSignInWithEmail={gym.signInWithEmail}
        onSignUpWithEmail={gym.signUpWithEmail}
        isLoading={gym.isAuthLoading}
      />
    );
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelectCategory = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView('list');
  };

  const handleToggleEquipment = (eq: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(eq) ? prev.filter((item) => item !== eq) : [...prev, eq],
    );
  };

  const handleToggleFavorite = (e: React.MouseEvent | null, exercise: Exercise) => {
    if (e) e.stopPropagation();
    gym.toggleFavorite(exercise);
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedEquipment([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      <main className="flex-1 w-full">

        {/* HOME */}
        {currentView === 'home' && (
          <HomeView
            exercises={gym.exercises}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectCategory={handleSelectCategory}
            onOpenEquipmentSheet={() => setIsEquipmentSheetOpen(true)}
            selectedEquipment={selectedEquipment}
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
              setCurrentView('detail');
            }}
          />
        )}

        {/* LIST */}
        {currentView === 'list' && (
          <ExerciseListView
            exercises={gym.exercises}
            isLoading={gym.isExercisesLoading}
            selectedCategory={selectedCategory}
            selectedEquipment={selectedEquipment}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectCategory={setSelectedCategory}
            onToggleEquipment={handleToggleEquipment}
            onOpenEquipmentSheet={() => setIsEquipmentSheetOpen(true)}
            onClearFilters={handleClearFilters}
            favorites={gym.favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToWorkout={(e, ex) => { e.stopPropagation(); setExerciseToAdd(ex); }}
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
              setCurrentView('detail');
            }}
            onBackToHome={() => setCurrentView('home')}
          />
        )}

        {/* DETAIL */}
        {currentView === 'detail' && selectedExercise && (
          <ExerciseDetailView
            exercise={selectedExercise}
            isFavorite={gym.favorites.includes(selectedExercise.id)}
            onBack={() => setCurrentView('list')}
            onToggleFavorite={(ex) => gym.toggleFavorite(ex)}
            onAddToWorkout={(ex) => setExerciseToAdd(ex)}
          />
        )}

        {/* WORKOUTS */}
        {currentView === 'workouts' && (
          <WorkoutsView
            folders={gym.folders}
            allExercises={gym.exercises}
            onCreateFolder={gym.handleCreateFolder}
            onRenameFolder={gym.handleRenameFolder}
            onDeleteFolder={gym.handleDeleteFolder}
            onRemoveExerciseFromFolder={gym.handleRemoveExerciseFromFolder}
            onReorderExercisesInFolder={gym.handleReorderExercisesInFolder}
            onStartSession={handleStartSession}
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
              setCurrentView('detail');
            }}
          />
        )}

        {/* FAVORITES */}
        {currentView === 'favorites' && (
          <FavoritesView
            favoriteExercises={gym.favoriteExercises}
            onSelectExercise={(ex) => {
              setSelectedExercise(ex);
              setCurrentView('detail');
            }}
            onRemoveFavorite={(e, ex) => handleToggleFavorite(e, ex)}
            onAddToWorkout={(e, ex) => { e.stopPropagation(); setExerciseToAdd(ex); }}
          />
        )}

        {/* ACTIVE WORKOUT RUNNER */}
        {currentView === 'active-workout' && activeRunningFolder && (
          <ActiveWorkoutRunner
            folder={activeRunningFolder}
            allExercises={runnerExercises}
            onFinishWorkout={() => {
              setActiveRunningFolder(null);
              setCurrentView('workouts');
            }}
            onClose={() => setCurrentView('workouts')}
          />
        )}
      </main>

      {/* Equipment Drawer */}
      <EquipmentSheet
        isOpen={isEquipmentSheetOpen}
        selectedEquipment={selectedEquipment}
        onClose={() => setIsEquipmentSheetOpen(false)}
        onSelectEquipment={handleToggleEquipment}
        onClearAll={() => setSelectedEquipment([])}
      />

      {/* Add To Workout Modal */}
      <AddToWorkoutModal
        exercise={exerciseToAdd}
        folders={gym.folders}
        onClose={() => setExerciseToAdd(null)}
        onCreateFolderAndAdd={gym.handleCreateFolderAndAdd}
        onToggleExerciseInFolder={gym.handleToggleExerciseInFolder}
      />

      {/* Bottom Nav */}
      {currentView !== 'active-workout' && (
        <BottomNav
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            if (view === 'home') setSelectedCategory(null);
          }}
          favoritesCount={gym.favorites.length}
          workoutsCount={gym.folders.length}
          hasActiveSession={!!activeRunningFolder}
          onLaunchActiveSession={() => setCurrentView('active-workout')}
        />
      )}
    </div>
  );
}
