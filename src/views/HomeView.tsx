import React from 'react';
import { CATEGORIES } from '../data/categories';
import { CategoryInfo, CategoryId, Exercise } from '../types';
import { CategoryTile } from '../components/CategoryTile';
import { SlidersHorizontal } from 'lucide-react';

interface HomeViewProps {
  exercises: Exercise[];
  onSelectCategory: (categoryId: CategoryId) => void;
  onOpenEquipmentSheet: () => void;
  selectedEquipment: string[];
  onSelectExercise: (exercise: Exercise) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  exercises,
  onSelectCategory,
  onOpenEquipmentSheet,
  selectedEquipment,
}) => {
  const getCategoryCount = (categoryId: CategoryId) =>
    exercises.filter((ex) => ex.category === categoryId).length;

  return (
    <div className="pb-28 pt-5 px-4 max-w-lg mx-auto animate-fade-in">

      {/* Section label */}
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
            <span>Choisir l'équipement</span>
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
    </div>
  );
};
