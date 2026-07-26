import React, { useState } from 'react';
import { EQUIPMENT_FRENCH_MAP, FREQUENT_EQUIPMENT } from '../data/categories';
import { Search, X, Check, SlidersHorizontal } from 'lucide-react';

interface EquipmentSheetProps {
  isOpen: boolean;
  selectedEquipment: string[];
  onClose: () => void;
  onSelectEquipment: (equipment: string) => void;
  onClearAll: () => void;
}

const ALL_EQUIPMENT: string[] = Object.keys(EQUIPMENT_FRENCH_MAP);

export const EquipmentSheet: React.FC<EquipmentSheetProps> = ({
  isOpen,
  selectedEquipment,
  onClose,
  onSelectEquipment,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredEquipment = ALL_EQUIPMENT.filter((eq) => {
    const frName = (EQUIPMENT_FRENCH_MAP[eq] ?? eq).toLowerCase();
    const query  = searchQuery.toLowerCase().trim();
    return frName.includes(query) || eq.toLowerCase().includes(query);
  }).sort((a, b) => (EQUIPMENT_FRENCH_MAP[a] ?? a).localeCompare(EQUIPMENT_FRENCH_MAP[b] ?? b));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl border-2 border-black p-5 pb-8 max-h-[85vh] flex flex-col z-10 shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-12 h-1.5 bg-black rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-black" />
            <h2 className="font-display text-lg text-black">
              Filtre Équipement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border-2 border-black bg-white text-black flex items-center justify-center nb-shadow-sm nb-press"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un équipement…"
            className="w-full bg-zinc-50 border-2 border-black rounded-xl pl-10 pr-4 py-2.5 font-body text-xs text-black focus:outline-none focus:bg-white"
          />
        </div>

        {!searchQuery && (
          <div className="mb-4">
            <p className="font-mono text-[10px] font-bold uppercase text-zinc-500 mb-2 tracking-wider">
              Populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {FREQUENT_EQUIPMENT.map((eq) => {
                const isSelected = selectedEquipment.includes(eq);
                return (
                  <button
                    key={eq}
                    onClick={() => onSelectEquipment(eq)}
                    className={`px-3 py-1.5 rounded-lg font-body text-xs font-bold transition-all flex items-center gap-1.5 border-2 border-black nb-shadow-sm nb-press ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-zinc-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {EQUIPMENT_FRENCH_MAP[eq] ?? eq}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto no-scrollbar border-t-2 border-black pt-3">
          <p className="font-mono text-[10px] font-bold uppercase text-zinc-500 mb-2 tracking-wider">
            Tous les équipements ({filteredEquipment.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filteredEquipment.map((eq) => {
              const isSelected = selectedEquipment.includes(eq);
              return (
                <button
                  key={eq}
                  onClick={() => onSelectEquipment(eq)}
                  className={`p-2.5 rounded-xl text-left font-body text-xs transition-all flex items-center justify-between border-2 border-black nb-shadow-sm nb-press ${
                    isSelected
                      ? 'bg-zinc-100 text-black font-bold'
                      : 'bg-white text-black hover:bg-zinc-50'
                  }`}
                >
                  <span className="truncate pr-1">{EQUIPMENT_FRENCH_MAP[eq] ?? eq}</span>
                  {isSelected && <Check className="w-4 h-4 text-black shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-black">
          <button
            onClick={onClearAll}
            className="font-mono text-[11px] font-bold text-black underline"
          >
            Effacer tout ({selectedEquipment.length})
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-black bg-black text-white font-body font-bold text-xs nb-shadow nb-press hover:bg-zinc-800 transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};
