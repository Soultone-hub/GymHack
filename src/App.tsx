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
import { Header } from './components/Header';
import { SearchOverlay } from './components/SearchOverlay';
import { AuthScreen } from './components/AuthScreen';
import { useGymData } from './hooks/useGymData';
import { fetchExercisesByIds } from './services/exerciseService';

/** Parse window.location.hash into a view + optional exercise id */
function parseHash(): { view: ViewMode; exerciseId?: string } {
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('detail/')) return { view: 'detail', exerciseId: hash.slice(7) };
  const validViews: ViewMode[] = ['home', 'list', 'workouts', 'favorites'];
  if (validViews.includes(hash as ViewMode)) return { view: hash as ViewMode };
  return { view: 'home' };
}

export default function App() {
  const gym = useGymData();

  // ── Navigation state (seeded from URL hash) ─────────────────────────────────
  const [currentView, setCurrentView]             = useState<ViewMode>(() => parseHash().view);
  const [selectedCategory, setSelectedCategory]   = useState<CategoryId | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [searchQuery, setSearchQuery]             = useState('');
  const [selectedExercise, setSelectedExercise]   = useState<Exercise | null>(null);

  // ── Sync hash → state on browser back/forward ───────────────────────────────
  useEffect(() => {
    const onHashChange = () => {
      const { view } = parseHash();
      setCurrentView(view);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Sync state → hash whenever view changes ─────────────────────────────────
  const navigate = useCallback((view: ViewMode, exerciseId?: string) => {
    setCurrentView(view);
    const hash = view === 'detail' && exerciseId ? `detail/${exerciseId}` : view;
    window.history.replaceState(null, '', `#${hash}`);
  }, []);

  // ── Search Overlay ───────────────────────────────────────────────────────────
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchOverlayQuery, setSearchOverlayQuery] = useState('');

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

  // ── Load exercises for search overlay ───────────────────────────────────────
  useEffect(() => {
    if (isSearchOpen && searchOverlayQuery.trim()) {
      gym.loadExercises({ search: searchOverlayQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOverlayQuery, isSearchOpen]);

  // ── Load exercises for favorite exercises (needed in WorkoutsView / Runner) ─
  const [runnerExercises, setRunnerExercises] = useState<Exercise[]>([]);

  const handleStartSession = useCallback(async (folder: WorkoutFolder) => {
    const ids = folder.exercises.map((e) => e.exerciseId);
    const cached = ids
      .map((id) => gym.exercises.find((ex) => ex.id === id))
      .filter(Boolean) as Exercise[];

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-black border-2 border-black nb-shadow flex items-center justify-center">
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">Chargement…</span>
        </div>
      </div>
    );
  }

  if (!gym.user) {
    return (
      <AuthScreen
        onSignInWithGoogle={gym.signInWithGoogle}
        onSignInWithEmail={gym.signInWithEmail}
        onSignUpWithEmail={gym.signUpWithEmail}
        onResetPassword={gym.resetPasswordForEmail}
        isLoading={gym.isAuthLoading}
      />
    );
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelectCategory = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
    navigate('list');
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

  const goToDetail = (ex: Exercise) => {
    setSelectedExercise(ex);
    navigate('detail', ex.id);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between">
      {/* Global Header */}
      {currentView !== 'active-workout' && (
        <Header
          onSearchClick={() => setIsSearchOpen(true)}
        />
      )}

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        searchQuery={searchOverlayQuery}
        onSearchChange={setSearchOverlayQuery}
        onClose={() => setIsSearchOpen(false)}
        exercises={searchOverlayQuery.trim() ? gym.exercises : []}
        isLoading={gym.isExercisesLoading}
        onSelectExercise={(ex) => {
          goToDetail(ex);
          setIsSearchOpen(false);
          setSearchOverlayQuery('');
        }}
      />

      <main className="flex-1 w-full">

        {/* HOME */}
        {currentView === 'home' && (
          <HomeView
            exercises={gym.exercises}
            onSelectCategory={handleSelectCategory}
            onOpenEquipmentSheet={() => setIsEquipmentSheetOpen(true)}
            selectedEquipment={selectedEquipment}
            onSelectExercise={goToDetail}
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
            onSelectExercise={goToDetail}
            onBackToHome={() => navigate('home')}
          />
        )}

        {/* DETAIL */}
        {currentView === 'detail' && selectedExercise && (
          <ExerciseDetailView
            exercise={selectedExercise}
            isFavorite={gym.favorites.includes(selectedExercise.id)}
            onBack={() => navigate('list')}
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
            onSelectExercise={goToDetail}
          />
        )}

        {/* FAVORITES */}
        {currentView === 'favorites' && (
          <FavoritesView
            favoriteExercises={gym.favoriteExercises}
            onSelectExercise={goToDetail}
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
              navigate('workouts');
            }}
            onClose={() => navigate('workouts')}
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
            navigate(view);
            if (view === 'home') setSelectedCategory(null);
          }}
          favoritesCount={gym.favorites.length}
          workoutsCount={gym.folders.length}
          hasActiveSession={!!activeRunningFolder}
          onLaunchActiveSession={() => navigate('active-workout')}
          onSignOut={gym.signOut}
        />
      )}
    </div>
  );
}
