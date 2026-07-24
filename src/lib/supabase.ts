/// <reference types="vite/client" />
// ─── Supabase client (browser-safe, uses anon key) ───────────────────────────
import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — check your .env.local',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnon);
