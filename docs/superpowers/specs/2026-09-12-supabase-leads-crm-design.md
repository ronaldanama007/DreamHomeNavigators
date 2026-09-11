# Supabase Leads CRM + Admin Auth — Design

**Date:** 2026-09-12
**Status:** Approved for planning
**Scope:** Replace the Google Apps Script / Google Sheet lead pipeline and the
client-side admin passcode with a Supabase-backed leads CRM and real
authentication. Site content management (properties, rentals, services, about)
stays on localStorage and is out of scope.

## Problem

The site is a static client-side SPA. Everything in `src/config.ts` — the two
Apps Script URLs and `ADMIN_PASSCODE` — is compiled into the shipped JS bundle
and readable by any visitor. Two concrete consequences:

1. **PII leak (critical):** `SHEET_READ_URL` is deployed "Anyone" and returns
   every lead as JSON. Its URL is in the public bundle
   (`Admin.tsx` `syncFromSheet` → `fetch(CONFIG.SHEET_READ_URL)`), so anyone can
   download the entire customer CRM (names, emails, phones).
2. **No real admin auth:** `ADMIN_PASSCODE: "DHN2026"` ships in the bundle;
   the endpoints can also be called directly, so the passcode protects nothing.

A static frontend cannot hold a secret. The fix must enforce access
server-side.

## Approach (chosen: A — direct Supabase client, RLS-enforced)

The browser talks to Supabase directly via `@supabase/supabase-js`. No custom
server code. Access is enforced by Postgres Row Level Security, not by hiding
anything in the client:

- Public contact form inserts a lead using the **anon key** (safe to ship;
  RLS limits it to insert-only).
- Admin console authenticates with **Supabase Auth** (email/password); only
  logged-in users can read or delete leads.

Rejected: Approach B (Edge Function proxy). RLS already provides the real
protection; the proxy's main extra benefit (spam rate-limiting on insert) is
deferred and better handled later with a lightweight CAPTCHA (e.g. Cloudflare
Turnstile) if spam materializes.

## Data model

Table `public.leads` (mirrors the `Lead` type, dropping the Sheet-only
`synced`):

| column              | type          | notes                          |
|---------------------|---------------|--------------------------------|
| `id`                | `uuid`        | PK, default `gen_random_uuid()`|
| `created_at`        | `timestamptz` | default `now()` (was `timestamp`) |
| `name`              | `text`        | not null                       |
| `phone`             | `text`        |                                |
| `email`             | `text`        |                                |
| `location`          | `text`        |                                |
| `budget`            | `text`        |                                |
| `property_interest` | `text`        |                                |
| `message`           | `text`        |                                |
| `source`            | `text`        |                                |

## RLS policies

`alter table public.leads enable row level security;`

1. **Insert (anon + authenticated):** `with check (true)`. Optional column
   length caps to bound payload size.
2. **Select (authenticated only):** `using (true)`. **No anon select policy** →
   an attacker holding the anon key gets zero rows. This closes the leak.
3. **Delete (authenticated only):** `using (true)` for admin delete / clear.
4. **No update policy** — leads are not edited in the console today.

## Admin provisioning (invite-only)

- Public signups **disabled** in Supabase Auth settings.
- Admins created manually in Supabase → Authentication → Users (or invited by
  email). Multiple admins supported; every authenticated user is an admin
  (all-or-nothing read/delete). Per-role granularity is out of scope.

## Frontend changes

**New dependency:** `@supabase/supabase-js`.

**New file `src/supabase.ts`:** singleton client from
`import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, sourced from a
git-ignored `.env`. These values are public by design; env vars are for
hygiene/rotation, not secrecy.

**`src/config.ts`:** remove `GOOGLE_SCRIPT_URL`, `SHEET_READ_URL`,
`ADMIN_PASSCODE`, `ADMIN_MAX_ATTEMPTS`, `ADMIN_LOCK_SECONDS`. Keep
`ADMIN_ROUTE_HASH` (convenience only, no longer a security boundary).

**`src/pages/Contact.tsx`:** replace the `fetch(GOOGLE_SCRIPT_URL, {mode:
"no-cors"})` block with `supabase.from('leads').insert({...})`. Real
success/error response enables an accurate sent/failed state. On network/DB
failure, fall back to the existing localStorage `addLead` so a lead is never
lost.

**`src/pages/Admin.tsx`:**
- Replace the `ADMIN_PASSCODE` gate + lockout UI with an email/password form
  (`supabase.auth.signInWithPassword`) and a **Log out** button
  (`supabase.auth.signOut`). Check `getSession()` on load; subscribe to
  `onAuthStateChange`. Delete the custom attempts/lockout logic (Supabase
  rate-limits auth server-side).
- On unlock, `select` all leads (`order by created_at desc`); delete / clear
  call Supabase `delete`. Remove the "Sync from Sheet" button, `SHEET_READ_URL`
  warnings, and the embedded Apps Script setup guide; replace with brief
  Supabase notes.

**`src/store.tsx`:** `Lead` drops `synced`; `timestamp` maps to `created_at`.
Lead state becomes Supabase-backed (small in-memory cache acceptable);
`importLeads` and Sheet plumbing removed. Backup/restore keeps a leads snapshot
for export but is no longer the source of truth. Properties/rentals/services/
about localStorage logic untouched.

## Error handling

Every Supabase call inspects the returned `error`. The contact form degrades to
local save on failure. The admin console surfaces auth/query errors through the
existing `notify` toast.

## Testing (manual)

1. Submit a lead as anon → row appears in Supabase and in the admin list.
2. Anon `select` on `leads` returns nothing (RLS verification).
3. Log in as an invited admin → read and delete a lead.
4. Wrong password is rejected; no lockout crash.
5. `npm run build` passes with zero type/compile errors.

## Docs

Update `HANDOVER.md` and `README.md`: replace the Apps Script CRM section with
Supabase setup (env vars, creating admins, RLS overview) and update the
pre-launch checklist. Treat the previously-committed Apps Script URL and
`ADMIN_PASSCODE` as exposed — decommission that deployment.

## Out of scope

- Migrating site content (properties, rentals, services, about) to Supabase.
- Spam rate-limiting / CAPTCHA on the public form (deferred).
- Per-admin roles/permissions.
