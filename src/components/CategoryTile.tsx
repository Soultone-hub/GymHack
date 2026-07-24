import React from 'react';
import { CategoryInfo } from '../types';
import { AnatomicalIcon } from './AnatomicalIcon';
import { ChevronRight } from 'lucide-react';

interface CategoryTileProps {
  category: CategoryInfo;
  exerciseCount?: number;
  onClick: () => void;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({
  category,
  exerciseCount = 0,
  onClick,
}) => {
  const isCardio = category.isCardio;

  return (
    <button
      onClick={onClick}
      className={`relative w-full h-28 p-3.5 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 active:scale-[0.97] border shadow-sm ${
        isCardio
          ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400'
          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
      }`}
    >
      {/* Header: Icon + Arrow */}
      <div className="flex items-center justify-between w-full">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isCardio ? 'bg-rose-100 text-rose-600' : 'bg-blue-50 text-blue-600 border border-blue-100'
          }`}
        >
          <AnatomicalIcon icon={category.icon} isCardio={isCardio} className="w-5 h-5" />
        </div>
        <ChevronRight
          className={`w-4 h-4 ${
            isCardio ? 'text-rose-400' : 'text-slate-400'
          }`}
        />
      </div>

      {/* Title & Count */}
      <div>
        <div className="flex items-baseline justify-between gap-1">
          <span className="font-bold text-base text-slate-900 leading-none">
            {category.name_fr}
          </span>
          {exerciseCount > 0 && (
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {exerciseCount}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 truncate mt-1">
          {category.subtitle_fr}
        </p>
      </div>

      {/* Distinct visual badge for Cardio */}
      {isCardio && (
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-600 text-white">
          Cardio
        </div>
      )}
    </button>
  );
};
