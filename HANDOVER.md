# Dream Home Navigators — System Handover & Maintenance Guide

> **Official Handover Documentation**
> **Current Active Branch:** `Revision2`
> **Stack:** React 19, TypeScript (Strict), Vite 6, Tailwind CSS v4 (CSS-first `@theme` tokens), FontAwesome 7 Free.

---

## 1. System Overview & Architecture

Dream Home Navigators is a high-performance, single-page real estate brokerage platform built for the Philippine market with a **Cobalt Lumina / Blue Glassmorphism** aesthetic.

### Architecture Map
```
DreamHomeNavigators/
├── index.html               # Head tags, Google Fonts, FontAwesome 7 CDN, title & metadata
├── src/
│   ├── main.tsx             # Application entry point mounting <App />
│   ├── App.tsx              # State-based router, global layout, and owner console hash-listener
│   ├── index.css            # Tailwind v4 theme variables, glass surface layer components & animations
│   ├── config.ts            # Centralized client configuration (passcode, routes, CRM URLs, contact)
│   ├── data.ts              # Seed listings (for-sale & rentals), services seed, about seed, locations
│   ├── store.tsx            # LocalStorage state layer, rental CRUD, CRM lead manager, auth backup
│   ├── ui.tsx               # Reusable UI primitives: Reveal, CountUp, SectionHead, Logo, Diamond
│   ├── components/
│   │   ├── Nav.tsx          # Responsive navigation header with active page tracking
│   │   ├── Footer.tsx       # Multi-column footer with live contact info & direct section links
│   │   ├── MessengerFab.tsx # Floating Facebook Messenger widget with quick-reply prompts
│   │   └── PropertyCard.tsx # Universal property card (photo gallery switcher, video modal, inquiry link)
│   └── pages/
│       ├── Home.tsx         # Hero showcase, quick territory pills, stats, featured units, guides
│       ├── Properties.tsx   # For-sale catalog with territory & budget filtering, smart centering
│       ├── Rentals.tsx      # Rental catalog with territory & quick lease type filters (Daily/Furnished/Comm.)
│       ├── Services.tsx     # 6 brokerage service packages, OFW consultation roadmap, buying guide
│       ├── About.tsx        # Company heritage, mission, vision, core values, team showcase
│       ├── Contact.tsx      # Lead inquiry form with automated unit pre-fill and Google Sheet dispatch
│       └── Admin.tsx        # Secret Owner Console (Leads CRM, For-Sale & Rental CRUD, Site Backup)
├── public/
│   └── assets/img/          # Optimized static photo assets, floor plans, and model cards
├── GEMINI.md                # AI agent handover prompt & single source of truth
├── README.md                # Client-facing setup guide (Sheet CRM, Messenger, console)
├── HANDOVER.md              # System handover and maintenance instructions
└── package.json             # Scripts & dependencies (only runtime dependency: `uuid`)
```

---

## 2. Key Modules & State Management

### A. Routing & The Hidden Owner Console
1. **Public Routing**: Driven by `page: Page` state inside `src/App.tsx` (`"home" | "properties" | "rentals" | "services" | "about" | "contact"`).
2. **Hidden Owner Console**:
   - Access URL: `https://your-site.com/#/dhn-owner` (or whatever `CONFIG.ADMIN_ROUTE_HASH` is set to in `src/config.ts`).
   - Gated by `ADMIN_PASSCODE` (default: `DHN2026`) with a 5-attempt lockout (60 seconds) stored in `localStorage`.
   - The owner console is **completely excluded** from all public navigation, footer, and sitemaps.

### B. State Layer (`src/store.tsx`)
LocalStorage-backed state with zero backend dependencies required for demo and operation:
- `dhn_custom_properties_v3` / `dhn_deleted_properties_v3`: Custom and edited For-Sale listings.
- `dhn_custom_rentals_v1` / `dhn_deleted_rentals_v1`: Custom and edited Rental listings.
- `dhn_leads_v1`: Locally captured contact form leads.
- `dhn_services_v2`: Service packages.
- `dhn_about_v1`: About Us copy and company statements.
- `dhn_featured_v1`: Selected listing for the Home hero banner.

---

## 3. How to Update the System (Operational Guide)

### Workflow 1: Updating Configuration & Security
**Target File**: `src/config.ts`

To change contact info, console passwords, or CRM integrations:
```ts
export const CONFIG = {
  // 1. Google Sheets CRM Integration
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
  SHEET_READ_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",

  // 2. Facebook Messenger
  MESSENGER_URL: "https://m.me/dreamhomenavigators01",

  // 3. Owner Console Security
  ADMIN_ROUTE_HASH: "#/dhn-owner",    // Change to a secret hash, e.g., "#/secure-dhn-2026"
  ADMIN_PASSCODE: "DHN2026",          // MUST change before production launch!
  ADMIN_MAX_ATTEMPTS: 5,
  ADMIN_LOCK_SECONDS: 60,

  // 4. Branding & Contact
  EMAIL: "support@dreamhomenavigators.com",
};
```

---

### Workflow 2: Managing Listings Without Code (Owner Console)
1. Open the website and navigate to `#/dhn-owner`.
2. Enter the passcode to unlock the console.
3. **Properties Tab**:
   - Add new for-sale listings or edit existing ones.
   - Click the ★ star to feature a unit in the Home page hero card.
   - Toggle badges: `Featured`, `Available`, `RFO`, `Pre-Selling`, `New Launch`.
4. **Rental Units Tab**:
   - Manage monthly rentals and daily staycations (e.g., Avida Tower 3).
   - Set monthly rates (`₱/mo`) or daily stay rates (`₱/day`).
   - Set badges: `Daily Stay`, `Fully Furnished`, `Long-term Lease`, `Ready for Occupancy`, `Commercial Space`, `Executive Suite`.
5. **Website Backup Tab**:
   - Download `.json` state snapshots for disaster recovery.
   - Restore snapshots with automatic validation.
   - Access the Raw JSON inspector or execute a factory reset if needed.

---

### Workflow 3: Adding New Listings Directly in Code
**Target File**: `src/data.ts`

1. **Place photo files** into `public/assets/img/<project-folder>/` or `public/assets/img/`.
2. Open `src/data.ts` and add the unit into either `PROPERTIES` (for sale) or `RENTAL_PROPERTIES` (for lease):

```ts
// Example: Adding a For-Sale Property
{
  id: "model-unique-id",
  name: "Model Name at Subdivision",
  location: "Iloilo", // Must be one of: "Iloilo" | "Tagaytay" | "Cavite" | "Antipolo" | "Binondo"
  area: "District, City",
  type: "Single-Attached 2-Storey House & Lot",
  badge: "Available", // "Featured" | "Available" | "RFO" | "Pre-Selling" | "New Launch"
  beds: 3,
  baths: 2,
  parking: 1,
  sqm: 65,
  lotNote: "60 sqm lot · Sunset Boulevard Access",
  price: 11350.75,
  priceLabel: "Monthly amortization starts at", // or "Price starts at"
  priceNote: "3 Bedrooms · 2 T&B · Balcony · Carport",
  img: "/assets/img/model-facade.jpg",
  gallery: [
    "/assets/img/model-facade.jpg",
    "/assets/img/model-plan.jpg",
  ],
  tagline: "Short 1-line description of the property.",
  highlights: [
    "Key selling point 1",
    "Key selling point 2",
    "Key selling point 3",
  ],
  developer: "Developer Name",
  category: "sale",
}
```

```ts
// Example: Adding a Rental / Staycation Unit
{
  id: "rent-unique-id",
  name: "Suite Name at Condominium",
  location: "Iloilo",
  area: "District, City",
  type: "Condominium Staycation / Suite",
  badge: "Daily Stay", // "Daily Stay" | "Fully Furnished" | "Long-term Lease" | "Commercial Space"
  beds: 1,
  baths: 1,
  parking: 1,
  sqm: 25,
  lotNote: "Modern Home Away From Home",
  price: 2000,
  priceLabel: "Daily Stay Rate", // or "Monthly Rental Rate"
  priceNote: "PHP 2,000 Daily · Book Family Stay",
  img: "/assets/img/suite-photo.jpg",
  gallery: ["/assets/img/suite-photo.jpg"],
  tagline: "Prime transient staycation suite.",
  highlights: [
    "Full air conditioning and high-speed Wi-Fi",
    "Resort-style pool and gym access",
  ],
  category: "rental",
  isRental: true,
}
```

---

### Workflow 4: Modifying the Design & Colors
**Target File**: `src/index.css`

The project utilizes Tailwind v4 `@theme` tokens:
```css
@theme {
  /* Brand Blues */
  --color-brand-50:  #eef5ff;
  --color-brand-300: #7bd0ff;
  --color-brand-500: #2563eb;
  --color-brand-600: #1d4ed8;
  --color-brand-800: #1e3a8a;

  /* Surfaces */
  --color-ink-900:   #091228;
  --color-ink-950:   #050d23;

  /* Brass / Gold Accents */
  --color-brass-300: #d4af37;
}
```
Glassmorphism surfaces are declared under `@layer components`:
- `.glass-panel`: Standard dark semi-transparent card.
- `.glass-panel-deep`: Deep navy background for high contrast tables/forms.
- `.glass-panel-light`: Bright white glassmorphism card for property cards and lead forms.

---

## 4. Build, Verification & Deployment

### Local Development Commands
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript check & build production bundle
npm run build
```

### Deploying to Production
The production output is generated in the `dist/` directory as a static single-page application (SPA).

#### Supported Hosting Platforms:
1. **Cloudflare Pages**:
   - Build command: `npm run build`
   - Build output directory: `dist`
2. **Vercel**:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. **Netlify**:
   - Build command: `npm run build`
   - Publish directory: `dist`

> ⚠️ **SPA Routing Note**: Ensure all 404s route to `/index.html` on your static host if using direct URL paths.

---

## 5. Pre-Launch Checklist

- [ ] Deploy Google Apps Script and update `GOOGLE_SCRIPT_URL` & `SHEET_READ_URL` in `src/config.ts`.
- [ ] Change `ADMIN_PASSCODE` and `ADMIN_ROUTE_HASH` in `src/config.ts` to private credentials.
- [ ] Test the Contact lead submission form and verify rows arrive in the Google Sheet CRM.
- [ ] Test inquiry buttons on both For-Sale and Rental cards to verify pre-fills function correctly.
- [ ] Test website backup download and restore in the Owner Console (`#/dhn-owner`).
- [ ] Run `npm run build` to ensure zero compilation or typecheck errors prior to every release.
