import React, { useState } from 'react';
import { Exercise, WorkoutFolder } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react';

interface ActiveWorkoutRunnerProps {
  folder: WorkoutFolder;
  allExercises: Exercise[];
  onFinishWorkout: () => void;
  onClose: () => void;
}

export const ActiveWorkoutRunner: React.FC<ActiveWorkoutRunnerProps> = ({
  folder,
  allExercises,
  onFinishWorkout,
  onClose,
}) => {
  const workoutExercises = folder.exercises
    .map((item) => allExercises.find((e) => e.id === item.exerciseId))
    .filter(Boolean) as Exercise[];

  const [currentIndex, setCurrentIndex] = useState(0);

  if (workoutExercises.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-black border-dashed rounded-2xl bg-zinc-50 max-w-lg mx-auto my-8 font-body text-black">
        Cette séance est vide. Ajoutez d'abord des exercices.
      </div>
    );
  }

  const currentEx   = workoutExercises[currentIndex];
  const targetFr    = TARGET_FRENCH_MAP[currentEx.target] ?? currentEx.target;
  const equipmentFr = EQUIPMENT_FRENCH_MAP[currentEx.equipment] ?? currentEx.equipment;
  const isLast      = currentIndex === workoutExercises.length - 1;
  const isFirst     = currentIndex === 0;

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[3px] border-black bg-white sticky top-0 z-10">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-xl border-2 border-black bg-white text-black flex items-center justify-center nb-shadow-sm nb-press hover:bg-zinc-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <span className="font-display text-base text-black block">{folder.name}</span>
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            {currentIndex + 1} / {workoutExercises.length}
          </span>
        </div>

        <button
          onClick={onFinishWorkout}
          className="px-4 py-2 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs uppercase nb-shadow-sm nb-press hover:bg-zinc-800"
        >
          Terminer
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-[3px] bg-zinc-100 w-full">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / workoutExercises.length) * 100}%` }}
        />
      </div>

      {/* Exercise Content */}
      <div className="flex-1 flex flex-col px-4 pt-5 pb-6 max-w-lg mx-auto w-full">

        {/* Exercise Image */}
        {(currentEx.gif_url || currentEx.image_url) && (
          <div className="w-full aspect-square max-h-64 rounded-2xl overflow-hidden border-[3px] border-black nb-shadow bg-zinc-50 mb-5">
            <img
              src={currentEx.gif_url ?? currentEx.image_url ?? ''}
              alt={currentEx.name}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Exercise Info */}
        <div className="border-[3px] border-black rounded-2xl p-5 bg-white nb-shadow mb-5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white bg-black px-2 py-0.5 rounded-md">
            Exercice {currentIndex + 1}
          </span>
          <h2 className="font-display text-2xl text-black mt-3 mb-2 leading-tight">
            {currentEx.name}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[11px] text-black bg-zinc-100 border-2 border-black px-2.5 py-1 rounded-xl nb-shadow-sm">
              {targetFr}
            </span>
            <span className="font-mono text-[11px] text-zinc-500">·</span>
            <span className="font-mono text-[11px] text-zinc-500">
              {equipmentFr}
            </span>
          </div>
        </div>

        {/* Exercise Tabs (mini) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
          {workoutExercises.map((ex, idx) => (
            <button
              key={ex.id}
              onClick={() => setCurrentIndex(idx)}
              className={`shrink-0 w-8 h-8 rounded-xl border-2 border-black font-mono font-bold text-xs flex items-center justify-center nb-shadow-sm nb-press transition-all ${
                idx === currentIndex
                  ? 'bg-black text-white'
                  : idx < currentIndex
                  ? 'bg-zinc-100 text-black'
                  : 'bg-white text-zinc-400'
              }`}
            >
              {idx < currentIndex ? '✓' : idx + 1}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            disabled={isFirst}
            onClick={() => setCurrentIndex((i) => i - 1)}
            className="flex-1 py-4 rounded-2xl border-[3px] border-black bg-white text-black font-body font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-25 nb-shadow nb-press"
          >
            <ArrowLeft className="w-5 h-5" />
            Précédent
          </button>

          {isLast ? (
            <button
              onClick={onFinishWorkout}
              className="flex-1 py-4 rounded-2xl border-[3px] border-black bg-black text-white font-body font-bold text-sm flex items-center justify-center gap-2 nb-shadow nb-press hover:bg-zinc-800"
            >
              <CheckCircle2 className="w-5 h-5" />
              Terminer !
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((i) => i + 1)}
              className="flex-1 py-4 rounded-2xl border-[3px] border-black bg-white text-black font-body font-bold text-sm flex items-center justify-center gap-2 nb-shadow nb-press"
            >
              Suivant
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
