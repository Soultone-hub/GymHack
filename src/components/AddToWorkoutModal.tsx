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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl border-2 border-black p-5 z-10 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
          <div>
            <span className="font-mono text-[9px] font-bold uppercase text-zinc-500 tracking-wider">
              Ajouter à une séance
            </span>
            <h3 className="font-body font-bold text-base text-black line-clamp-1">
              {exercise.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-black bg-white text-black flex items-center justify-center nb-shadow-sm nb-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Folders List */}
        <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar mb-4">
          {folders.length === 0 ? (
            <div className="p-4 text-center border-2 border-black border-dashed rounded-xl bg-zinc-50 font-body text-xs text-zinc-500">
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
                  className={`w-full p-3 rounded-xl border-2 border-black flex items-center justify-between transition-all nb-shadow-sm nb-press ${
                    containsExercise
                      ? 'bg-zinc-100 text-black font-bold'
                      : 'bg-white text-black hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black text-white border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-body font-bold text-sm text-black leading-none">
                        {folder.name}
                      </p>
                      <p className="font-mono text-[10px] text-zinc-500 mt-1">
                        {folder.exercises.length} exercice{folder.exercises.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {containsExercise ? (
                    <span className="flex items-center gap-1 font-mono text-[10px] font-bold bg-black text-white border border-black px-1.5 py-0.5 rounded-md">
                      <Check className="w-3.5 h-3.5" /> OK
                    </span>
                  ) : (
                    <Plus className="w-4 h-4 text-black" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Create Folder Form / Trigger */}
        {isCreating ? (
          <form onSubmit={handleCreate} className="space-y-3 pt-2 border-t-2 border-black">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom de la nouvelle séance (ex: Push Force)"
              autoFocus
              className="w-full bg-zinc-50 border-2 border-black rounded-xl px-4 py-2.5 font-body text-xs text-black focus:outline-none focus:bg-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="flex-1 py-2 rounded-xl border-2 border-black bg-zinc-100 text-black font-body font-bold text-xs nb-shadow-sm nb-press"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs nb-shadow-sm nb-press hover:bg-zinc-800 transition-colors"
              >
                Créer & Ajouter
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full py-3 rounded-xl bg-white border-2 border-dashed border-black hover:bg-zinc-50 text-black font-body font-bold text-xs flex items-center justify-center gap-2 transition-all nb-press"
          >
            <FolderPlus className="w-4 h-4" /> Créer une nouvelle séance
          </button>
        )}
      </div>
    </div>
  );
};
