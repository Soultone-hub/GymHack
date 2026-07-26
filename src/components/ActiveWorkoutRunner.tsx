import React, { useState } from 'react';
import { Exercise, WorkoutFolder, LoggedSet } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { ArrowLeft, Check, Plus, Dumbbell } from 'lucide-react';

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
  const [logs, setLogs] = useState<Record<string, LoggedSet[]>>(() => {
    const initial: Record<string, LoggedSet[]> = {};
    workoutExercises.forEach((ex) => {
      initial[ex.id] = [
        { setNumber: 1, reps: 10, weightKg: 20, completed: false },
        { setNumber: 2, reps: 10, weightKg: 20, completed: false },
        { setNumber: 3, reps: 10, weightKg: 20, completed: false },
      ];
    });
    return initial;
  });

  if (workoutExercises.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-black rounded-2xl bg-zinc-50 max-w-lg mx-auto my-8 font-body text-slate-500">
        Cette séance est vide. Ajoutez d'abord des exercices.
      </div>
    );
  }

  const currentEx   = workoutExercises[currentIndex];
  const currentLogs = logs[currentEx.id] || [];
  const targetFr    = TARGET_FRENCH_MAP[currentEx.target] ?? currentEx.target;
  const equipmentFr = EQUIPMENT_FRENCH_MAP[currentEx.equipment] ?? currentEx.equipment;

  const toggleSetComplete = (setIndex: number) => {
    setLogs((prev) => {
      const updated = [...(prev[currentEx.id] || [])];
      updated[setIndex] = { ...updated[setIndex], completed: !updated[setIndex].completed };
      return { ...prev, [currentEx.id]: updated };
    });
  };

  const updateSetData = (setIndex: number, field: 'reps' | 'weightKg', value: number) => {
    setLogs((prev) => {
      const updated = [...(prev[currentEx.id] || [])];
      updated[setIndex] = { ...updated[setIndex], [field]: Math.max(0, value) };
      return { ...prev, [currentEx.id]: updated };
    });
  };

  const addSet = () => {
    setLogs((prev) => {
      const existing = prev[currentEx.id] || [];
      const newSet: LoggedSet = {
        setNumber: existing.length + 1,
        reps: existing.length > 0 ? existing[existing.length - 1].reps : 10,
        weightKg: existing.length > 0 ? existing[existing.length - 1].weightKg : 20,
        completed: false,
      };
      return { ...prev, [currentEx.id]: [...existing, newSet] };
    });
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-lg mx-auto animate-fade-in">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onClose}
          className="text-xs font-body font-bold text-black bg-white px-3 py-2 rounded-xl border-2 border-black nb-shadow-sm nb-press"
        >
          <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> En pause
        </button>
        <span className="font-display text-base text-black tracking-tight">{folder.name}</span>
        <button
          onClick={onFinishWorkout}
          className="px-4 py-2 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs uppercase nb-shadow-sm nb-press hover:bg-zinc-800"
        >
          Terminer
        </button>
      </div>

      {/* Exercise Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {workoutExercises.map((ex, idx) => (
          <button
            key={ex.id}
            onClick={() => setCurrentIndex(idx)}
            className={`shrink-0 px-3.5 py-2 rounded-xl font-body font-bold text-xs border-2 border-black transition-all nb-shadow-sm nb-press ${
              idx === currentIndex
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-zinc-55'
            }`}
          >
            {idx + 1}. {ex.name}
          </button>
        ))}
      </div>

      {/* Logger Card */}
      <div className="bg-white rounded-2xl p-5 border-2 border-black nb-shadow mb-4">
        <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-black">
          <div className="flex-1 min-w-0">
            <span className="font-mono text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-md">
              Série {currentIndex + 1} / {workoutExercises.length}
            </span>
            <h2 className="font-display text-lg text-black mt-2 truncate">
              {currentEx.name}
            </h2>
            <p className="font-mono text-[10px] text-zinc-500 mt-0.5 uppercase">
              {targetFr} · {equipmentFr}
            </p>
          </div>

          {(currentEx.image_url || currentEx.gif_url) && (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-150 shrink-0 ml-3 border-2 border-black">
              <img
                src={currentEx.gif_url ?? currentEx.image_url ?? ''}
                alt={currentEx.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Sets Table */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 font-mono text-[10px] font-bold uppercase text-zinc-500 text-center px-1">
            <span className="col-span-2">Série</span>
            <span className="col-span-4">Poids (kg)</span>
            <span className="col-span-4">Répétitions</span>
            <span className="col-span-2">Valide</span>
          </div>

          {currentLogs.map((set, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border-2 border-black transition-colors ${
                set.completed ? 'bg-zinc-100' : 'bg-white'
              }`}
            >
              <span className="col-span-2 font-mono font-bold text-xs text-center text-black">
                #{set.setNumber}
              </span>

              <div className="col-span-4 flex items-center justify-center">
                <input
                  type="number"
                  value={set.weightKg}
                  onChange={(e) => updateSetData(idx, 'weightKg', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-white border-2 border-black rounded-lg text-center font-mono font-bold text-sm text-black py-1 focus:outline-none"
                />
              </div>

              <div className="col-span-4 flex items-center justify-center">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSetData(idx, 'reps', parseInt(e.target.value, 10) || 0)}
                  className="w-16 bg-white border-2 border-black rounded-lg text-center font-mono font-bold text-sm text-black py-1 focus:outline-none"
                />
              </div>

              <div className="col-span-2 flex justify-center">
                <button
                  onClick={() => toggleSetComplete(idx)}
                  className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center nb-shadow-sm nb-press transition-colors ${
                    set.completed
                      ? 'bg-black text-white'
                      : 'bg-white text-zinc-400 hover:text-black'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addSet}
            className="w-full py-3 rounded-xl border-2 border-dashed border-black bg-white text-black font-body font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all hover:bg-zinc-50 nb-press"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter une série
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center gap-3">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="flex-1 py-3.5 rounded-xl border-2 border-black bg-white text-black font-body font-bold text-xs uppercase disabled:opacity-30 nb-shadow-sm nb-press"
        >
          ← Précédent
        </button>
        <button
          disabled={currentIndex === workoutExercises.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="flex-1 py-3.5 rounded-xl border-2 border-black bg-white text-black font-body font-bold text-xs uppercase disabled:opacity-30 nb-shadow-sm nb-press"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};
