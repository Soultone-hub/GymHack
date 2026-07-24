import React from 'react';
import { Activity } from 'lucide-react';

interface AnatomicalIconProps {
  icon: string;
  className?: string;
  isCardio?: boolean;
}

export const AnatomicalIcon: React.FC<AnatomicalIconProps> = ({
  icon,
  className = 'w-6 h-6',
  isCardio = false,
}) => {
  if (isCardio || icon === 'pulse') {
    return (
      <div className={`flex items-center justify-center text-[#B0492E] ${className}`}>
        <Activity className="w-full h-full stroke-[2.5]" />
      </div>
    );
  }

  // Vector SVG silhouettes for anatomical zones
  switch (icon) {
    case 'back':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Back V-Taper silhouette */}
          <path d="M12 2v2M8 4l4 2 4-2M5 8l7 3 7-3M4 14l8 4 8-4M7 21l5-2 5 2" />
          <path d="M7 6l-3 6 3 8" />
          <path d="M17 6l3 6-3 8" />
          <path d="M12 6v13" strokeDasharray="1 1" />
        </svg>
      );
    case 'chest':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Chest Pectorals silhouette */}
          <path d="M12 4v16" />
          <path d="M4 8c2 4 5 6 8 6s6-2 8-6" />
          <path d="M4 12c2 3 5 5 8 5s6-2 8-5" />
          <path d="M6 5l6 2 6-2" />
        </svg>
      );
    case 'arms':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Biceps & Flexed arm */}
          <path d="M18 10c0-3.3-2.7-6-6-6-2.5 0-4.6 1.5-5.5 3.7L4 12l3 5 6 3 6-2v-8z" />
          <path d="M12 4v6" />
        </svg>
      );
    case 'shoulders':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Shoulder Deltoids arch */}
          <path d="M12 3a4 4 0 0 0-4 4v2H3l2 8h14l2-8h-5V7a4 4 0 0 0-4-4z" />
          <path d="M8 9a4 4 0 0 0 8 0" />
        </svg>
      );
    case 'quads':
    case 'legs':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Thighs & Quads */}
          <path d="M7 3l2 18M17 3l-2 18" />
          <path d="M7 8c2 2 8 2 10 0" />
          <path d="M8 14c2 2 6 2 8 0" />
        </svg>
      );
    case 'abs':
    case 'waist':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Abs grid */}
          <rect x="7" y="4" width="10" height="16" rx="2" />
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="7" y1="9" x2="17" y2="9" />
          <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
      );
    case 'calves':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Calf muscle shape */}
          <path d="M9 3v6c-2 2-2 5 0 8v4M15 3v6c2 2 2 5 0 8v4" />
          <path d="M9 9c3 1 3 4 0 6M15 9c-3 1-3 4 0 6" />
        </svg>
      );
    case 'forearms':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Forearms and hand grip */}
          <path d="M8 4l2 16M16 4l-2 16" />
          <path d="M6 8l12 0" />
          <path d="M7 14l10 0" />
        </svg>
      );
    case 'neck':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* Neck & trapezius arch */}
          <path d="M8 4a4 4 0 0 0 8 0v6l5 6H3l5-6V4z" />
          <path d="M8 10h8" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
};
