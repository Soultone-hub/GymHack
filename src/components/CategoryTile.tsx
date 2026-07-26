import React from 'react';
import { CategoryInfo } from '../types';
import { AnatomicalIcon } from './AnatomicalIcon';
import { ArrowRight } from 'lucide-react';

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
      className="relative w-full h-28 p-3.5 rounded-2xl flex flex-col justify-between text-left border-2 border-black bg-white nb-shadow nb-press hover:bg-zinc-50 transition-colors"
    >
      {/* Header: Icon + Arrow */}
      <div className="flex items-center justify-between w-full">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black text-white border-2 border-black nb-shadow-sm">
          <AnatomicalIcon icon={category.icon} isCardio={isCardio} className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-black" />
      </div>

      {/* Title & Count */}
      <div>
        <div className="flex items-baseline justify-between gap-1">
          <span className="font-body font-bold text-sm text-black leading-none">
            {category.name_fr}
          </span>
          {exerciseCount > 0 && (
            <span className="font-mono text-[10px] font-medium text-black bg-zinc-100 border border-black px-1.5 py-0.5 rounded-md">
              {exerciseCount}
            </span>
          )}
        </div>
        <p className="font-body text-[10px] text-zinc-500 truncate mt-1">
          {category.subtitle_fr}
        </p>
      </div>

      {/* Cardio Badge */}
      {isCardio && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase bg-black text-white border border-black">
          Cardio
        </div>
      )}
    </button>
  );
};
