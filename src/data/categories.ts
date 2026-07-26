import { CategoryInfo, CategoryId } from '../types';

// ─── Categories (UI static mapping — not data mocks) ─────────────────────────
// IDs are lowercase to match the real DB `body_part` enum values
export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'back',
    name_fr: 'Dos',
    subtitle_fr: 'Lats, trapèzes, haut du dos',
    icon: 'back',
    emoji: '🦴',   // os/colonne
  },
  {
    id: 'cardio',
    name_fr: 'Cardio',
    subtitle_fr: 'Endurance & système cardiaque',
    icon: 'pulse',
    emoji: '❤️‍🔥', // coeur en feu
    isCardio: true,
  },
  {
    id: 'chest',
    name_fr: 'Poitrine',
    subtitle_fr: 'Pectoraux & grand dentelé',
    icon: 'chest',
    emoji: '🛡️',  // bouclier = pecs
  },
  {
    id: 'upper arms',
    name_fr: 'Bras',
    subtitle_fr: 'Biceps & triceps',
    icon: 'arms',
    emoji: '💪',   // biceps fléchi
  },
  {
    id: 'shoulders',
    name_fr: 'Épaules',
    subtitle_fr: 'Deltoides antérieur, latéral & postérieur',
    icon: 'shoulders',
    emoji: '🚴',  // cycliste = épaules larges
  },
  {
    id: 'upper legs',
    name_fr: 'Haut des jambes',
    subtitle_fr: 'Quadriceps, ischio-jambiers, fessiers',
    icon: 'quads',
    emoji: '🦵',   // jambe
  },
  {
    id: 'waist',
    name_fr: 'Taille & Abdos',
    subtitle_fr: 'Sangle abdominale & obliques',
    icon: 'abs',
    emoji: '🎯',   // cible = core
  },
  {
    id: 'lower legs',
    name_fr: 'Bas des jambes',
    subtitle_fr: 'Mollets & soléaires',
    icon: 'calves',
    emoji: '🦶',   // pied / bas de jambe
  },
  {
    id: 'lower arms',
    name_fr: 'Avant-bras',
    subtitle_fr: 'Féchisseurs & extenseurs des poignets',
    icon: 'forearms',
    emoji: '✊',   // poing fermé = grip
  },
  {
    id: 'neck',
    name_fr: 'Cou',
    subtitle_fr: 'Élévateur scapula & sterno-cléido-mastoïdien',
    icon: 'neck',
    emoji: '🗿',   // statue = cou/tête
  },
];

// ─── Muscle → French label ───────────────────────────────────────────────────
// Keys are lowercase to match the DB `target` field values
export const TARGET_FRENCH_MAP: Record<string, string> = {
  abductors: 'Abducteurs',
  abs: 'Sangle abdominale',
  adductors: 'Adducteurs',
  biceps: 'Biceps',
  calves: 'Mollets',
  'cardiovascular system': 'Système cardiovasculaire',
  delts: 'Deltoïdes',
  forearms: 'Avant-bras',
  glutes: 'Fessiers',
  hamstrings: 'Ischio-jambiers',
  lats: 'Grand dorsal',
  'levator scapulae': 'Élévateur de la scapula',
  obliques: 'Obliques',
  pectorals: 'Pectoraux',
  quads: 'Quadriceps',
  'serratus anterior': 'Grand dentelé',
  spine: 'Érecteurs du rachis',
  traps: 'Trapèzes',
  triceps: 'Triceps',
  'upper back': 'Haut du dos',
};

// ─── Equipment → French label ─────────────────────────────────────────────────
// Keys are lowercase to match the DB `equipment` field values
export const EQUIPMENT_FRENCH_MAP: Record<string, string> = {
  assisted: 'Machine assistée',
  band: 'Bande élastique',
  barbell: 'Barre libre',
  'body weight': 'Poids du corps',
  'bosu ball': 'Bosu Ball',
  cable: 'Câble / Poulie',
  dumbbell: 'Haltère',
  'elliptical machine': 'Vélo elliptique',
  'ez barbell': 'Barre EZ',
  hammer: 'Machine Hammer',
  kettlebell: 'Kettlebell',
  'leverage machine': 'Machine guidée',
  'medicine ball': 'Medicine Ball',
  'olympic barbell': 'Barre olympique',
  'resistance band': 'Élastique de résistance',
  roller: 'Rouleau de massage',
  rope: 'Corde',
  'skierg machine': 'SkiErg',
  'sled machine': 'Traîneau de force',
  'smith machine': 'Smith / Cadre guidé',
  'stability ball': 'Swiss Ball',
  'stationary bike': 'Vélo d\'appartement',
  'stepmill machine': 'Escalier / Stepmill',
  tire: 'Pneu de force',
  'trap bar': 'Trap Bar',
  'upper body ergometer': 'Ergomètre haut du corps',
  weighted: 'Lesté',
  'wheel roller': 'Roue abdominale',
};

// ─── Quick-filter equipment list (shown as chips in the Equipment Sheet) ──────
export const FREQUENT_EQUIPMENT: string[] = [
  'body weight',
  'dumbbell',
  'barbell',
  'cable',
  'band',
  'kettlebell',
  'resistance band',
  'ez barbell',
];

// Helper: CategoryId → CategoryInfo
export function getCategoryInfo(id: CategoryId): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
