-- ============================================================
-- GymHack — Airtight Hardened Supabase Schema & Security Rules
-- Dataset: 1,324 exercises · 10 languages · images + GIFs
-- ============================================================

-- Enable full-text / trigram search extension FIRST
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─────────────────────────────────────────────
-- 1. EXERCISES (public, read-only to clients)
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
  image_url         TEXT,                                   -- Supabase Storage public URL (.jpg)
  gif_url           TEXT,                                   -- Supabase Storage public URL (.gif)
  media_id          TEXT,                                   -- original media ref (e.g. "2gPfomN")
  attribution       TEXT,                                   -- © Gym Visual
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_exercises_body_part  ON exercises (body_part);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment  ON exercises (equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_target     ON exercises (target);
CREATE INDEX IF NOT EXISTS idx_exercises_name_trgm  ON exercises USING gin (name gin_trgm_ops);

-- RLS: Read-only for authenticated and anonymous users
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Exercises are public read" ON exercises;
CREATE POLICY "Exercises are public read"
  ON exercises FOR SELECT
  USING (true);

-- Explicitly block anonymous INSERT/UPDATE/DELETE on exercises table
DROP POLICY IF EXISTS "Block exercise mutation" ON exercises;

-- ─────────────────────────────────────────────
-- 2. USER FAVORITES (strict isolation per user)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_favorites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id TEXT        NOT NULL REFERENCES exercises (id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);

ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own favorites" ON user_favorites;
CREATE POLICY "Users select own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own favorites" ON user_favorites;
CREATE POLICY "Users insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own favorites" ON user_favorites;
CREATE POLICY "Users delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 3. WORKOUT FOLDERS (strict isolation per user)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_folders (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL DEFAULT auth.uid() REFERENCES auth.users (id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE workout_folders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users select own folders" ON workout_folders;
CREATE POLICY "Users select own folders"
  ON workout_folders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own folders" ON workout_folders;
CREATE POLICY "Users insert own folders"
  ON workout_folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own folders" ON workout_folders;
CREATE POLICY "Users update own folders"
  ON workout_folders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own folders" ON workout_folders;
CREATE POLICY "Users delete own folders"
  ON workout_folders FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 4. FOLDER EXERCISES (strictly linked to user folder)
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

DROP POLICY IF EXISTS "Users select own folder exercises" ON folder_exercises;
CREATE POLICY "Users select own folder exercises"
  ON folder_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_folders wf
      WHERE wf.id = folder_exercises.folder_id
        AND wf.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users insert own folder exercises" ON folder_exercises;
CREATE POLICY "Users insert own folder exercises"
  ON folder_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_folders wf
      WHERE wf.id = folder_exercises.folder_id
        AND wf.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users update own folder exercises" ON folder_exercises;
CREATE POLICY "Users update own folder exercises"
  ON folder_exercises FOR UPDATE
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

DROP POLICY IF EXISTS "Users delete own folder exercises" ON folder_exercises;
CREATE POLICY "Users delete own folder exercises"
  ON folder_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_folders wf
      WHERE wf.id = folder_exercises.folder_id
        AND wf.user_id = auth.uid()
    )
  );
