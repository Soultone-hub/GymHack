// ============================================================
// GymHack — Import Script
// Uploads 1,324 exercise images + GIFs to Supabase Storage
// then seeds the `exercises` table.
//
// Usage:
//   1. Copy .env.example → .env.local and fill in your keys
//   2. npx tsx scripts/import.ts
//
// Requirements: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in env
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// ── Config ────────────────────────────────────────────────
const SUPABASE_URL             = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DATASET_ROOT             = resolve(process.env.DATASET_PATH || 'C:/projet-perso/DATA/GymHack-dataset');
const EXERCISES_JSON           = join(DATASET_ROOT, 'data', 'exercises.json');
const IMAGE_DIR                = join(DATASET_ROOT, 'images');
const VIDEO_DIR                = join(DATASET_ROOT, 'videos');
const IMAGE_BUCKET             = 'exercise-images';
const VIDEO_BUCKET             = 'exercise-videos';
const CONCURRENCY              = 5; // parallel uploads

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌  Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ── Helpers ───────────────────────────────────────────────
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function uploadFile(
  bucket: string,
  storagePath: string,
  localPath: string,
  contentType: string,
): Promise<string | null> {
  if (!existsSync(localPath)) return null;
  const body = readFileSync(localPath);
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, body, { contentType, upsert: true });
  if (error) {
    console.warn(`  ⚠️  Upload failed for ${storagePath}: ${error.message}`);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ── Main ──────────────────────────────────────────────────
interface RawExercise {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  target: string;
  muscle_group: string;
  secondary_muscles: string[];
  instructions: Record<string, string>;
  instruction_steps: Record<string, string[]>;
  image: string;       // "images/0001-xxxx.jpg"
  gif_url: string;     // "videos/0001-xxxx.gif"
  media_id: string;
  attribution: string;
  created_at: string;
}

async function main() {
  console.log('🏋️  GymHack Import Script');
  console.log(`📁  Dataset: ${DATASET_ROOT}`);
  console.log('');

  // 1. Ensure storage buckets exist
  console.log('🪣  Ensuring storage buckets…');
  for (const bucket of [IMAGE_BUCKET, VIDEO_BUCKET]) {
    const { error } = await supabase.storage.createBucket(bucket, { public: true });
    if (error && !error.message.includes('already exists')) {
      console.error(`❌  Cannot create bucket "${bucket}": ${error.message}`);
      process.exit(1);
    }
    console.log(`  ✅  Bucket "${bucket}" ready`);
  }

  // 2. Load dataset
  console.log('\n📖  Loading exercises.json…');
  const exercises: RawExercise[] = JSON.parse(readFileSync(EXERCISES_JSON, 'utf-8'));
  console.log(`  ✅  ${exercises.length} exercises loaded`);

  // 3. Upload media + insert rows
  console.log(`\n⬆️  Uploading media (${CONCURRENCY} concurrent) + seeding DB…`);
  let done = 0;
  let errors = 0;

  const batches = chunk(exercises, CONCURRENCY);
  for (const batch of batches) {
    await Promise.all(
      batch.map(async (ex) => {
        // Derive local file names from the dataset paths
        const imageFilename = ex.image.replace('images/', '');   // e.g. "0001-2gPfomN.jpg"
        const gifFilename   = ex.gif_url.replace('videos/', ''); // e.g. "0001-2gPfomN.gif"

        const localImg = join(IMAGE_DIR, imageFilename);
        const localGif = join(VIDEO_DIR, gifFilename);

        // Upload both files
        const [imageUrl, gifUrl] = await Promise.all([
          uploadFile(IMAGE_BUCKET, imageFilename, localImg, 'image/jpeg'),
          uploadFile(VIDEO_BUCKET, gifFilename,   localGif, 'image/gif'),
        ]);

        // Insert / upsert into exercises table
        const { error: dbError } = await supabase.from('exercises').upsert({
          id:                ex.id,
          name:              ex.name,
          category:          ex.category,
          body_part:         ex.body_part,
          equipment:         ex.equipment,
          target:            ex.target,
          muscle_group:      ex.muscle_group,
          secondary_muscles: ex.secondary_muscles,
          instructions:      ex.instructions,
          instruction_steps: ex.instruction_steps,
          image_url:         imageUrl,
          gif_url:           gifUrl,
          media_id:          ex.media_id,
          attribution:       ex.attribution,
          created_at:        ex.created_at,
        });

        if (dbError) {
          console.warn(`  ⚠️  DB error for ${ex.id}: ${dbError.message}`);
          errors++;
        }

        done++;
        if (done % 50 === 0 || done === exercises.length) {
          const pct = Math.round((done / exercises.length) * 100);
          console.log(`  [${pct}%] ${done}/${exercises.length} — errors: ${errors}`);
        }
      }),
    );
  }

  console.log('\n✅  Import complete!');
  console.log(`   ${done - errors} exercises inserted · ${errors} errors`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
