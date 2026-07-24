import React, { useState } from 'react';
import { Exercise } from '../types';

interface ExerciseVisualProps {
  exercise: Exercise;
  className?: string;
}

/**
 * Displays the exercise GIF animation (with fallback to static image, then placeholder).
 * Replaces the old SVG-based ExerciseVisual component.
 */
export const ExerciseVisual: React.FC<ExerciseVisualProps> = ({
  exercise,
  className = 'w-full h-60',
}) => {
  const [gifError, setGifError] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isCardio = exercise.category === 'cardio';
  const accentBg  = isCardio ? 'bg-rose-50'  : 'bg-blue-50';
  const accentText = isCardio ? 'text-rose-600' : 'text-blue-600';

  return (
    <div className={`relative ${accentBg} rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center ${className}`}>
      {/* Background dots */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* GIF → image → placeholder fallback chain */}
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
        // Final fallback: icon placeholder
        <div className={`z-10 flex flex-col items-center gap-2 ${accentText} opacity-40`}>
          <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="22" r="8" fill="currentColor" />
            <path d="M 50 30 L 50 60" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            <path d="M 32 42 L 50 36 L 68 42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M 50 60 L 38 85 M 50 60 L 62 85" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-medium">{exercise.name}</span>
        </div>
      )}

      {/* Category pill overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm">
        <span className={`w-2 h-2 rounded-full ${isCardio ? 'bg-rose-500' : 'bg-blue-600'}`} />
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {exercise.body_part}
        </span>
      </div>
    </div>
  );
};
