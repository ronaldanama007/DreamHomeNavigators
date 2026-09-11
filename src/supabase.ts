import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client. The URL and anon key are PUBLIC by design — they ship in
 * the browser bundle. Access is enforced server-side by Row Level Security,
 * not by hiding these values. See docs/superpowers/specs for the design.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Surface misconfiguration early in dev; in prod the calls will simply fail
  // and the UI degrades (contact form falls back to local save).
  console.warn(
    "[DHN] Supabase env vars missing — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");
