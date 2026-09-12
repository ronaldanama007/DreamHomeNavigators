# Dream Home Navigators — Website & Configuration Guide

A 5-page blue-glassmorphism real estate website (Home, Properties, Services, About, Contact)
plus a hidden **Owner Console** (Leads Dashboard + Property Manager + Setup Guide) protected by
Supabase authentication.

Non-secret site settings live in **`src/config.ts`**; Supabase credentials live in **`.env`**.

---

## 1. Leads CRM — Supabase (secure by default)

Leads are stored in **Supabase** (Postgres) and protected by **Row Level Security (RLS)**:

- The public **Contact form can only insert** a lead.
- **Only signed-in admin accounts can read or delete** leads — anonymous visitors
  cannot read the CRM, even though the site is static.

The Supabase URL and publishable (anon) key ship in the browser bundle and are
**public by design** — access is enforced server-side by RLS, not by hiding the key.

### Step-by-step setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).
2. **Run the migration** in `supabase/migrations/` (Supabase → SQL Editor, or the
   Supabase CLI). It creates the `leads` table and its RLS policies.
3. **Disable public signups:** Supabase → Authentication → Providers/Settings →
   turn off "Allow new users to sign up" (invite-only admins).
4. **Create admin accounts:** Supabase → Authentication → Users → Add user (or invite
   by email). Repeat for each admin.
5. **Set env vars** — copy `.env.example` to `.env` and fill in (Project Settings → API):

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLISHABLE_KEY
```

6. Rebuild the site (`npm run build`) and test with a sample inquiry — the lead appears
   in the Supabase `leads` table (and in the Admin Dashboard) within seconds.

> If a submission ever fails (e.g. the browser is offline), the lead is queued in
> `localStorage` as a fallback so it is never lost.

---

## 2. Floating Messenger Widget

Pre-wired to **`https://m.me/dreamhomenavigators01`** with these quick replies:

- "Schedule a site visit"
- "Inquire about Pine Deluxe"
- "Do you have OFW payment terms?"
- "What are your current promos?"

### To change it

Edit `src/config.ts`:

```ts
MESSENGER_URL: "https://m.me/dreamhomenavigators01",
MESSENGER_QUICK_REPLIES: [
  "Schedule a site visit",
  "Inquire about Pine Deluxe",
],
```

> 💡 For true *in-chat* quick replies (inside Messenger itself), also add them in
> **Meta Business Suite → Inbox → Automated responses → Frequently asked questions**.

---

## 3. Owner Console — hidden from the public site

> 🔒 **There is no link to the console anywhere on the website.** It renders in a
> standalone view (no public header, footer, or Messenger widget) and is reachable
> only by typing the secret route into the browser address bar:
>
> ```
> https://yoursite.com/#/dhn-owner
> ```
>
> - **Hidden route** — change it via `ADMIN_ROUTE_HASH` in `src/config.ts`
>   (keep the leading `#/`). The browser tab title shows only "Owner Console".
>   This is a convenience, **not** the security boundary.
> - **Authentication** — sign in with a Supabase admin email/password. Only invited
>   accounts exist (public signups disabled), and Supabase rate-limits sign-in attempts.
> - **Session** — the login persists across reloads; press **Sign out** to end it.
> - **Data protection** — leads are guarded by Supabase RLS: the publishable key in
>   the bundle can only insert a lead, so anonymous visitors can never read the CRM.

### Leads Dashboard
- Stat chips: total leads, last 7 days, top location, most-requested property.
- Full lead table with click-to-call phone links, per-row delete, and clear-all (with confirm).
- Leads load live from Supabase; **Export CSV** downloads the current list.

### Properties tab — add, edit & delete listings with no code
- **Add:** name, location, area, price (PHP), price note, beds/baths/parking,
  floor area, lot note (for lot-only listings), type, badge, tagline, and a photo
  (pick a preset or paste any image URL). New listings appear on the Properties
  page instantly.
- **Edit:** pencil icon loads every detail of a listing into the form — price,
  specs, badge, photo, tagline, everything — and "Save Changes" pushes it live.
  Rows show **Added** / **Edited** status chips.
- **Home featured listing:** the ★ star on any row makes that unit the featured
  card in the Home hero (rows show a "Home featured" chip). Badging a unit
  "Featured" while adding/editing claims the spot automatically. Clearing it
  falls back to the first "Featured" badge, then the first listing.
- **Delete:** trash icon on any listing with a two-step confirm
  (defaults are soft-deleted, custom ones removed; deleting the featured unit
  clears the featured spot).
- **Restore defaults** brings back the original listings.
- Changes persist in the browser's `localStorage`.

### Services tab — edit the Services page (and Home previews)
- Add, edit, and delete service cards: icon (curated icon picker), title,
  description, and a "what's included" bullet list (one per line).
- Updates the Services page grid and the three service previews on Home.
- **Restore defaults** returns the original six services.

### About Page tab — edit the About Us copy
- Story kicker + headline, both story paragraphs, mission, vision, and the
  "Why choose us" checklist (one point per line — add/remove freely).
- **Restore defaults** returns the original copy. (Team roster stays in
  `src/data.ts` → `TEAM`.)

> 📌 **Production note:** listing edits use per-browser `localStorage`, so they are not
> yet shared across admins. Leads, however, are already centralized in Supabase and shared
> across all admins. A future step could move listings into Supabase too.

### Setup Guide tab
The Admin Console contains this same guide in-app, with live status badges and notes on
the Supabase and Messenger integrations.

---

## 4. Configuration reference

**Supabase credentials — `.env`** (copy from `.env.example`; public by design, RLS-protected):

| Key | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project API URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable (anon) key |

**Non-secret site config — `src/config.ts`:**

| Key | Purpose |
| --- | --- |
| `MESSENGER_URL` | Messenger widget target |
| `MESSENGER_QUICK_REPLIES` | Widget quick-reply prompts |
| `ADMIN_ROUTE_HASH` | Hidden route that opens the Owner Console (default `#/dhn-owner`) |
| `EMAIL` | Business email shown site-wide |

## 5. Handover to another developer or AI agent

- **Comprehensive Handover Guide**: See **`HANDOVER.md`** for detailed architecture maps, step-by-step instructions on updating listings, configuration, colors, pre-launch checklists, and production deployment procedures.
- **AI Agent Context (`GEMINI.md`)**: This repo includes **`GEMINI.md`** at the project root — the Gemini CLI reads it
automatically as project context. Other agents (Claude Code → `CLAUDE.md`, Cursor → `.cursorrules`)
can simply be pointed at the same file.

## 6. Run & deploy

```bash
npm install
npm run build    # outputs dist/ — deploy to any static host (Cloudflare Pages, Netlify, Vercel)
```
