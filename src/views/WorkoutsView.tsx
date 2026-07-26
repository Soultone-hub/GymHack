import React, { useState } from 'react';
import { WorkoutFolder, Exercise } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { Plus, Trash2, Edit3, Dumbbell, Play, ChevronRight, X, ArrowLeft, MoveUp, MoveDown } from 'lucide-react';

interface WorkoutsViewProps {
  folders: WorkoutFolder[];
  allExercises: Exercise[];
  onCreateFolder: (name: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onRemoveExerciseFromFolder: (folderId: string, exerciseId: string) => void;
  onReorderExercisesInFolder: (folderId: string, fromIndex: number, toIndex: number) => void;
  onStartSession: (folder: WorkoutFolder) => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  folders,
  allExercises,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onRemoveExerciseFromFolder,
  onReorderExercisesInFolder,
  onStartSession,
  onSelectExercise,
}) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deletingFolderId, setDeletingFolderId] = useState<string | null>(null);

  const activeFolder = folders.find((f) => f.id === activeFolderId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim());
    setNewFolderName('');
    setIsCreating(false);
  };

  const handleRenameSubmit = (folderId: string) => {
    if (editingName.trim()) onRenameFolder(folderId, editingName.trim());
    setEditingFolderId(null);
  };

  return (
    <div className="pb-32 pt-5 px-4 max-w-lg mx-auto animate-fade-in relative">

      {/* Section Title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-2xl text-black tracking-wide leading-none">Mes Séances</h1>
          <p className="font-mono text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">
            {folders.length} dossier{folders.length > 1 ? 's' : ''} · Organisez vos entraînements
          </p>
        </div>
      </div>

      {/* New Folder Creation Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-4 border-2 border-black nb-shadow mb-5 space-y-3">
          <p className="font-mono text-xs font-bold text-black uppercase tracking-wider">
            Nommer la séance
          </p>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="ex: Push · Force & Volume"
            autoFocus
            className="w-full bg-zinc-50 border-2 border-black rounded-xl px-4 py-2.5 font-body text-sm text-black focus:outline-none focus:bg-white nb-shadow-sm"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 py-2.5 rounded-xl border-2 border-black bg-zinc-100 text-black font-body font-bold text-xs nb-shadow-sm nb-press"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs nb-shadow-sm nb-press hover:bg-zinc-800 transition-colors"
            >
              Créer
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {deletingFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl p-5 border-2 border-black nb-shadow-lg max-w-sm w-full space-y-3">
            <h3 className="font-display text-xl text-black">Supprimer ?</h3>
            <p className="font-body text-xs text-zinc-600">
              Cette séance et sa liste d'exercices seront définitivement supprimées.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingFolderId(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-black bg-zinc-100 text-black font-body font-bold text-xs nb-shadow-sm nb-press"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteFolder(deletingFolderId);
                  if (activeFolderId === deletingFolderId) setActiveFolderId(null);
                  setDeletingFolderId(null);
                }}
                className="flex-1 py-2.5 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs nb-shadow-sm nb-press hover:bg-zinc-800 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Detail View */}
      {activeFolder ? (
        <div className="space-y-4">
          {/* Back + Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveFolderId(null)}
              className="flex items-center gap-1.5 font-body font-bold text-xs text-black bg-white px-3 py-2 rounded-xl border-2 border-black nb-shadow-sm nb-press"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Mes Séances
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEditingFolderId(activeFolder.id); setEditingName(activeFolder.name); }}
                className="w-9 h-9 rounded-xl border-2 border-black bg-white text-black flex items-center justify-center nb-shadow-sm nb-press hover:bg-zinc-100"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingFolderId(activeFolder.id)}
                className="w-9 h-9 rounded-xl border-2 border-black bg-black text-white flex items-center justify-center nb-shadow-sm nb-press hover:bg-zinc-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Folder Title Card */}
          <div className="bg-white rounded-2xl p-4 border-2 border-black nb-shadow">
            {editingFolderId === activeFolder.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 bg-zinc-50 border-2 border-black rounded-xl px-3 py-1.5 font-body text-sm text-black focus:outline-none"
                />
                <button
                  onClick={() => handleRenameSubmit(activeFolder.id)}
                  className="px-3 py-1.5 rounded-xl border-2 border-black bg-black text-white font-mono text-xs font-bold nb-press"
                >
                  OK
                </button>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-2xl text-black leading-tight">{activeFolder.name}</h2>
                <p className="font-mono text-[11px] text-zinc-500 uppercase tracking-wider mt-1">
                  {activeFolder.exercises.length} EXERCICE{activeFolder.exercises.length > 1 ? 'S' : ''}
                </p>
              </div>
            )}

            {/* Start Session Button */}
            {activeFolder.exercises.length > 0 && (
              <button
                onClick={() => onStartSession(activeFolder)}
                className="w-full mt-4 py-3.5 rounded-2xl border-2 border-black bg-black text-white font-body font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 nb-shadow nb-press hover:bg-zinc-800 transition-colors"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Démarrer la séance</span>
              </button>
            )}
          </div>

          {/* Exercise List */}
          <div className="space-y-2">
            <p className="font-mono text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Exercices ({activeFolder.exercises.length})
            </p>

            {activeFolder.exercises.length === 0 ? (
              <div className="p-8 text-center border-2 border-black border-dashed rounded-2xl bg-zinc-50">
                <p className="font-body text-sm font-bold text-black">Aucun exercice</p>
                <p className="font-body text-xs text-zinc-500 mt-1">Parcourez la bibliothèque et cliquez sur "+" pour en ajouter.</p>
              </div>
            ) : (
              activeFolder.exercises.map((item, idx) => {
                const ex = allExercises.find((e) => e.id === item.exerciseId);
                if (!ex) return null;
                return (
                  <div
                    key={ex.id}
                    className="p-3.5 bg-white rounded-2xl border-2 border-black nb-shadow flex items-center justify-between gap-3"
                  >
                    <div onClick={() => onSelectExercise(ex)} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <h4 className="font-body font-bold text-sm text-black">{ex.name}</h4>
                      </div>
                      <p className="font-mono text-[10px] text-zinc-500 mt-1">
                        {TARGET_FRENCH_MAP[ex.target]} · {EQUIPMENT_FRENCH_MAP[ex.equipment]}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0}
                          onClick={() => onReorderExercisesInFolder(activeFolder.id, idx, idx - 1)}
                          className="p-1 text-zinc-400 hover:text-black disabled:opacity-20"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === activeFolder.exercises.length - 1}
                          onClick={() => onReorderExercisesInFolder(activeFolder.id, idx, idx + 1)}
                          className="p-1 text-zinc-400 hover:text-black disabled:opacity-20"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveExerciseFromFolder(activeFolder.id, ex.id)}
                        className="p-2 text-black hover:bg-zinc-100 rounded-lg border-2 border-transparent hover:border-black transition-all nb-press"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Folder List */
        <div className="space-y-3">
          {folders.length === 0 ? (
            <div className="p-8 text-center border-2 border-black border-dashed rounded-2xl bg-zinc-50 my-4">
              <Dumbbell className="w-10 h-10 text-black mx-auto mb-3 opacity-60" />
              <p className="font-display text-xl text-black mb-1">Aucune séance</p>
              <p className="font-body text-xs text-zinc-500 mb-4">
                Créez votre premier dossier de séance (ex: "Jambes & Abdos") pour regrouper vos exercices.
              </p>
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className="group p-4 bg-white rounded-2xl border-2 border-black nb-shadow nb-press cursor-pointer flex items-center justify-between hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center border-2 border-black nb-shadow-sm">
                    <Dumbbell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-body font-bold text-base text-black">{folder.name}</h3>
                    <p className="font-mono text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider">
                      {folder.exercises.length} exercice{folder.exercises.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onStartSession(folder); }}
                    className="px-3 py-1.5 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs flex items-center gap-1 nb-shadow-sm nb-press hover:bg-zinc-800 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Go
                  </button>
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FAB — New Workout Button — just above footer */}
      {!activeFolder && (
        <button
          onClick={() => setIsCreating(true)}
          className="fixed bottom-[76px] right-5 w-14 h-14 rounded-full bg-white text-black border-[3px] border-black nb-shadow-lg nb-press hover:bg-zinc-100 transition-colors flex items-center justify-center z-30"
          title="Nouvelle séance"
        >
          <Plus className="w-7 h-7" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
