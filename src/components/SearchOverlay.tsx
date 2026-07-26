import React, { useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { TARGET_FRENCH_MAP, EQUIPMENT_FRENCH_MAP } from '../data/categories';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';

interface SearchOverlayProps {
  isOpen: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onClose: () => void;
  exercises: Exercise[];
  isLoading: boolean;
  onSelectExercise: (ex: Exercise) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  searchQuery,
  onSearchChange,
  onClose,
  exercises,
  isLoading,
  onSelectExercise,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      onSearchChange('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ top: 0 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 bg-white border-b-[3px] border-black w-full max-h-[80vh] flex flex-col shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Search Input Row */}
        <div className="flex items-center gap-3 px-4 py-4 border-b-2 border-black">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un exercice…"
              className="w-full bg-zinc-50 border-2 border-black rounded-xl pl-10 pr-4 py-3 font-body text-sm text-black placeholder-zinc-400 focus:outline-none focus:bg-white"
            />
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl border-2 border-black bg-white flex items-center justify-center nb-shadow-sm nb-press shrink-0"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto no-scrollbar">
          {!searchQuery.trim() ? (
            <div className="p-6 text-center">
              <p className="font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Tapez pour rechercher parmi 1 324 exercices
              </p>
            </div>
          ) : isLoading ? (
            <div className="p-6 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span className="font-mono text-[11px] font-bold text-zinc-500 uppercase">Chargement…</span>
            </div>
          ) : exercises.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-body font-bold text-sm text-black">Aucun résultat pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-black">
              {/* Counter */}
              <div className="px-4 py-2 bg-zinc-50 border-b-2 border-black">
                <span className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {exercises.length} résultat{exercises.length > 1 ? 's' : ''}
                </span>
              </div>
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => { onSelectExercise(ex); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-zinc-50 transition-colors text-left nb-press"
                >
                  {/* Thumbnail */}
                  {(ex.gif_url || ex.image_url) && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border-2 border-black">
                      <img
                        src={ex.gif_url ?? ex.image_url ?? ''}
                        alt={ex.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold text-sm text-black truncate">{ex.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-[10px] text-black bg-zinc-100 border border-black px-1.5 py-0.5 rounded-md">
                        {TARGET_FRENCH_MAP[ex.target] ?? ex.target}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-500">·</span>
                      <span className="font-mono text-[10px] text-zinc-500 truncate">
                        {EQUIPMENT_FRENCH_MAP[ex.equipment] ?? ex.equipment}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
