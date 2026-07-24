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

// All equipment keys dynamically extracted from EQUIPMENT_FRENCH_MAP
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl border-t border-slate-200 p-5 pb-8 max-h-[85vh] flex flex-col z-10 shadow-2xl">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Filtre Équipement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un équipement (ex: haltère, poulie…)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {!searchQuery && (
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider">
              Équipements fréquents
            </p>
            <div className="flex flex-wrap gap-2">
              {FREQUENT_EQUIPMENT.map((eq) => {
                const isSelected = selectedEquipment.includes(eq);
                return (
                  <button
                    key={eq}
                    onClick={() => onSelectEquipment(eq)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
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

        <div className="flex-1 overflow-y-auto no-scrollbar border-t border-slate-100 pt-3 pr-1">
          <p className="text-[11px] font-semibold uppercase text-slate-400 mb-2 tracking-wider">
            Tous les équipements ({filteredEquipment.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {filteredEquipment.map((eq) => {
              const isSelected = selectedEquipment.includes(eq);
              return (
                <button
                  key={eq}
                  onClick={() => onSelectEquipment(eq)}
                  className={`p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border-blue-300 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="truncate pr-1">{EQUIPMENT_FRENCH_MAP[eq] ?? eq}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
          <button
            onClick={onClearAll}
            className="text-xs text-slate-500 underline hover:text-slate-800"
          >
            Réinitialiser ({selectedEquipment.length})
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
};
