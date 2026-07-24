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
  // Map folder items to full exercise objects (matched by ID)
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
        { setNumber: 4, reps: 10, weightKg: 20, completed: false },
      ];
    });
    return initial;
  });

  if (workoutExercises.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-8">
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
          className="text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="w-3.5 h-3.5 inline mr-1" /> Mettre en pause
        </button>
        <span className="font-bold text-base text-slate-900 tracking-tight">{folder.name}</span>
        <button
          onClick={onFinishWorkout}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs uppercase shadow-sm hover:bg-emerald-700"
        >
          Terminer
        </button>
      </div>

      {/* Exercise Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
        {workoutExercises.map((ex, idx) => (
          <button
            key={ex.id}
            onClick={() => setCurrentIndex(idx)}
            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide flex items-center gap-1.5 border transition-all ${
              idx === currentIndex
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 shadow-sm hover:text-slate-900'
            }`}
          >
            {idx + 1}. {ex.name}
          </button>
        ))}
      </div>

      {/* Current Exercise + Sets Logger */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md">
              Exercice {currentIndex + 1} / {workoutExercises.length}
            </span>
            <h2 className="font-bold text-xl text-slate-900 tracking-tight mt-1 truncate">
              {currentEx.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {targetFr} • {equipmentFr}
            </p>
          </div>

          {/* Mini GIF/Image preview */}
          {(currentEx.image_url || currentEx.gif_url) && (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 ml-3">
              <img
                src={currentEx.gif_url ?? currentEx.image_url ?? ''}
                alt={currentEx.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {!currentEx.image_url && !currentEx.gif_url && (
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <Dumbbell className="w-5 h-5 text-blue-600" />
            </div>
          )}
        </div>

        {/* Sets Table */}
        <div className="space-y-2 mt-4">
          <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase text-slate-500 text-center px-1">
            <span className="col-span-2">Série</span>
            <span className="col-span-4">Poids (kg)</span>
            <span className="col-span-4">Répétitions</span>
            <span className="col-span-2">✓</span>
          </div>

          {currentLogs.map((set, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-colors ${
                set.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className="col-span-2 font-bold text-xs text-center text-slate-800">
                #{set.setNumber}
              </span>

              <div className="col-span-4 flex items-center justify-center">
                <input
                  type="number"
                  value={set.weightKg}
                  onChange={(e) => updateSetData(idx, 'weightKg', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-white border border-slate-200 rounded-lg text-center font-bold text-sm text-slate-900 py-1 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div className="col-span-4 flex items-center justify-center">
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSetData(idx, 'reps', parseInt(e.target.value, 10) || 0)}
                  className="w-16 bg-white border border-slate-200 rounded-lg text-center font-bold text-sm text-slate-900 py-1 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <div className="col-span-2 flex justify-center">
                <button
                  onClick={() => toggleSetComplete(idx)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    set.completed
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-700 shadow-sm'
                  }`}
                >
                  <Check className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addSet}
            className="w-full py-2.5 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-blue-600 font-semibold text-xs uppercase flex items-center justify-center gap-1 hover:border-blue-500 hover:bg-slate-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter une série
          </button>
        </div>
      </div>

      {/* Prev / Next Navigation */}
      <div className="flex justify-between items-center gap-3">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="flex-1 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs uppercase disabled:opacity-40 shadow-sm"
        >
          ← Précédent
        </button>
        <button
          disabled={currentIndex === workoutExercises.length - 1}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs uppercase disabled:opacity-40 shadow-sm hover:bg-blue-700"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};
