# Supabase Leads CRM + Admin Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Google Apps Script / Google Sheet lead pipeline and the client-side admin passcode with a Supabase-backed leads CRM protected by Row Level Security and real (invite-only) email/password authentication.

**Architecture:** The React SPA talks to Supabase directly via `@supabase/supabase-js`. The public contact form inserts leads with the anon key (RLS restricts anon to insert-only). The admin console authenticates with Supabase Auth; only logged-in users can read or delete leads. Postgres RLS — not client-side code — enforces all access. No custom server.

**Tech Stack:** React 18 + TypeScript + Vite 6, Tailwind v4, `@supabase/supabase-js` (already in `package.json` at `^2.98.0`), Supabase (Postgres + Auth + RLS).

**Spec:** `docs/superpowers/specs/2026-09-12-supabase-leads-crm-design.md`

## Global Constraints

- Scope is **leads + auth only**. Do NOT migrate properties, rentals, services, or about content — those stay on localStorage untouched.
- Admin access is **invite-only**: public signups disabled; admins created manually in the Supabase dashboard. Every authenticated user is a full admin (no per-role granularity).
- The Supabase **anon key and URL are public by design** and ship in the bundle; they live in Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) for hygiene/rotation, not secrecy. RLS is the protection.
- **No test runner exists** in this repo (scripts are only `dev`, `build`, `typecheck`). Each task's automated gate is `npm run typecheck` (and `npm run build` where noted) plus the explicit manual verification steps written into the task. Do not add a test framework.
- Preserve the existing client `Lead` shape's `timestamp` field (ISO string) so `Dashboard` stats keep working; populate it from the DB `created_at` column. Drop the `synced` field.
- Follow existing code style: 2-space indent, double quotes, Tailwind utility classes, FontAwesome `<i className="fa-solid ...">` icons, the existing `notify(msg, ok)` toast pattern.

---

### Task 1: Supabase backend — schema, RLS, admin, signup lockdown

**Files:**
- Create: `supabase/migrations/20260912000000_leads.sql`
- (Manual Supabase dashboard actions documented in steps)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a `public.leads` table with columns `id uuid`, `created_at timestamptz`, `name text`, `phone text`, `email text`, `location text`, `budget text`, `property_interest text`, `message text`, `source text`; RLS policies allowing anon INSERT and authenticated SELECT/DELETE. This is the contract Tasks 4–7 depend on (exact snake_case column names).

- [ ] **Step 1: Write the migration SQL**

Create `supabase/migrations/20260912000000_leads.sql`:

```sql
-- Leads CRM table for Dream Home Navigators
create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  name              text not null,
  phone             text not null default '',
  email             text not null default '',
  location          text not null default '',
  budget            text not null default '',
  property_interest text not null default '',
  message           text not null default '',
  source            text not null default ''
);

alter table public.leads enable row level security;

-- Public contact form may insert a lead (anon + authenticated), nothing else.
create policy "leads_insert_any"
  on public.leads for insert
  to anon, authenticated
  with check (
    length(name) <= 200 and
    length(phone) <= 60 and
    length(email) <= 200 and
    length(location) <= 200 and
    length(budget) <= 100 and
    length(property_interest) <= 300 and
    length(message) <= 5000 and
    length(source) <= 200
  );

-- Only logged-in admins may read leads. No anon SELECT policy => anon reads return nothing.
create policy "leads_select_authenticated"
  on public.leads for select
  to authenticated
  using (true);

-- Only logged-in admins may delete leads.
create policy "leads_delete_authenticated"
  on public.leads for delete
  to authenticated
  using (true);
```

- [ ] **Step 2: Apply the migration to the Supabase project**

Two options (confirm with the user which to use):
- Via Supabase MCP tooling: create/select the project, then apply the SQL as a migration.
- Manual: open the target project → SQL Editor → paste and run the migration contents.

- [ ] **Step 3: Disable public signups**

Supabase dashboard → Authentication → Sign In / Providers (or Settings) → turn **OFF** "Allow new users to sign up". This enforces invite-only.

- [ ] **Step 4: Create the first admin user**

Supabase dashboard → Authentication → Users → Add user → enter the owner email + a temporary password (or send an invite). Record the email for manual verification in later tasks. Repeat for each additional admin now or later.

- [ ] **Step 5: Verify RLS from the SQL editor / API**

- In SQL Editor run `insert into public.leads (name) values ('RLS test');` → succeeds.
- Confirm an **anon** read returns nothing: from a terminal,
  `curl "$SUPABASE_URL/rest/v1/leads?select=*" -H "apikey: $ANON_KEY"` → returns `[]` (empty array), proving anon cannot read.
- `select count(*) from public.leads;` in SQL Editor (service role) shows the test row exists.
- Delete the test row: `delete from public.leads where name = 'RLS test';`

Expected: insert allowed for anon, select blocked for anon, data visible only with elevated access. This is the core security guarantee.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/20260912000000_leads.sql
git commit -m "feat(supabase): add leads table with insert-only anon RLS"
```

---

### Task 2: Supabase client module + environment configuration

**Files:**
- Create: `src/supabase.ts`
- Create: `.env.example`
- Create or Modify: `.env` (local, git-ignored — not committed)
- Modify: `.gitignore` (ensure `.env` is ignored)

**Interfaces:**
- Consumes: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` from the Vite env.
- Produces: `export const supabase` — a `SupabaseClient` singleton imported by Tasks 4–7.

- [ ] **Step 1: Confirm `.gitignore` ignores `.env`**

Read `.gitignore`. If `.env` is not already ignored, add:

```
# Local environment secrets / config
.env
.env.local
```

(`.env.example` stays tracked.)

- [ ] **Step 2: Create `.env.example`**

```
# Supabase — safe to expose in the client bundle; access is enforced by RLS.
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLISHABLE_KEY
```

- [ ] **Step 3: Create the local `.env`**

Copy `.env.example` to `.env` and fill in the real project URL and anon key (Supabase dashboard → Project Settings → API). Do not commit `.env`.

- [ ] **Step 4: Create `src/supabase.ts`**

```ts
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
```

- [ ] **Step 5: Verify typecheck passes**

Run: `npm run typecheck`
Expected: PASS (no errors). If `import.meta.env` types complain, confirm `vite/client` types are available (Vite provides them by default); no code change should be needed.

- [ ] **Step 6: Commit**

```bash
git add src/supabase.ts .env.example .gitignore
git commit -m "feat(supabase): add client module and env configuration"
```

---

### Task 3: Remove Sheet + passcode configuration from config.ts

**Files:**
- Modify: `src/config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: a `CONFIG` object with `GOOGLE_SCRIPT_URL`, `SHEET_READ_URL`, `ADMIN_PASSCODE`, `ADMIN_MAX_ATTEMPTS`, `ADMIN_LOCK_SECONDS` **removed**. `ADMIN_ROUTE_HASH` and all other keys remain. Tasks 5–7 rely on these keys being gone (they stop importing them).

- [ ] **Step 1: Edit `src/config.ts`**

Delete the `GOOGLE_SCRIPT_URL` and `SHEET_READ_URL` properties (lines ~8–22) and their comment blocks. Delete `ADMIN_PASSCODE` (line ~44) and the `ADMIN_MAX_ATTEMPTS` / `ADMIN_LOCK_SECONDS` pair (lines ~46–48) and their comments. Keep `MESSENGER_URL`, `MESSENGER_QUICK_REPLIES`, `ADMIN_ROUTE_HASH`, `EMAIL`, `LOGO_MARK_URL`, `LOGO_URL`.

Update the `ADMIN_ROUTE_HASH` comment to note it is a convenience route only, not a security boundary:

```ts
  /**
   * HIDDEN ADMIN ROUTE — the console is NOT linked anywhere on the public site.
   * Convenience only; real protection is Supabase Auth + RLS, not this hash.
   * Open it by typing this hash route, e.g. https://yoursite.com/#/dhn-owner
   */
  ADMIN_ROUTE_HASH: "#/dhn-owner",
```

- [ ] **Step 2: Verify (expected to FAIL to compile until Tasks 5–7 land)**

Run: `npm run typecheck`
Expected: errors in `Contact.tsx` and `Admin.tsx` referencing the removed keys. This confirms every consumer is found. Do NOT try to fix them here — Tasks 5–7 remove those references. (If you prefer a clean commit, do Task 3 and its consumers 5–7 as one review unit; the ordering below assumes that.)

- [ ] **Step 3: Commit**

```bash
git add src/config.ts
git commit -m "refactor(config): remove Apps Script URLs and admin passcode"
```

---

### Task 4: Make the store's leads Supabase-backed

**Files:**
- Modify: `src/store.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/supabase.ts` (Task 2); `leads` table columns (Task 1).
- Produces (the `StoreValue` lead surface other tasks use):
  - `Lead` interface: same fields as today **minus `synced`**; `timestamp: string` retained (ISO, mapped from `created_at`).
  - `leads: Lead[]`
  - `addLead: (l: Omit<Lead, "id" | "timestamp">) => Promise<{ ok: boolean }>` — inserts into Supabase; on failure saves to a local fallback and still returns `{ ok: false }`.
  - `refreshLeads: () => Promise<{ ok: boolean; error?: string }>` — authenticated SELECT; replaces `leads`.
  - `deleteLead: (id: string) => Promise<void>` — Supabase delete + local removal.
  - `clearLeads: () => Promise<void>` — Supabase delete-all + local clear.
  - `importLeads` is **removed**.

- [ ] **Step 1: Update the `Lead` interface**

In `src/store.tsx`, change the interface to drop `synced`:

```ts
export interface Lead {
  id: string;
  timestamp: string; // ISO string, mapped from Supabase created_at
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  propertyInterest: string;
  message: string;
  source: string;
}
```

- [ ] **Step 2: Add imports and a row-mapping helper**

At the top of `src/store.tsx` add:

```ts
import { supabase } from "./supabase";
```

Add a helper near the other module-scope functions:

```ts
interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  property_interest: string;
  message: string;
  source: string;
}

function rowToLead(r: LeadRow): Lead {
  return {
    id: r.id,
    timestamp: r.created_at,
    name: r.name ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    location: r.location ?? "",
    budget: r.budget ?? "",
    propertyInterest: r.property_interest ?? "",
    message: r.message ?? "",
    source: r.source ?? "",
  };
}
```

- [ ] **Step 3: Keep a local fallback for failed inserts only**

Keep the `LS_LEADS` constant but repurpose it as a failed-insert fallback queue (so a lead is never silently lost if Supabase is unreachable). Leave the `leads` state but stop the unconditional `write(LS_LEADS, leads)` persistence for all visitors. Replace the leads state initialization and its `useEffect` persistence:

Remove:
```ts
const [leads, setLeads] = useState<Lead[]>(() => read(LS_LEADS, []));
```
and
```ts
useEffect(() => write(LS_LEADS, leads), [leads]);
```

Add:
```ts
// Leads live in Supabase. This in-memory list is populated by refreshLeads()
// for authenticated admins. LS_LEADS is only a fallback for inserts that fail
// while offline, so a submitted lead is never lost.
const [leads, setLeads] = useState<Lead[]>([]);
```

- [ ] **Step 4: Rewrite the lead mutators in the `value` object**

Replace the existing `addLead`, `deleteLead`, `clearLeads`, and `importLeads` entries with:

```ts
    leads,
    refreshLeads: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return { ok: false, error: error.message };
      setLeads((data as LeadRow[]).map(rowToLead));
      return { ok: true };
    },
    addLead: async (l) => {
      const row = {
        name: l.name,
        phone: l.phone,
        email: l.email,
        location: l.location,
        budget: l.budget,
        property_interest: l.propertyInterest,
        message: l.message,
        source: l.source,
      };
      const { error } = await supabase.from("leads").insert(row);
      if (error) {
        // Never lose a lead: queue it locally so it can be recovered.
        const pending = read<Lead[]>(LS_LEADS, []);
        const fallback: Lead = {
          ...l,
          id: uuid(),
          timestamp: new Date().toISOString(),
        };
        write(LS_LEADS, [fallback, ...pending]);
        return { ok: false };
      }
      return { ok: true };
    },
    deleteLead: async (id) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (!error) setLeads((ls) => ls.filter((l) => l.id !== id));
    },
    clearLeads: async () => {
      const { error } = await supabase
        .from("leads")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (!error) setLeads([]);
    },
```

- [ ] **Step 5: Update the `StoreValue` interface and remove `importLeads`**

In the `StoreValue` interface, change the lead-related signatures to match Step 4 and delete the `importLeads` line:

```ts
  leads: Lead[];
  refreshLeads: () => Promise<{ ok: boolean; error?: string }>;
  addLead: (l: Omit<Lead, "id" | "timestamp">) => Promise<{ ok: boolean }>;
  deleteLead: (id: string) => Promise<void>;
  clearLeads: () => Promise<void>;
```

- [ ] **Step 6: Fix backup/restore for leads**

In `createBackup`, keep exporting the currently-loaded `leads` snapshot (no change needed — it reads the `leads` state).

In `restoreBackup`, **remove** the line that restores leads (leads now live in Supabase, not in a local backup):

Remove:
```ts
if (Array.isArray(data.leads)) setLeads(data.leads);
```

In `resetAllToFactory`, remove `setLeads([]);` (or keep it — it only clears the in-memory list; either is fine, but removing avoids implying it clears the CRM). Remove it and add a comment:

```ts
    resetAllToFactory: () => {
      setCustom([]);
      setDeleted([]);
      setCustomRentals([]);
      setDeletedRentals([]);
      // Leads are NOT reset here — they live in Supabase, not local content.
      setServices(SERVICE_SEED);
      setAbout(ABOUT_SEED);
      setFeaturedId(null);
    },
```

- [ ] **Step 7: Verify typecheck**

Run: `npm run typecheck`
Expected: `store.tsx` itself compiles; remaining errors are only in `Contact.tsx`/`Admin.tsx` (fixed in Tasks 5 & 7) because `addLead` is now async and `importLeads` is gone.

- [ ] **Step 8: Commit**

```bash
git add src/store.tsx
git commit -m "feat(store): back leads with Supabase, drop Sheet import + synced field"
```

---

### Task 5: Contact form inserts leads via Supabase

**Files:**
- Modify: `src/pages/Contact.tsx`

**Interfaces:**
- Consumes: `addLead` (now `async`, returns `{ ok }`) from the store (Task 4).
- Produces: a submit handler that inserts to Supabase and shows an accurate success/failure state.

- [ ] **Step 1: Remove the `CONFIG` import if now unused**

Check whether `CONFIG` is still referenced elsewhere in `Contact.tsx`. It was used only for `GOOGLE_SCRIPT_URL`. Remove `import { CONFIG } from "../config";` if nothing else uses it.

- [ ] **Step 2: Rewrite `handleSubmit`**

Replace the body (current lines ~67–115) with:

```ts
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    const { ok } = await addLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      location: form.location,
      budget: form.budget,
      propertyInterest: form.propertyInterest,
      message: form.message,
      source: "Website Contact Form",
    });

    if (!ok) {
      // Insert failed (offline / misconfig). The store queued it locally so it
      // is not lost; still show the user a soft success so they aren't blocked.
      console.warn("[DHN] Lead insert failed; queued locally.");
    }

    setStatus("success");
    window.setTimeout(() => {
      setForm(EMPTY);
      setStatus("idle");
    }, 3000);
  }
```

(Rationale: the form always confirms receipt to the visitor; the store guarantees the lead reaches Supabase or the local fallback queue. A distinct error UI is out of scope — the design specifies degrade-to-local.)

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: `Contact.tsx` compiles (no more `GOOGLE_SCRIPT_URL` reference; `addLead` awaited).

- [ ] **Step 4: Manual verification**

Run `npm run dev`. Open the Contact page, submit an inquiry. In the Supabase dashboard → Table Editor → `leads`, confirm a new row with the correct fields appears.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat(contact): submit leads to Supabase with local fallback"
```

---

### Task 6: Replace the admin passcode gate with Supabase Auth

**Files:**
- Modify: `src/pages/Admin.tsx`

**Interfaces:**
- Consumes: `supabase` from `src/supabase.ts` (Task 2).
- Produces: a `Gate` that authenticates via `supabase.auth.signInWithPassword`; the `Admin` component drives `authed` from the Supabase session (`getSession` + `onAuthStateChange`), with a logout that calls `supabase.auth.signOut`.

- [ ] **Step 1: Add the import and remove passcode constants**

At the top of `Admin.tsx` add `import { supabase } from "../supabase";`. Remove `const LOCK_KEY` / `const ATTEMPTS_KEY` (lines ~121–122). `CONFIG` is still used elsewhere (e.g. Setup tab) until Task 7 — leave the import until then; after Task 7 remove it if unused.

- [ ] **Step 2: Rewrite the `Gate` component**

Replace the entire `Gate` function (lines ~124–244) with an email/password form:

```tsx
function Gate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("Incorrect email or password.");
    // On success, onAuthStateChange in <Admin> flips the view — no local flag.
  }

  return (
    <section className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-5 py-10">
      <form onSubmit={submit} className="glass-panel-deep rounded-2xl p-8 text-center">
        <div className="mx-auto flex justify-center">
          <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-2xl text-white shadow-lg shadow-brand-950/60">
            <i className="fa-solid fa-shield-halved" />
          </span>
        </div>
        <h1 className="font-display mt-5 text-2xl font-semibold text-white">Owner Console</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
          Restricted area for the Dream Home Navigators team. Sign in with your admin account.
        </p>

        <div className="relative mt-6">
          <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            required
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <div className="relative mt-3">
          <i className="fa-solid fa-key absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        {error && (
          <p className="mt-3 text-xs font-bold text-rose-400" role="alert">
            <i className="fa-solid fa-triangle-exclamation mr-1.5" />
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary mt-5 w-full">
          <i className={`fa-solid ${busy ? "fa-spinner fa-spin" : "fa-unlock"}`} />
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-[11px] text-slate-600">
        Access is restricted to invited admin accounts.
      </p>
    </section>
  );
}
```

- [ ] **Step 3: Rewrite the `Admin` component's auth state**

Replace the `authed` state and the `!authed` branch (lines ~2234, ~2243–2252) so the session drives the view:

```tsx
export default function Admin({ exit }: { exit: () => void }) {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = still checking
  const [tab, setTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3600);
  };

  if (authed === null) {
    return (
      <section className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-300" />
      </section>
    );
  }
  if (!authed) return <Gate />;
```

Ensure `useEffect` is imported in `Admin.tsx` (it is already used elsewhere in the file).

- [ ] **Step 4: Replace the "Lock" button with sign-out**

In the header actions (lines ~2295–2304), change the Lock button to sign out of Supabase:

```tsx
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn btn-ghost !px-4 !py-2.5 text-[13px]"
          >
            <i className="fa-solid fa-lock text-brand-300" />
            Sign out
          </button>
```

(`onAuthStateChange` flips `authed` to false automatically.)

- [ ] **Step 5: Verify typecheck**

Run: `npm run typecheck`
Expected: `Admin.tsx` auth code compiles. (Dashboard/Setup Sheet references are fixed in Task 7; if you did Task 4 already, `Dashboard`'s `importLeads`/`syncFromSheet` will still error until Task 7.)

- [ ] **Step 6: Manual verification**

`npm run dev` → open `#/dhn-owner`. Confirm: wrong credentials show the error; correct invited-admin credentials open the console; reloading keeps you signed in (session persists); "Sign out" returns you to the login form.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Admin.tsx
git commit -m "feat(admin): replace passcode gate with Supabase Auth login"
```

---

### Task 7: Dashboard reads from Supabase; remove Sheet sync & Apps Script setup

**Files:**
- Modify: `src/pages/Admin.tsx`

**Interfaces:**
- Consumes: `refreshLeads`, `deleteLead`, `clearLeads` (now async) from the store (Task 4).
- Produces: a `Dashboard` that loads leads from Supabase on mount and a Setup tab free of Apps Script instructions.

- [ ] **Step 1: Update `Dashboard`'s store usage and remove `syncFromSheet`**

Change the `useStore()` destructure (line ~249) to:

```tsx
  const { leads, deleteLead, clearLeads, refreshLeads } = useStore();
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
```

Remove the `syncing` state and the entire `syncFromSheet` function (lines ~250, ~272–316). Add a load effect:

```tsx
  useEffect(() => {
    let active = true;
    (async () => {
      const res = await refreshLeads();
      if (active && !res.ok) notify("Could not load leads from Supabase.", false);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
```

Confirm `useEffect` is imported at the top of `Admin.tsx`.

- [ ] **Step 2: Fix the stats `week` calc (uses `l.timestamp`, still valid)**

No change needed — `Lead.timestamp` is still an ISO string (mapped from `created_at`). Confirm `stats` (lines ~253–270) still references `l.timestamp` and compiles.

- [ ] **Step 3: Replace the "Sync from Sheet" button and the empty-state warning**

Find the "Sync from Sheet" button in the Dashboard JSX and remove it. Replace the `!CONFIG.SHEET_READ_URL` amber warning block (lines ~419–424) with a neutral loading/empty note:

```tsx
      {loading && (
        <p className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[12.5px] font-semibold text-slate-300">
          <i className="fa-solid fa-spinner fa-spin" />
          Loading leads from Supabase…
        </p>
      )}
```

Update the `deleteLead(...)` and `clearLeads()` call sites in the Dashboard JSX to `await` them inside their handlers (or call without await — they update state on success). If a handler is not async, wrap: `onClick={() => { void deleteLead(id); }}` and for clear: `onClick={() => { void clearLeads(); notify("Lead log cleared.", true); }}`.

- [ ] **Step 4: Strip Apps Script from the Setup tab**

Locate the `SetupGuide` component and the Apps Script code block / "Connect the Google Sheet CRM" and "Enable Dashboard → Sync from Sheet" panels (around lines ~1780–1830 and the embedded `doGet/doPost` script constant near lines ~71–120). Replace the CRM portion with a short Supabase note:

```tsx
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-300/90">
          Leads are stored securely in Supabase (Postgres) and protected by Row
          Level Security: the public form can only submit a lead, and only
          signed-in admin accounts can read or delete them. To add another admin,
          invite them from the Supabase dashboard → Authentication → Users.
          Configure <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">VITE_SUPABASE_URL</code> and
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">VITE_SUPABASE_ANON_KEY</code> in <b className="text-white">.env</b>.
        </p>
```

Remove the now-unused embedded Apps Script string constant and any `SHEET_NAME` var. Remove references to `CONFIG.GOOGLE_SCRIPT_URL` / `CONFIG.SHEET_READ_URL` (StatusDot lines ~1786, ~1814). If `CONFIG` is no longer referenced anywhere in `Admin.tsx`, remove its import.

- [ ] **Step 5: Verify typecheck and build**

Run: `npm run typecheck` then `npm run build`
Expected: both PASS with zero errors (all removed `config` keys, `importLeads`, and Sheet references are gone).

- [ ] **Step 6: Manual verification**

`npm run dev` → sign in → Leads Dashboard shows leads pulled from Supabase (including the one submitted in Task 5). Delete a lead → it disappears and is gone from the Supabase table. "Clear" empties the list. The Setup tab shows Supabase notes, no Apps Script.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Admin.tsx
git commit -m "feat(admin): load leads from Supabase, remove Sheet sync + Apps Script guide"
```

---

### Task 8: Update documentation

**Files:**
- Modify: `HANDOVER.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the finished behavior from Tasks 1–7.
- Produces: docs describing the Supabase setup instead of Apps Script.

- [ ] **Step 1: Update `HANDOVER.md`**

- In the file tree / component notes, change `config.ts` description to remove "CRM URLs" and mention Supabase env + auth.
- Replace "Workflow 1: Updating Configuration & Security" `GOOGLE_SCRIPT_URL` / `SHEET_READ_URL` block with Supabase env vars and a note that the anon key is public-by-design (RLS protects data).
- Replace the Pre-Launch Checklist items:
  - Remove "Deploy Google Apps Script and update GOOGLE_SCRIPT_URL & SHEET_READ_URL".
  - Remove "Change ADMIN_PASSCODE and ADMIN_ROUTE_HASH ... credentials" (passcode no longer exists; keep ADMIN_ROUTE_HASH as optional).
  - Add: "Create the Supabase project, run the `leads` migration, disable public signups, and create admin users."
  - Add: "Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`."
  - Add: "Verify anon cannot read `leads` (RLS) and an invited admin can sign in."
  - Update the lead-test item to "verify rows arrive in the Supabase `leads` table."
- Add a security note: the previously-committed Apps Script URL and `ADMIN_PASSCODE` are exposed — decommission that Apps Script deployment.

- [ ] **Step 2: Update `README.md`**

Replace the Sheet CRM / passcode setup sections with a Supabase quick-start: env vars, running the migration, disabling signups, creating admins, and how invite-only admin access works.

- [ ] **Step 3: Verify no stale references remain**

Run a search for leftover references:

Run: `grep -rniE "apps script|GOOGLE_SCRIPT_URL|SHEET_READ_URL|ADMIN_PASSCODE|Sync from Sheet" --include=*.md --include=*.ts --include=*.tsx .`
Expected: no matches in source; any remaining mentions in `docs/superpowers/specs` (historical design) are acceptable. `Dream_Home_Navigators_Project_Handover.html` and `GEMINI.md` should also be updated or noted if they duplicate the setup — update them if they carry the same live URL.

- [ ] **Step 4: Commit**

```bash
git add HANDOVER.md README.md GEMINI.md Dream_Home_Navigators_Project_Handover.html
git commit -m "docs: replace Apps Script CRM setup with Supabase leads + auth"
```

---

## Self-Review

**Spec coverage:**
- Data model (leads table) → Task 1. ✓
- RLS policies (anon insert, authenticated select/delete, no anon select) → Task 1. ✓
- Invite-only provisioning + disable signups → Task 1 Steps 3–4. ✓
- `@supabase/supabase-js` client + public env vars → Task 2 (dep already present). ✓
- config.ts cleanup → Task 3. ✓
- Contact insert + local fallback → Tasks 4 (addLead) & 5. ✓
- Admin Supabase Auth login + logout → Task 6. ✓
- Dashboard reads from Supabase, remove Sheet sync/Setup Apps Script → Task 7. ✓
- store.tsx Lead drops `synced`, timestamp←created_at, importLeads removed, backup snapshot only → Task 4. ✓
- Error handling (check `error`, degrade to local, notify) → Tasks 4–7. ✓
- Testing = typecheck/build + manual steps → each task. ✓
- Docs (HANDOVER/README + decommission note) → Task 8. ✓

**Placeholder scan:** No TBD/TODO; all code steps carry real code. ✓

**Type consistency:** `addLead` returns `Promise<{ ok: boolean }>` (defined Task 4, consumed Task 5); `refreshLeads`/`deleteLead`/`clearLeads` async signatures match between store (Task 4) and Dashboard (Task 7); `Lead.timestamp` retained and used in stats; DB columns are snake_case (`property_interest`, `created_at`) and mapped via `rowToLead`. ✓

**Ordering note:** Task 3 intentionally leaves the tree non-compiling until Tasks 5–7; if single-commit-compiles is required, review Tasks 3+5+6+7 as one unit. Tasks 1–2 and 8 are independently compilable/verifiable.
