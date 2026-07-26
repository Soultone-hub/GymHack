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
    <div className="pb-28 pt-5 px-4 max-w-lg mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl text-black leading-tight">Mes Favoris</h1>
          <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider mt-1">
            Accès rapide à vos exercices
          </p>
        </div>
        <span className="font-mono text-[10px] font-bold text-white bg-black border-2 border-black px-2.5 py-1 rounded-xl nb-shadow-sm">
          {favoriteExercises.length} FAVORIS
        </span>
      </div>

      {favoriteExercises.length === 0 ? (
        <div className="p-8 text-center border-2 border-black border-dashed rounded-2xl bg-zinc-50 my-4">
          <Heart className="w-10 h-10 text-black mx-auto mb-3 opacity-60" />
          <p className="font-display text-xl text-black mb-1">Aucun favori</p>
          <p className="font-body text-xs text-zinc-500">
            Touchez l'icône de cœur sur n'importe quel exercice pour l'épingler ici.
          </p>
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
                className="p-3.5 bg-white rounded-2xl border-2 border-black nb-shadow nb-press cursor-pointer flex items-center justify-between gap-3 hover:bg-zinc-50 transition-colors"
              >
                {/* Thumbnail */}
                {(ex.image_url || ex.gif_url) && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border-2 border-black">
                    <img
                      src={ex.gif_url ?? ex.image_url ?? ''}
                      alt={ex.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-body font-bold text-sm text-black truncate">
                    {ex.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="font-mono text-[10px] text-black bg-zinc-100 border border-black px-1.5 py-0.5 rounded-md">
                      {targetFr}
                    </span>
                    <span className="font-mono text-[10px] text-zinc-500">·</span>
                    <span className="font-mono text-[10px] text-zinc-500 truncate">{equipmentFr}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => onAddToWorkout(e, ex)}
                    className="w-8 h-8 rounded-xl border-2 border-black bg-white text-black flex items-center justify-center nb-shadow-sm nb-press hover:bg-zinc-100 transition-colors"
                    title="Ajouter à une séance"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => onRemoveFavorite(e, ex)}
                    className="w-8 h-8 rounded-xl border-[3px] border-black bg-white text-black flex items-center justify-center nb-shadow nb-press hover:bg-zinc-50 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Heart className="w-4 h-4 fill-black" />
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
