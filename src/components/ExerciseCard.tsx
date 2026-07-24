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
      className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-500/80 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex flex-col cursor-pointer overflow-hidden"
    >
      {/* GIF / Image Thumbnail */}
      <div className="relative w-full aspect-square bg-slate-100 overflow-hidden">
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
          // Fallback icon when no media
          <div className={`w-full h-full flex items-center justify-center ${isCardio ? 'bg-rose-50' : 'bg-blue-50'}`}>
            <AnatomicalIcon
              icon={isCardio ? 'pulse' : exercise.category.replace(' ', '')}
              isCardio={isCardio}
              className="w-10 h-10 opacity-40"
            />
          </div>
        )}

        {/* Action buttons overlay */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            onClick={(e) => onToggleFavorite(e, exercise)}
            className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
              isFavorite
                ? 'bg-emerald-500 text-white'
                : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-slate-600'
            }`}
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={(e) => onAddToWorkout(e, exercise)}
            className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors"
            title="Ajouter à une séance"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info footer */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {exercise.name}
        </h3>
        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
          {targetFr} <span className="text-blue-400">•</span> {equipmentFr}
        </p>
      </div>
    </div>
  );
};
