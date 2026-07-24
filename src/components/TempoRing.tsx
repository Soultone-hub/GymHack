import React from 'react';

interface TempoRingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tempoText?: string;
  setsText?: string;
  color?: 'sulfur' | 'blue' | 'sage' | 'coral';
  activePulse?: boolean;
  progressPercent?: number;
  children?: React.ReactNode;
  className?: string;
}

export const TempoRing: React.FC<TempoRingProps> = ({
  size = 'md',
  setsText,
  color = 'blue',
  children,
  className = '',
}) => {
  const dimMap = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-28 h-28 text-lg',
  };

  const bgClasses = {
    sulfur: 'bg-amber-50 text-amber-800 border-amber-200',
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    sage: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    coral: 'bg-rose-50 text-rose-800 border-rose-200',
  }[color];

  return (
    <div
      className={`relative rounded-2xl border flex items-center justify-center shrink-0 font-medium ${dimMap[size]} ${bgClasses} ${className}`}
    >
      {children ? (
        children
      ) : (
        <span className="font-semibold text-center leading-tight">
          {setsText || '4 × 10'}
        </span>
      )}
    </div>
  );
};
