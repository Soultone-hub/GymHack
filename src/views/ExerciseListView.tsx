import React from 'react';
import { CategoryId, Exercise } from '../types';
import { CATEGORIES, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { ExerciseCard } from '../components/ExerciseCard';
import { SlidersHorizontal, X, ArrowLeft, Search, Loader2 } from 'lucide-react';

interface ExerciseListViewProps {
  exercises: Exercise[];
  isLoading?: boolean;
  selectedCategory: CategoryId | null;
  selectedEquipment: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: CategoryId | null) => void;
  onToggleEquipment: (equipment: string) => void;
  onOpenEquipmentSheet: () => void;
  onClearFilters: () => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent, exercise: Exercise) => void;
  onAddToWorkout: (e: React.MouseEvent, exercise: Exercise) => void;
  onSelectExercise: (exercise: Exercise) => void;
  onBackToHome: () => void;
}

export const ExerciseListView: React.FC<ExerciseListViewProps> = ({
  exercises,
  isLoading = false,
  selectedCategory,
  selectedEquipment,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onToggleEquipment,
  onOpenEquipmentSheet,
  onClearFilters,
  favorites,
  onToggleFavorite,
  onAddToWorkout,
  onSelectExercise,
  onBackToHome,
}) => {
  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="pb-28 pt-4 px-4 max-w-lg mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zones</span>
        </button>

        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {activeCategoryObj ? activeCategoryObj.name_fr : 'Tous les Exercices'}
        </h2>

        <button
          onClick={onOpenEquipmentSheet}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
            selectedEquipment.length > 0
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 shadow-sm'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filtrer par nom…"
          className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
        />
      </div>

      {/* Active Filter Pills */}
      {(selectedCategory || selectedEquipment.length > 0 || searchQuery) && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
          {selectedCategory && activeCategoryObj && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
              {activeCategoryObj.name_fr}
              <button onClick={() => onSelectCategory(null)} className="hover:opacity-80">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedEquipment.map((eq) => (
            <span
              key={eq}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-900 border border-blue-200"
            >
              {EQUIPMENT_FRENCH_MAP[eq] ?? eq}
              <button onClick={() => onToggleEquipment(eq)} className="text-blue-600 hover:text-blue-800">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={onClearFilters}
            className="shrink-0 text-[11px] font-semibold text-slate-500 underline ml-1 hover:text-slate-800"
          >
            Tout effacer
          </button>
        </div>
      )}

      {/* Results Counter */}
      <div className="flex items-center justify-between mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
        {isLoading ? (
          <span className="flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin" /> Chargement…
          </span>
        ) : (
          <span>{exercises.length} EXERCICE{exercises.length > 1 ? 'S' : ''} DISPONIBLE{exercises.length > 1 ? 'S' : ''}</span>
        )}
      </div>

      {/* 2-Column Cards Grid */}
      {isLoading ? (
        // Skeleton loader
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-slate-100 animate-pulse aspect-[4/5]" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 my-4 shadow-sm">
          <p className="font-bold text-base text-slate-900 mb-1">Aucun exercice trouvé</p>
          <p className="text-xs">Essayez de réinitialiser vos filtres ou de changer de zone.</p>
          <button
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              isFavorite={favorites.includes(ex.id)}
              onSelect={onSelectExercise}
              onToggleFavorite={onToggleFavorite}
              onAddToWorkout={onAddToWorkout}
            />
          ))}
        </div>
      )}
    </div>
  );
};
