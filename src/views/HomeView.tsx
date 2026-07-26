import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryInfo, CategoryId, Exercise } from '../types';
import { CategoryTile } from '../components/CategoryTile';
import { Search, SlidersHorizontal } from 'lucide-react';

interface HomeViewProps {
  exercises: Exercise[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenEquipmentSheet: () => void;
  selectedEquipment: string[];
  onSelectExercise: (exercise: Exercise) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  exercises,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onOpenEquipmentSheet,
  selectedEquipment,
  onSelectExercise,
}) => {
  const getCategoryCount = (categoryId: CategoryId) =>
    exercises.filter((ex) => ex.category === categoryId).length;

  return (
    <div className="pb-28 pt-5 px-4 max-w-lg mx-auto animate-fade-in">

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un exercice…"
          className="w-full bg-white border-2 border-black rounded-xl pl-10 pr-4 py-3 font-body text-sm text-black placeholder-zinc-400 focus:outline-none focus:bg-zinc-50 nb-shadow transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-black bg-zinc-100 border border-black px-2 py-0.5 rounded-md hover:bg-zinc-200"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Search Results */}
      {searchQuery.trim() ? (
        <div className="space-y-2">
          <p className="font-mono text-[11px] font-medium text-zinc-600 uppercase tracking-wider mb-3">
            {exercises.length} résultat{exercises.length > 1 ? 's' : ''} pour "{searchQuery}"
          </p>
          {exercises.length === 0 ? (
            <div className="p-6 text-center border-2 border-black rounded-2xl nb-shadow bg-white">
              <p className="font-body text-sm font-bold text-black">Aucun résultat</p>
              <p className="font-body text-xs text-zinc-500 mt-1">Essayez un autre terme de recherche.</p>
            </div>
          ) : (
            exercises.map((ex) => (
              <div
                key={ex.id}
                onClick={() => onSelectExercise(ex)}
                className="p-3.5 bg-white rounded-xl border-2 border-black nb-shadow nb-press cursor-pointer flex items-center justify-between hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {(ex.image_url || ex.gif_url) && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border-2 border-black">
                      <img src={ex.image_url ?? ex.gif_url ?? ''} alt={ex.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-body font-bold text-sm text-black">{ex.name}</h4>
                    <p className="font-mono text-[10px] text-zinc-500 mt-0.5">{ex.body_part} · {ex.equipment}</p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-medium text-black bg-zinc-100 border border-black px-2 py-0.5 rounded-md shrink-0">
                  {ex.target}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Section Title */}
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Zone anatomique
            </p>
            <span className="font-mono text-[10px] text-black bg-zinc-100 border-2 border-black px-2 py-0.5 rounded-md nb-shadow-sm">
              10 zones
            </span>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {CATEGORIES.map((cat: CategoryInfo) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                exerciseCount={getCategoryCount(cat.id)}
                onClick={() => onSelectCategory(cat.id)}
              />
            ))}
          </div>

          {/* Equipment Filter Row */}
          <div className="border-2 border-black rounded-2xl p-4 bg-white nb-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[11px] font-bold text-black uppercase tracking-wider">
                Filtre Équipement
              </p>
              {selectedEquipment.length > 0 && (
                <span className="font-mono text-[10px] font-bold text-white bg-black border border-black px-2 py-0.5 rounded-md">
                  {selectedEquipment.length} actif{selectedEquipment.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={onOpenEquipmentSheet}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-body font-bold flex items-center gap-1.5 transition-colors border-2 border-black nb-shadow-sm nb-press ${
                  selectedEquipment.length > 0
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Équipement</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="shrink-0 px-3 py-2 rounded-xl font-body font-semibold text-xs text-black bg-white border-2 border-black nb-shadow-sm nb-press hover:bg-zinc-100 transition-colors whitespace-nowrap"
                >
                  {cat.name_fr}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
