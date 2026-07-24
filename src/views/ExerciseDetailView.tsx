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

  // Prefer French steps, fall back to English
  const steps: string[] =
    exercise.instruction_steps?.fr ??
    exercise.instruction_steps?.en ??
    [];

  return (
    <div className="pb-36 pt-2 max-w-lg mx-auto animate-fade-in px-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between py-2 mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <Tag className="w-3 h-3" />
          <span>{exercise.equipment}</span>
        </div>
      </div>

      {/* Exercise Visual (GIF / Image) */}
      <div className="relative mb-5 shadow-sm rounded-3xl overflow-hidden border border-slate-200">
        <ExerciseVisual
          exercise={exercise}
          className="w-full h-64"
        />
      </div>

      {/* Main Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">
          {exercise.name}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
          {exercise.body_part}
        </p>
      </div>

      {/* Three Metadata Pills */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {/* Pill 1: Category */}
        <div
          className={`p-3 rounded-xl border flex flex-col justify-between ${
            isCardio
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Catégorie
          </span>
          <span className="font-bold text-xs uppercase mt-1 leading-tight line-clamp-1">
            {categoryObj ? categoryObj.name_fr : exercise.category}
          </span>
        </div>

        {/* Pill 2: Equipment */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Équipement
          </span>
          <span className="font-bold text-xs text-slate-800 uppercase mt-1 leading-tight line-clamp-1">
            {equipmentFr}
          </span>
        </div>

        {/* Pill 3: Target Muscle */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
            Muscle Cible
          </span>
          <span className="font-bold text-xs text-emerald-900 uppercase mt-1 leading-tight line-clamp-2">
            {targetFr}
          </span>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Instructions d'exécution
          </h3>
        </div>

        {steps.length > 0 ? (
          <ol className="space-y-3 text-sm text-slate-800">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed text-slate-700 text-xs sm:text-sm">{step}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-slate-400 italic">Aucune instruction disponible.</p>
        )}

        {/* Secondary Muscles */}
        {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px] text-blue-600">
              Sollicite aussi :
            </span>
            <span className="text-slate-700 font-medium">
              {exercise.secondary_muscles.join(' • ')}
            </span>
          </div>
        )}
      </div>

      {/* Execution Advice Widget */}
      <TempoGuideWidget exerciseName={exercise.name} />

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 p-4 pb-safe shadow-lg">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => onToggleFavorite(exercise)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
              isFavorite
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-emerald-600' : ''}`} />
          </button>

          <button
            onClick={() => onAddToWorkout(exercise)}
            className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter à une séance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
