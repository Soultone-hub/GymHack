import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryInfo, CategoryId, Exercise } from '../types';
import { CategoryTile } from '../components/CategoryTile';
import { Search, SlidersHorizontal, Zap } from 'lucide-react';

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
  // Count exercises per category
  const getCategoryCount = (categoryId: CategoryId) => {
    return exercises.filter((ex) => ex.category === categoryId).length;
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-lg mx-auto animate-fade-in">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">
              GymHack
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bibliothèque d'exercices • Sélection par zone
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-700">
          <Zap className="w-3 h-3 fill-emerald-600 text-emerald-600" />
          <span>1 324 EXERCICES</span>
        </div>
      </div>

      {/* Fast Search Bar */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un exercice (ex: squat, tirage, dips...)"
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full hover:bg-slate-200"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Instant Search Overlay List if query is typed */}
      {searchQuery.trim() ? (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Résultats de recherche ({exercises.length})
          </p>
          {exercises.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
              Aucun exercice ne correspond à "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-2">
              {exercises.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onSelectExercise(ex)}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 cursor-pointer flex items-center justify-between shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    {(ex.image_url || ex.gif_url) && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img src={ex.image_url ?? ex.gif_url ?? ''} alt={ex.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">
                        {ex.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ex.body_part} • {ex.equipment}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                    {ex.target}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Main 2 columns x 5 rows Grid for the 10 categories */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                1. Choisissez une zone anatomique
              </span>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                10 zones
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat: CategoryInfo) => (
                <CategoryTile
                  key={cat.id}
                  category={cat}
                  exerciseCount={getCategoryCount(cat.id)}
                  onClick={() => onSelectCategory(cat.id)}
                />
              ))}
            </div>
          </div>

          {/* Shortcut Row + Equipment Filter Sheet Trigger */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Raccourcis & Filtre rapide
              </span>
              {selectedEquipment.length > 0 && (
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  {selectedEquipment.length} équipt
                </span>
              )}
            </div>

            {/* Horizontal Scroll Pill Row for Category Shortcuts */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {/* Equipment sheet button */}
              <button
                onClick={onOpenEquipmentSheet}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                  selectedEquipment.length > 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Équipement ↓</span>
              </button>

              {/* Category Pills */}
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="shrink-0 px-3 py-2 rounded-xl text-xs text-slate-700 bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors whitespace-nowrap font-medium"
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
