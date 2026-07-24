import React, { useState } from 'react';
import { Exercise, WorkoutFolder } from '../types';
import { X, Plus, FolderPlus, Check, Dumbbell } from 'lucide-react';

interface AddToWorkoutModalProps {
  exercise: Exercise | null;
  folders: WorkoutFolder[];
  onClose: () => void;
  onCreateFolderAndAdd: (folderName: string, exerciseId: string) => void;
  onToggleExerciseInFolder: (folderId: string, exerciseId: string) => void;
}

export const AddToWorkoutModal: React.FC<AddToWorkoutModalProps> = ({
  exercise,
  folders,
  onClose,
  onCreateFolderAndAdd,
  onToggleExerciseInFolder,
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!exercise) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolderAndAdd(newFolderName.trim(), exercise.id);
    setNewFolderName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-slate-200 p-5 z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-semibold uppercase text-blue-600 tracking-wider">
              Ajouter à une séance
            </span>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1">
              {exercise.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Folders List */}
        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar mb-4">
          {folders.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
              Aucune séance créée pour le moment.
            </div>
          ) : (
            folders.map((folder) => {
              const containsExercise = folder.exercises.some(
                (item) => item.exerciseId === exercise.id
              );
              return (
                <button
                  key={folder.id}
                  onClick={() => onToggleExerciseInFolder(folder.id, exercise.id)}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    containsExercise
                      ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        containsExercise ? 'bg-emerald-600 text-white' : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-slate-900 leading-none">
                        {folder.name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {folder.exercises.length} exercice
                        {folder.exercises.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {containsExercise ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                      <Check className="w-4 h-4" /> Dans la séance
                    </span>
                  ) : (
                    <Plus className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create Folder Form / Trigger */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="space-y-3 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom de la nouvelle séance (ex: Push Force)"
              autoFocus
              className="w-full bg-slate-50 border border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Créer & Ajouter
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-3 rounded-xl bg-slate-50 border border-dashed border-slate-300 hover:border-blue-500 text-blue-600 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <FolderPlus className="w-4 h-4" /> Créer une nouvelle séance
          </button>
        )}
      </div>
    </div>
  );
};
