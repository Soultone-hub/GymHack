-- ============================================================
-- GymHack — Supabase Schema
-- Dataset: 1,324 exercises · 10 languages · images + GIFs
-- Run this in the Supabase SQL Editor before running the import script
-- ============================================================

-- Enable full-text / trigram search extension FIRST
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─────────────────────────────────────────────
-- 1. EXERCISES (public, read-only)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercises (
  id                TEXT        PRIMARY KEY,               -- "0001" … "1324"
  name              TEXT        NOT NULL,                   -- English name
  category          TEXT        NOT NULL,                   -- mirrors body_part
  body_part         TEXT        NOT NULL,                   -- back | cardio | chest | lower arms | lower legs | neck | shoulders | upper arms | upper legs | waist
  equipment         TEXT        NOT NULL,                   -- dumbbell | barbell | body weight | cable …
  target            TEXT        NOT NULL,                   -- primary muscle (e.g. biceps, abs)
  muscle_group      TEXT        NOT NULL,                   -- broader group  (e.g. obliques)
  secondary_muscles TEXT[]      NOT NULL DEFAULT '{}',
  instructions      JSONB       NOT NULL DEFAULT '{}',     -- { "en": "...", "fr": "...", … }
  instruction_steps JSONB       NOT NULL DEFAULT '{}',     -- { "fr": ["step1","step2",...], … }
  image_url         TEXT,                                   -- Supabase Storage public URL  (.jpg)
  gif_url           TEXT,                                   -- Supabase Storage public URL  (.gif)
  media_id          TEXT,                                   -- original media ref (e.g. "2gPfomN")
  attribution       TEXT,                                   -- © Gym Visual
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_exercises_body_part  ON exercises (body_part);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment  ON exercises (equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_target     ON exercises (target);
CREATE INDEX IF NOT EXISTS idx_exercises_name_trgm  ON exercises USING gin (name gin_trgm_ops);

-- RLS: anyone can read exercises (no auth required)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Exercises are public" ON exercises;
CREATE POLICY "Exercises are public"
  ON exercises FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────
-- 2. USER FAVORITES (private per user)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_favorites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id TEXT        NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own favorites" ON user_favorites;
CREATE POLICY "Users manage own favorites"
  ON user_favorites
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. WORKOUT FOLDERS (private per user)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_folders (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workout_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own folders" ON workout_folders;
CREATE POLICY "Users manage own folders"
  ON workout_folders
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 4. FOLDER EXERCISES (ordered, private)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS folder_exercises (
  id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id   UUID  NOT NULL REFERENCES workout_folders (id) ON DELETE CASCADE,
  exercise_id TEXT  NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  position    INT   NOT NULL DEFAULT 0,
  custom_sets TEXT,
  notes       TEXT
);

ALTER TABLE folder_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own folder exercises" ON folder_exercises;
CREATE POLICY "Users manage own folder exercises"
  ON folder_exercises
  USING (
    EXISTS (
      SELECT 1 FROM workout_folders wf
      WHERE wf.id = folder_exercises.folder_id
        AND wf.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_folders wf
      WHERE wf.id = folder_exercises.folder_id
        AND wf.user_id = auth.uid()
    )
  );
