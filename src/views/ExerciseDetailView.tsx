import React from 'react';
import { Exercise } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP, CATEGORIES } from '../data/categories';
import { ExerciseVisual } from '../components/ExerciseVisual';
import { TempoGuideWidget } from '../components/TempoGuideWidget';
import { ArrowLeft, Heart, Plus, ShieldCheck, Tag } from 'lucide-react';

interface ExerciseDetailViewProps {
  exercise: Exercise;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (exercise: Exercise) => void;
  onAddToWorkout: (exercise: Exercise) => void;
}

export const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({
  exercise,
  isFavorite,
  onBack,
  onToggleFavorite,
  onAddToWorkout,
}) => {
  const isCardio   = exercise.category === 'cardio';
  const categoryObj = CATEGORIES.find((c) => c.id === exercise.category);
  const targetFr    = TARGET_FRENCH_MAP[exercise.target] ?? exercise.target;
  const equipmentFr = EQUIPMENT_FRENCH_MAP[exercise.equipment] ?? exercise.equipment;

  const steps: string[] =
    exercise.instruction_steps?.fr ??
    exercise.instruction_steps?.en ??
    [];

  return (
    <div className="pb-36 pt-4 max-w-lg mx-auto animate-fade-in px-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 font-body font-bold text-xs text-black bg-white px-3 py-2 rounded-xl border-2 border-black nb-shadow-sm nb-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-black bg-zinc-100 px-3 py-1.5 rounded-lg border-2 border-black nb-shadow-sm">
          <Tag className="w-3.5 h-3.5" />
          <span>{equipmentFr}</span>
        </div>
      </div>

      {/* Exercise Visual (GIF / Image) */}
      <div className="relative mb-5 rounded-2xl overflow-hidden border-2 border-black nb-shadow bg-zinc-100">
        <ExerciseVisual
          exercise={exercise}
          className="w-full h-64"
        />
      </div>

      {/* Main Title */}
      <div className="mb-5">
        <h1 className="font-display text-2xl text-black leading-tight">
          {exercise.name}
        </h1>
        <p className="font-mono text-[10px] text-zinc-500 mt-1.5 uppercase tracking-widest font-bold">
          Partie du corps : {exercise.body_part}
        </p>
      </div>

      {/* Three Metadata Pills */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {/* Pill 1: Category */}
        <div className="p-3 rounded-xl border-2 border-black bg-white text-black nb-shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            Catégorie
          </span>
          <span className="font-body font-bold text-[11px] uppercase mt-1 leading-tight line-clamp-1">
            {categoryObj ? categoryObj.name_fr : exercise.category}
          </span>
        </div>

        {/* Pill 2: Equipment */}
        <div className="p-3 rounded-xl border-2 border-black bg-white text-black nb-shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
            Équipement
          </span>
          <span className="font-body font-bold text-[11px] uppercase mt-1 leading-tight line-clamp-1">
            {equipmentFr}
          </span>
        </div>

        {/* Pill 3: Target Muscle */}
        <div className="p-3 rounded-xl border-2 border-black bg-black text-white nb-shadow-sm flex flex-col justify-between">
          <span className="font-mono text-[9px] uppercase font-bold text-zinc-400 tracking-wider">
            Cible
          </span>
          <span className="font-body font-bold text-[11px] uppercase mt-1 leading-tight line-clamp-1">
            {targetFr}
          </span>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white rounded-2xl p-5 border-2 border-black nb-shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-black" />
          <h3 className="font-body font-bold text-sm text-black">
            Instructions de mouvement
          </h3>
        </div>

        {steps.length > 0 ? (
          <ol className="space-y-4 font-body text-xs text-black">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3.5">
                <span className="w-6 h-6 rounded-lg bg-black border-2 border-black text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                  {idx + 1}
                </span>
                <p className="leading-relaxed text-zinc-800 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="font-body text-xs text-zinc-400 italic">Aucune instruction disponible.</p>
        )}

        {/* Secondary Muscles */}
        {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
          <div className="mt-5 pt-4 border-t-2 border-black flex items-center gap-2 text-xs">
            <span className="font-mono font-bold uppercase text-[9px] text-zinc-500">
              Synergistes :
            </span>
            <span className="font-body font-semibold text-black">
              {exercise.secondary_muscles.join(' · ')}
            </span>
          </div>
        )}
      </div>

      {/* Execution Advice Widget */}
      <TempoGuideWidget exerciseName={exercise.name} />

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[3px] border-black p-4 pb-safe nb-shadow">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => onToggleFavorite(exercise)}
            className="w-14 h-14 rounded-2xl border-[3px] border-black bg-white text-black flex items-center justify-center nb-shadow nb-press hover:bg-zinc-50 transition-all"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-black' : ''}`} />
          </button>

          <button
            onClick={() => onAddToWorkout(exercise)}
            className="flex-1 h-14 rounded-2xl border-2 border-black bg-black text-white font-body font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 nb-shadow nb-press hover:bg-zinc-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter à une séance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
