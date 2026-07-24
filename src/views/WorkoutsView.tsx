import React, { useState } from 'react';
import { WorkoutFolder, Exercise } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { Plus, Trash2, Edit3, Dumbbell, Play, ChevronRight, X, ArrowLeft, MoveUp, MoveDown, Check } from 'lucide-react';

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
    if (editingName.trim()) {
      onRenameFolder(folderId, editingName.trim());
    }
    setEditingFolderId(null);
  };

  return (
    <div className="pb-28 pt-4 px-4 max-w-lg mx-auto animate-fade-in">
      {/* View Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mes Séances
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organisez vos entraînements en dossiers
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Nouvelle séance
        </button>
      </div>

      {/* Modal / Form for creating a new folder */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm mb-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Nommer la séance
          </h3>
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="ex: Push - Force & Volume"
            autoFocus
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700"
            >
              Créer
            </button>
          </div>
        </form>
      )}

      {/* Delete Folder Confirmation Dialog */}
      {deletingFolderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 max-w-sm w-full space-y-3 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">
              Confirmer la suppression ?
            </h3>
            <p className="text-xs text-slate-600">
              Cette séance et sa liste d'exercices seront définitivement supprimées.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeletingFolderId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteFolder(deletingFolderId);
                  if (activeFolderId === deletingFolderId) setActiveFolderId(null);
                  setDeletingFolderId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folder Detail View when a folder is selected */}
      {activeFolder ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveFolderId(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Mes Séances
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingFolderId(activeFolder.id);
                  setEditingName(activeFolder.name);
                }}
                className="w-8 h-8 rounded-full bg-white text-slate-500 border border-slate-200 flex items-center justify-center hover:text-slate-800 shadow-sm"
                title="Renommer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeletingFolderId(activeFolder.id)}
                className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center hover:bg-rose-100 shadow-sm"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Folder Title Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            {editingFolderId === activeFolder.id ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 bg-slate-50 border border-blue-500 rounded-xl px-3 py-1.5 text-sm text-slate-900"
                />
                <button
                  onClick={() => handleRenameSubmit(activeFolder.id)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeFolder.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeFolder.exercises.length} EXERCICE{activeFolder.exercises.length > 1 ? 'S' : ''}
                  </p>
                </div>
              </div>
            )}

            {/* Prominent Green "Démarrer la séance" Button */}
            {activeFolder.exercises.length > 0 && (
              <button
                onClick={() => onStartSession(activeFolder)}
                className="w-full mt-4 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Démarrer la séance</span>
              </button>
            )}
          </div>

          {/* Reorderable List of Exercises inside the Folder */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exercices de la séance ({activeFolder.exercises.length})
            </span>

            {activeFolder.exercises.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                Aucun exercice dans cette séance. Parcourez la bibliothèque et cliquez sur le bouton "+" pour en ajouter !
              </div>
            ) : (
              activeFolder.exercises.map((item, idx) => {
                const ex = allExercises.find((e) => e.id === item.exerciseId);
                if (!ex) return null;

                return (
                  <div
                    key={ex.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 group shadow-sm"
                  >
                    <div
                      onClick={() => onSelectExercise(ex)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <h4 className="font-semibold text-sm text-slate-900 group-hover:text-blue-600">
                          {ex.name}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {TARGET_FRENCH_MAP[ex.target]} <span className="text-blue-500">•</span> {EQUIPMENT_FRENCH_MAP[ex.equipment]}
                      </p>
                    </div>

                    {/* Reorder and Delete Actions */}
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col">
                        <button
                          disabled={idx === 0}
                          onClick={() => onReorderExercisesInFolder(activeFolder.id, idx, idx - 1)}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Monter"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === activeFolder.exercises.length - 1}
                          onClick={() => onReorderExercisesInFolder(activeFolder.id, idx, idx + 1)}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                          title="Descendre"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveExerciseFromFolder(activeFolder.id, ex.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Retirer"
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
        /* Vertical List of Workout Folders */
        <div className="space-y-3">
          {folders.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 bg-white rounded-2xl border border-slate-200 my-4 shadow-sm">
              <Dumbbell className="w-10 h-10 text-blue-600 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-base text-slate-900 mb-1">
                Aucune séance enregistrée
              </p>
              <p className="text-xs">
                Créez votre premier dossier de séance (ex: "Jambes & Abdos", "Haut du corps") pour regrouper vos exercices préférés.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs tracking-wide shadow-sm hover:bg-blue-700"
              >
                + Créer ma première séance
              </button>
            </div>
          ) : (
            folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className="group p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-100">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600">
                      {folder.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {folder.exercises.length} EXERCICE{folder.exercises.length > 1 ? 'S' : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartSession(folder);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold uppercase flex items-center gap-1 hover:bg-emerald-700 shadow-sm"
                    title="Lancer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Démarrer
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
