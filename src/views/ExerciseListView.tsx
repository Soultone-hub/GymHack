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
      {/* Top Nav Row */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 font-body font-bold text-xs text-black bg-white px-3 py-2 rounded-xl border-2 border-black nb-shadow-sm nb-press"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zones</span>
        </button>

        <h2 className="font-display text-lg text-black tracking-wide">
          {activeCategoryObj ? activeCategoryObj.name_fr : 'Tous les Exercices'}
        </h2>

        <button
          onClick={onOpenEquipmentSheet}
          className={`flex items-center gap-1 px-3 py-2 rounded-xl font-body font-bold text-xs border-2 border-black nb-shadow-sm nb-press transition-colors ${
            selectedEquipment.length > 0
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-zinc-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filtres</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filtrer par nom…"
          className="w-full bg-white border-2 border-black rounded-xl pl-9 pr-4 py-2.5 font-body text-xs text-black placeholder-zinc-400 focus:outline-none focus:bg-zinc-50 nb-shadow transition-all"
        />
      </div>

      {/* Active Filter Pills */}
      {(selectedCategory || selectedEquipment.length > 0 || searchQuery) && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-3">
          {selectedCategory && activeCategoryObj && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold bg-black text-white border-2 border-black nb-shadow-sm">
              {activeCategoryObj.name_fr}
              <button onClick={() => onSelectCategory(null)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedEquipment.map((eq) => (
            <span
              key={eq}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold bg-zinc-100 text-black border-2 border-black nb-shadow-sm"
            >
              {EQUIPMENT_FRENCH_MAP[eq] ?? eq}
              <button onClick={() => onToggleEquipment(eq)} className="hover:opacity-70">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            onClick={onClearFilters}
            className="shrink-0 font-mono text-[10px] font-bold text-black underline ml-1 hover:opacity-60"
          >
            Effacer tout
          </button>
        </div>
      )}

      {/* Results Counter */}
      <div className="mb-3">
        {isLoading ? (
          <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-zinc-500 uppercase">
            <Loader2 className="w-3 h-3 animate-spin" /> Chargement…
          </span>
        ) : (
          <span className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
            {exercises.length} exercice{exercises.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-zinc-100 border-2 border-zinc-200 animate-pulse aspect-[4/5]" />
          ))}
        </div>
      ) : exercises.length === 0 ? (
        <div className="p-8 text-center border-2 border-black border-dashed rounded-2xl bg-zinc-50 my-4">
          <p className="font-display text-xl text-black mb-1">Aucun résultat</p>
          <p className="font-body text-xs text-zinc-500 mb-4">Essayez de réinitialiser vos filtres.</p>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs nb-shadow-sm nb-press hover:bg-zinc-800 transition-colors"
          >
            Réinitialiser
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
