import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client. The URL and anon key are PUBLIC by design — they ship in
 * the browser bundle. Access is enforced server-side by Row Level Security,
 * not by hiding these values. See docs/superpowers/specs for the design.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // Missing env (e.g. not configured in the production host). Warn, but do NOT
  // let createClient() throw on an empty URL — that would blank the ENTIRE site
  // because this module loads before the app mounts. Instead the public pages
  // still render; lead submission falls back to a local queue and admin sign-in
  // stays unavailable until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.
  console.warn(
    "[DHN] Supabase env vars missing — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. CRM features are disabled until then."
  );
}

export const supabase = createClient(
  url || "https://unconfigured.supabase.co",
  anonKey || "anon-key-not-set"
);
