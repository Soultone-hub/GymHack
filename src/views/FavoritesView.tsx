import React from 'react';
import { Exercise } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { Heart, Plus } from 'lucide-react';

interface FavoritesViewProps {
  favoriteExercises: Exercise[];
  onSelectExercise: (exercise: Exercise) => void;
  onRemoveFavorite: (e: React.MouseEvent, exercise: Exercise) => void;
  onAddToWorkout: (e: React.MouseEvent, exercise: Exercise) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteExercises,
  onSelectExercise,
  onRemoveFavorite,
  onAddToWorkout,
}) => {
  return (
    <div className="pb-28 pt-4 px-4 max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Mes Favoris</h1>
          <p className="text-xs text-slate-500 mt-0.5">Accès direct en 3 secondes</p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {favoriteExercises.length} FAVORIS
        </span>
      </div>

      {favoriteExercises.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 my-4 shadow-sm">
          <Heart className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-80" />
          <p className="font-bold text-base text-slate-900 mb-1">Aucun favori pour le moment</p>
          <p className="text-xs">Touchez l'icône de cœur sur n'importe quel exercice pour l'épingler ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favoriteExercises.map((ex) => {
            const targetFr    = TARGET_FRENCH_MAP[ex.target] ?? ex.target;
            const equipmentFr = EQUIPMENT_FRENCH_MAP[ex.equipment] ?? ex.equipment;

            return (
              <div
                key={ex.id}
                onClick={() => onSelectExercise(ex)}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all flex items-center justify-between gap-3 group shadow-sm hover:shadow-md"
              >
                {/* Thumbnail */}
                {(ex.image_url || ex.gif_url) && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={ex.gif_url ?? ex.image_url ?? ''}
                      alt={ex.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-600">
                    {ex.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {targetFr} <span className="text-blue-500">•</span> {equipmentFr}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => onAddToWorkout(e, ex)}
                    className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                    title="Ajouter à une séance"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => onRemoveFavorite(e, ex)}
                    className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Heart className="w-4 h-4 fill-emerald-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
