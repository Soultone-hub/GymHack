import React from 'react';

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
  const shared = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  if (isCardio || icon === 'pulse') {
    // Cœur battant + ligne ECG
    return (
      <svg {...shared}>
        <path d="M12 21C12 21 4 15 4 9a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 12-8 12z" strokeWidth={1.8} />
        <polyline points="1,13 5,13 7,10 9,16 11,12 13,13 23,13" strokeWidth={1.5} />
      </svg>
    );
  }

  switch (icon) {

    case 'back':
      // Dos : V-taper + colonne vertébrale
      return (
        <svg {...shared}>
          {/* épaules */}
          <path d="M4 7 C4 5 8 4 12 4 C16 4 20 5 20 7" />
          {/* V-taper lats */}
          <path d="M4 7 L6 18 L10 20" />
          <path d="M20 7 L18 18 L14 20" />
          {/* colonne */}
          <line x1="12" y1="5" x2="12" y2="20" strokeDasharray="2 1.5" />
          {/* barre lombaire */}
          <path d="M8 14 C10 15 14 15 16 14" />
        </svg>
      );

    case 'chest':
      // Poitrine : deux pectoraux avec sternum
      return (
        <svg {...shared}>
          {/* sternum central */}
          <line x1="12" y1="3" x2="12" y2="19" />
          {/* pec gauche */}
          <path d="M12 5 C8 5 4 7 4 12 C4 15 7 17 12 17" />
          {/* pec droit */}
          <path d="M12 5 C16 5 20 7 20 12 C20 15 17 17 12 17" />
          {/* ligne de définition */}
          <path d="M6 9 C8 11 12 11 12 11" strokeWidth={1.2} />
          <path d="M18 9 C16 11 12 11 12 11" strokeWidth={1.2} />
        </svg>
      );

    case 'arms':
      // Biceps fléchis — le classique 💪
      return (
        <svg {...shared}>
          {/* avant-bras */}
          <path d="M5 19 L10 14" strokeWidth={2.5} strokeLinecap="round" />
          {/* bras tendu */}
          <path d="M10 14 C10 14 10 8 15 6" strokeWidth={2.5} />
          {/* bosse biceps */}
          <path d="M10 14 C8 12 7 9 10 7 C13 5 17 6 17 8 C17 12 13 14 10 14" fill="currentColor" fillOpacity={0.15} />
          {/* coude */}
          <circle cx="10" cy="14" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'shoulders':
      // Épaules : deltoïdes + trapèzes
      return (
        <svg {...shared}>
          {/* cou */}
          <rect x="10" y="2" width="4" height="5" rx="2" />
          {/* trapèzes */}
          <path d="M10 4 C6 5 3 7 3 10" />
          <path d="M14 4 C18 5 21 7 21 10" />
          {/* deltoïde gauche — bosse */}
          <path d="M3 10 C2 12 3 15 5 16 L7 12" />
          {/* deltoïde droit */}
          <path d="M21 10 C22 12 21 15 19 16 L17 12" />
          {/* pec/poitrine bas */}
          <path d="M5 16 L7 20 L17 20 L19 16" />
        </svg>
      );

    case 'quads':
    case 'legs':
      // Haut des jambes : cuisses bien dessinées
      return (
        <svg {...shared}>
          {/* hanches */}
          <path d="M7 2 C7 2 10 4 12 4 C14 4 17 2 17 2" />
          {/* quadriceps gauche */}
          <path d="M7 2 C5 6 5 12 7 18 L9 22" />
          <path d="M12 4 C11 8 10 14 9 22" />
          {/* quadriceps droit */}
          <path d="M17 2 C19 6 19 12 17 18 L15 22" />
          <path d="M12 4 C13 8 14 14 15 22" />
          {/* séparation quadriceps */}
          <path d="M6 10 C8 11 10 11 11 10" strokeWidth={1.2} />
          <path d="M18 10 C16 11 14 11 13 10" strokeWidth={1.2} />
        </svg>
      );

    case 'abs':
    case 'waist':
      // Abdominaux : grille 2×3 typique six-pack
      return (
        <svg {...shared}>
          {/* contour */}
          <path d="M8 2 C6 2 5 3 5 4 L5 20 C5 21 6 22 8 22 L16 22 C18 22 19 21 19 20 L19 4 C19 3 18 2 16 2 Z" strokeWidth={1.5} />
          {/* ligne centrale */}
          <line x1="12" y1="2" x2="12" y2="22" />
          {/* lignes horizontales */}
          <line x1="5" y1="9" x2="19" y2="9" />
          <line x1="5" y1="16" x2="19" y2="16" />
          {/* obliques */}
          <path d="M5 4 L3 8" strokeWidth={1.2} />
          <path d="M19 4 L21 8" strokeWidth={1.2} />
        </svg>
      );

    case 'calves':
      // Mollets : forme losange caractéristique
      return (
        <svg {...shared}>
          {/* jambe gauche */}
          <path d="M8 2 L6 10 C5 14 7 17 8 20 L10 22" />
          <path d="M8 2 L9 10 C10 14 9 17 10 22" />
          {/* bosse mollet gauche */}
          <path d="M6 10 C5 12 5 14 7 15 C9 14 10 12 9 10" fill="currentColor" fillOpacity={0.2} />
          {/* jambe droite */}
          <path d="M16 2 L18 10 C19 14 17 17 16 20 L14 22" />
          <path d="M16 2 L15 10 C14 14 15 17 14 22" />
          {/* bosse mollet droit */}
          <path d="M18 10 C19 12 19 14 17 15 C15 14 14 12 15 10" fill="currentColor" fillOpacity={0.2} />
        </svg>
      );

    case 'forearms':
      // Avant-bras : de coude à poignet + veines musculaires
      return (
        <svg {...shared}>
          {/* avant-bras gauche */}
          <path d="M7 2 C5 2 4 3 5 8 L7 20 C7 21 9 22 10 21 L11 8 C12 3 10 2 7 2 Z" />
          {/* avant-bras droit */}
          <path d="M17 2 C19 2 20 3 19 8 L17 20 C17 21 15 22 14 21 L13 8 C12 3 14 2 17 2 Z" />
          {/* lignes de définition musculaires */}
          <line x1="8" y1="6" x2="10" y2="18" strokeWidth={1} strokeOpacity={0.6} />
          <line x1="16" y1="6" x2="14" y2="18" strokeWidth={1} strokeOpacity={0.6} />
        </svg>
      );

    case 'neck':
      // Cou : colonne cervicale + trapèzes
      return (
        <svg {...shared}>
          {/* tête */}
          <circle cx="12" cy="4" r="3" />
          {/* cou */}
          <path d="M10 7 L10 13 L14 13 L14 7" />
          {/* trapèze gauche */}
          <path d="M10 10 C7 10 4 11 3 14 L5 18 L10 16" />
          {/* trapèze droit */}
          <path d="M14 10 C17 10 20 11 21 14 L19 18 L14 16" />
          {/* ligne de col */}
          <line x1="5" y1="18" x2="19" y2="18" />
        </svg>
      );

    default:
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      );
  }
};
