# GEMINI.md — Project Handover: Dream Home Navigators Website

> This file is auto-loaded by the Gemini CLI. It is the single source of truth for
> a new agent taking over this codebase. Read it fully before editing anything.

## 1. What this is

A 5-page real-estate brokerage website for **Dream Home Navigators** (Philippines),
delivered as a client rebuild: Home, Properties, Services, About Us, Contact —
plus a **hidden, Supabase-authenticated Owner Console** (leads dashboard, property manager,
services editor, about-page editor, setup guide).

Client requirements already satisfied (do not regress):
- Blue glassmorphism theme, mobile-first, premium real-estate feel
- Interactive location filtering: Iloilo, Tagaytay, Cavite, Antipolo, Binondo
- One-click "Inquire About This Unit" → navigates to Contact, pre-fills
  `propertyInterest` + message template, smooth-scrolls, focuses Full Name
- Lead form → Supabase `leads` table (RLS: anon insert-only), with a localStorage
  fallback queue if the insert fails offline
- Floating Messenger widget → `https://m.me/dreamhomenavigators01` with quick replies
- Owner console hidden from the public site (secret hash route, no links anywhere)

## 2. Stack & commands

- React 19 + Vite 6 + TypeScript (strict), Tailwind CSS **v4 (CSS-first)**
- Fonts: Fraunces (display serif) + Plus Jakarta Sans (body) via Google Fonts in `index.html`
- Icons: FontAwesome 7 CDN in `index.html` (solid/regular/brands prefixes)
- Runtime deps: `uuid`, `@supabase/supabase-js`
- `npm install` → `npm run dev` / `npm run build` (output: `dist/`, single-page static deploy)
- Requires `.env` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (see `.env.example`)
- Never edit `package.json` / `vite.config.ts` by hand; use the package tooling.

## 3. Architecture map

```
index.html            Fonts, FontAwesome, favicon, title
src/main.tsx          Mounts <App/>
src/index.css         Tailwind v4: @theme tokens (brand/ink/brass palettes, fonts,
                      animations) + @layer components (glass-panel, glass-panel-deep,
                      glass-panel-light, glass-chip, .btn-*, .field, .reveal, keyframes)
src/config.ts         Non-secret client values (see §7); Supabase creds are in .env
src/supabase.ts       Supabase client singleton (reads VITE_SUPABASE_* from .env)
supabase/migrations/  SQL: leads table + RLS policies (anon insert, auth read/delete)
src/data.ts           Seeds/content: Property[], SERVICE_SEED, ABOUT_SEED, TEAM, STATS,
                      TESTIMONIALS, LOCATIONS, BUDGETS, CONTACT (reads config), fmtPrice()
src/store.tsx         StoreProvider + useStore(): the editable state layer (see §6)
src/ui.tsx            Reveal (scroll reveal), CountUp, SectionHead, Logo (img w/ fallback), Diamond
src/App.tsx           State-based router + shared layered background + hidden owner route
src/components/       Nav, Footer, MessengerFab, PropertyCard
src/pages/            Home, Properties, Services, About, Contact, Admin (console)
README.md             Client-facing setup guide (Sheet CRM, Messenger, console)
```

## 4. Design system (don't break the identity)

- Palette tokens: `brand-*` (blue scale, primary #1e40af / accent #3b82f6),
  `ink-800/900/950` (deep navy surfaces), `brass-200/300/400` (gold accents — used sparingly).
- Glass surfaces are **classes, not utilities**: `.glass-panel` (dark), `.glass-panel-deep`
  (darker, for heavy content), `.glass-panel-light` (white, used on the lead form +
  property cards). They live in `@layer components` so Tailwind utilities (e.g.
  `rounded-3xl`, `!rounded-none`) can override them.
- Typography: `font-display` = Fraunces for headings; body = Plus Jakarta Sans.
  `.kicker` = small uppercase eyebrow with rule. Strong size contrast is intentional.
- Motion: `.reveal` + `Reveal` component (IntersectionObserver), Ken Burns hero image,
  marquee ticker, count-up stats, hover lifts. **Every animation has a
  `prefers-reduced-motion` fallback** — preserve this when adding motion.
- No glass on everything, no indigo/violet gradients — this is navy + blue + brass.

## 5. Routing

- `App.tsx` holds `page: Page` state; `Page = "home" | "properties" | "services" | "about" | "contact"`
  (intentionally **excludes** the console — it must not be linkable from public UI).
- `go(page)` scrolls to top; `browseLocation(loc)` sets the filter then goes to Properties;
  `inquire(name)` builds the `Prefill` then goes to Contact.
- **Owner console** renders standalone when `window.location.hash === CONFIG.ADMIN_ROUTE_HASH`
  (default `#/dhn-owner`): its own dark background, no Nav/Footer/MessengerFab,
  document title "Owner Console". `Admin` receives `exit` (clears hash), never `go`.

## 6. State layer (`src/store.tsx`)

Site **content** is localStorage-backed (seeds from `data.ts`). Keys:
`dhn_custom_properties_v3`, `dhn_deleted_properties_v3`, `dhn_custom_rentals_v1`,
`dhn_deleted_rentals_v1`, `dhn_services_v2`, `dhn_about_v1`, `dhn_featured_v1`.

**Leads** are Supabase-backed, not localStorage: `refreshLeads()` (authenticated SELECT),
`addLead()` (anon INSERT + `dhn_leads_v1` fallback on failure), `deleteLead()`, `clearLeads()`.
The `Lead.timestamp` field maps from the DB `created_at` column.

- `properties` = PROPERTIES minus deleted, plus custom/edited overrides.
- `rentalProperties` = RENTAL_PROPERTIES minus deleted rentals, plus custom/edited rental overrides.
- `editedIds` and `rentalEditedIds` drive the "Edited" chips in Owner Console.
- `featuredId` drives the Home hero card (fallback: first `badge==="Featured"`, then first listing).
- Services & About content are **fully store-driven** (Home previews read the store too).
- Leads (Supabase): `refreshLeads()` (auth SELECT), `addLead()` (anon INSERT), `deleteLead()`, `clearLeads()`, plus CSV export in the Dashboard.
- **Website Auth Backup & Restore** (content only, not leads): `createBackup()`, `restoreBackup()`, `resetAllToFactory()` (JSON snapshot download, file-validation restore, raw JSON inspector, factory reset in Owner Console).
- When adding new editable content: seed in `data.ts`, state + LS key in `store.tsx`,
  read via `useStore()` in the page, add an editor tab in `pages/Admin.tsx`.

## 7. Config reference

**Supabase creds — `.env`** (public by design; RLS enforces access):

| Key | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project API URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable (anon) key |

**Non-secret site config — `src/config.ts`:**

| Key | Current value / purpose |
| --- | --- |
| `MESSENGER_URL` | `https://m.me/dreamhomenavigators01` |
| `MESSENGER_QUICK_REPLIES` | 4 prompts shown in the widget chat card |
| `ADMIN_ROUTE_HASH` | `#/dhn-owner` — console route (convenience, not the auth boundary) |
| `EMAIL` | `support@dreamhomenavigators.com` |
| `LOGO_URL` | Drive direct link `lh3.googleusercontent.com/d/1sYTdg6Izwy6pxVxTlgifZ3vewRuWEiwa`; `Logo` falls back to the inline compass SVG on error |

Phone number lives in `data.ts` → `CONTACT` (`0921 603 0693`, href `tel:+639216030693`).

## 8. Key behaviors (specs to preserve)

1. **Inquire prefill** (`Contact.tsx`): on `prefill` change → set `propertyInterest` +
   message ("Hello, I am interested in inquiring about this unit: [name]…"), bump a
   `key`/flash counter to re-trigger the highlight animation, smooth-scroll
   (`prefersReduced()` → auto), focus Full Name after ~140 ms.
2. **Sheet submit**: `no-cors` POST, text/plain body. With URLs unset it simulates
   latency and console.logs (demo mode) — always also `addLead` locally.
3. **Properties filter**: `key={`${filter}-${properties.length}`}` on the grid so
   `animate-card-in` re-runs on every filter change.
4. **Admin gate**: attempt counter + lock-until timestamp in localStorage
   (`dhn_admin_*`); auth flag in sessionStorage (`dhn_admin`, per-tab only).
5. **MessengerFab**: pulse rings (`animate-ring`), tooltip, quick replies →
   `MESSENGER_URL?ref=…`, CTA opens Messenger in a new tab.

## 9. Conventions & gotchas

- Tailwind v4: custom classes must stay in `@layer components` (unlayered CSS beats
  utilities and breaks `rounded-*`/`!` overrides on glass panels).
- Arbitrary values like `text-[13.5px]`, `p-6.5` are used deliberately; match the scale.
- FontAwesome: `fa-brands` for Messenger/Facebook, `fa-solid`/`fa-regular` otherwise —
  never mix prefixes on one `<i>`.
- Images are remote Unsplash URLs; new property photos accept any URL via the admin form.
- No router lib, no global CSS imports beyond `index.css`, no `alert()`/`confirm()` —
  use the console's two-step confirms and toast (`notify`).
- TS strict: keep `Property` fields optional-safe (`priceNote?`, `lotNote?`).
- Run `npm run build` after changes; fix all type errors before finishing.

## 10. Outstanding client-side items (tell the client, don't "fix" in code)

- Create the Supabase project, run the `leads` migration (`supabase/migrations`),
  disable public signups, create admin users, and set `VITE_SUPABASE_URL` +
  `VITE_SUPABASE_ANON_KEY` in `.env` (see `README.md` §1 and console Setup Guide).
- Decommission the old Google Apps Script deployment — the previously-committed URL and
  passcode (`DHN2026`) are exposed in git history and no longer grant access to anything.
- Make the Drive logo file public ("Anyone with the link") — or copy it to
  `public/logo.png` and set `LOGO_URL: "/logo.png"` (recommended for production).
- Domain, hosting + SSL, and the 10 GB business mailbox are client-provided.

## 11. Quick recipes

- **New page**: add to `Page` union + `data.ts` if needed → create `pages/X.tsx` →
  render switch in `App.tsx` → nav link in `Nav.tsx`/`Footer.tsx` → doc title map.
- **Recolor**: adjust `--color-brand-*` in `@theme` (index.css) — everything follows.
- **New editable field**: seed (`data.ts`) → store state + LS key (`store.tsx`) →
  page reads store → admin editor tab (`pages/Admin.tsx`).
- **Change console route**: `src/config.ts` only. **Manage admins**: Supabase → Authentication → Users.
