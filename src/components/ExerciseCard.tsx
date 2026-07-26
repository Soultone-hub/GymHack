import React from 'react';
import { Exercise } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { AnatomicalIcon } from './AnatomicalIcon';
import { Heart, Plus } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite: boolean;
  onSelect: (exercise: Exercise) => void;
  onToggleFavorite: (e: React.MouseEvent, exercise: Exercise) => void;
  onAddToWorkout: (e: React.MouseEvent, exercise: Exercise) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onAddToWorkout,
}) => {
  const isCardio = exercise.category === 'cardio';
  const targetFr = TARGET_FRENCH_MAP[exercise.target] ?? exercise.target;
  const equipmentFr = EQUIPMENT_FRENCH_MAP[exercise.equipment] ?? exercise.equipment;

  return (
    <div
      onClick={() => onSelect(exercise)}
      className="group relative bg-white rounded-2xl border-2 border-black nb-shadow nb-press cursor-pointer flex flex-col overflow-hidden hover:bg-zinc-50 transition-colors"
    >
      {/* GIF / Image Thumbnail */}
      <div className="relative w-full aspect-square bg-zinc-100 overflow-hidden border-b-2 border-black">
        {exercise.gif_url ? (
          <img
            src={exercise.gif_url}
            alt={exercise.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : exercise.image_url ? (
          <img
            src={exercise.image_url}
            alt={exercise.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-200">
            <AnatomicalIcon
              icon={isCardio ? 'pulse' : exercise.category.replace(' ', '')}
              isCardio={isCardio}
              className="w-10 h-10 opacity-40"
            />
          </div>
        )}

        {/* Favorite & Add buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            onClick={(e) => onToggleFavorite(e, exercise)}
            className="w-8 h-8 rounded-xl border-[3px] border-black bg-white text-black flex items-center justify-center nb-shadow nb-press hover:bg-zinc-50 transition-colors"
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-black' : ''}`} />
          </button>

          <button
            onClick={(e) => onAddToWorkout(e, exercise)}
            className="w-8 h-8 rounded-xl border-[3px] border-black bg-white text-black flex items-center justify-center nb-shadow nb-press hover:bg-zinc-50 transition-colors"
            title="Ajouter à une séance"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info footer */}
      <div className="p-3">
        <h3 className="font-body font-bold text-sm text-black leading-snug line-clamp-2">
          {exercise.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span className="font-mono text-[10px] text-black bg-zinc-100 border border-black px-1.5 py-0.5 rounded-md">
            {targetFr}
          </span>
          <span className="font-mono text-[10px] text-zinc-500">·</span>
          <span className="font-mono text-[10px] text-zinc-600 truncate">
            {equipmentFr}
          </span>
        </div>
      </div>
    </div>
  );
};
