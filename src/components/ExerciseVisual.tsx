import React, { useState } from 'react';
import { Exercise } from '../types';

interface ExerciseVisualProps {
  exercise: Exercise;
  className?: string;
}

export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({
  exercise,
  className = 'w-full h-60',
}) => {
  const [gifError, setGifError] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative bg-zinc-50 rounded-2xl border-2 border-black overflow-hidden flex items-center justify-center ${className}`}>
      {/* Background sketch-like grids */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Fallback chain */}
      {exercise.gif_url && !gifError ? (
        <img
          src={exercise.gif_url}
          alt={exercise.name}
          className="w-full h-full object-contain z-10"
          onError={() => setGifError(true)}
        />
      ) : exercise.image_url && !imgError ? (
        <img
          src={exercise.image_url}
          alt={exercise.name}
          className="w-full h-full object-contain z-10"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="z-10 flex flex-col items-center gap-2 text-black opacity-30">
          <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="22" r="8" fill="currentColor" />
            <path d="M 50 30 L 50 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M 32 42 L 50 36 L 68 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50 60 L 38 85 M 50 60 L 62 85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <span className="font-body text-xs font-bold">{exercise.name}</span>
        </div>
      )}

      {/* Category overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border-2 border-black nb-shadow-sm">
        <span className="w-2.5 h-2.5 rounded-full bg-black" />
        <span className="font-mono text-[9px] font-bold text-black uppercase tracking-wider">
          {exercise.body_part}
        </span>
      </div>
    </div>
  );
};
