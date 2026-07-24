// ─── GymHack Types ────────────────────────────────────────────────────────────
// Aligned with the real exercises dataset (1,324 records from Gym Visual)
// body_part / category use lowercase values matching the DB enum

export type CategoryId =
  | 'back'
  | 'cardio'
  | 'chest'
  | 'lower arms'
  | 'lower legs'
  | 'neck'
  | 'shoulders'
  | 'upper arms'
  | 'upper legs'
  | 'waist';

// Exercise as stored in Supabase (instructions / steps are JSONB → keyed by lang code)
export interface Exercise {
  id: string;                             // "0001" … "1324"
  name: string;                           // English name
  category: CategoryId;                   // mirrors body_part
  body_part: CategoryId;
  equipment: string;                      // "dumbbell" | "barbell" | "body weight" …
  target: string;                         // primary muscle (lowercase, e.g. "biceps")
  muscle_group: string;                   // broader group  (e.g. "obliques")
  secondary_muscles: string[];
  instructions: Record<string, string>;   // { en: "...", fr: "...", … }
  instruction_steps: Record<string, string[]>; // { fr: ["step1", …], … }
  image_url: string | null;               // Supabase Storage public URL (JPG thumbnail)
  gif_url: string | null;                 // Supabase Storage public URL (GIF animation)
  media_id: string;
  attribution: string;
  created_at: string;
}

export interface CategoryInfo {
  id: CategoryId;
  name_fr: string;
  subtitle_fr: string;
  icon: string;
  isCardio?: boolean;
}

export interface WorkoutFolder {
  id: string;
  name: string;
  createdAt: number;
  exercises: {
    exerciseId: string;
    customSets?: string;
    notes?: string;
  }[];
}

export interface LoggedSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface ActiveSession {
  folderId: string;
  folderName: string;
  startTime: number;
  currentExerciseIndex: number;
  logs: Record<string, LoggedSet[]>; // exerciseId → array of completed sets
}

export type ViewMode =
  | 'home'
  | 'list'
  | 'detail'
  | 'workouts'
  | 'favorites'
  | 'active-workout';
