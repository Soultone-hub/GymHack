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
  children,
  className = '',
}) => {
  const dimMap = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-28 h-28 text-lg',
  };

  return (
    <div
      className={`relative rounded-2xl border-2 border-black bg-zinc-50 text-black flex items-center justify-center shrink-0 font-body font-bold nb-shadow-sm ${dimMap[size]} ${className}`}
    >
      {children ? (
        children
      ) : (
        <span className="font-mono text-center leading-tight">
          {setsText || '4 × 10'}
        </span>
      )}
    </div>
  );
};
