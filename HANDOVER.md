# Project Handover Document: Dream Home Navigators Website

**Client / Brand:** Dream Home Navigators (Philippines)  
**Project:** 5-Page Modern Real Estate Web Application + Standalone Owner Console  
**Delivery Date:** September 6, 2026  
**Repository:** `https://github.com/ronaldanama007/DreamHomeNavigators.git`  
**Target Branches:** `main` (Production) & `AntiGravity-Model` (Staging/Dev)  
**Status:** **Finished & Production Ready**

---

## 1. Executive Summary

This project delivers a bespoke, production-ready real estate brokerage web application for **Dream Home Navigators**. The platform combines a consumer-facing marketing and property discovery website with an administrative **Owner Console** for lead management, listing updates, and content editing.

### Key Deliverables:
- **5 Public Pages:**
  1. **Home:** Dynamic video hero showcase, interactive location quick-filter pills, animated statistics counters, featured properties grid, buyers & investors guides, property spotlight, and quick consultation CTA.
  2. **Properties:** Comprehensive listings catalog with smart location filtering (Iloilo, Tagaytay, Cavite, Antipolo, Binondo), dynamic badge indicators (Featured, RFO, Available), smart grid alignment (centering solitary listings on the last row), and direct inquiry triggers.
  3. **Services:** 6 core brokerage service packages, detailed 4-step buyer roadmap timeline, OFW-tailored consultation highlights, and consultation booking CTAs.
  4. **About Us:** Brand narrative, leadership vision and mission, 3 core operating principles, team roster, and client assurance badges.
  5. **Contact:** Interactive contact channels (Call, SMS, Messenger, Facebook), official office coordinates, service territories, and direct lead generation form with 1-click property pre-fill.
- **Hidden Owner Console (`#/dhn-owner`):**
  - Gated by a security passcode with persistent failed-attempt lockout protection.
  - **Leads Dashboard:** Real-time inquiry log, stats overview, phone click-to-call, CSV export, and two-way Google Sheet synchronization.
  - **Property Manager:** Add, edit, delete, and feature property listings with instant preview and localStorage persistence.
  - **Services & About Editors:** Live copy and feature editors updating public pages without code modification.
  - **Setup Guide:** In-app setup instructions and one-click copyable Google Apps Script code.
- **Embedded Floating Messenger Widget:**
  - One-tap Messenger launcher connected to `https://m.me/dreamhomenavigators01`.
  - Built-in quick reply prompts, tap-outside dismiss backdrop, and isolated touch events.
- **Full-Viewport Cinema Lightbox:**
  - High-definition property photo and video tour viewer with filmstrip navigation, mobile swipe gestures, and strict escape controls (via 'X' button or keyboard `Esc`).

---

## 2. Technical Stack & Specifications

| Layer | Technology / Tool | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript (Strict mode) | Type-safe, high-performance UI component rendering |
| **Build & Bundling** | Vite 6 | Rapid Hot Module Replacement and optimized production bundling |
| **CSS Architecture** | Tailwind CSS v4 (CSS-first engine) | Custom glassmorphism design tokens and mobile-first responsive utility layers |
| **Typography** | Google Fonts: Fraunces & Plus Jakarta Sans | Editorial display serif titles + clean, highly legible modern body sans-serif |
| **Iconography** | FontAwesome 6/7 CDN | Unified iconography across cards, features, and navigation |
| **State & Persistence** | React Context + LocalStorage | Client-side reactive store powering dynamic listings and lead caching |
| **CRM Integration** | Google Apps Script Web App (JSON POST/GET) | Free, automated lead capture directly to Google Sheets |

---

## 3. Architecture & Codebase Map

```
c:\Users\nhads\AntiGravity\
├── index.html                   # HTML entry point, Google Fonts, FontAwesome CDN, metadata
├── package.json                 # Project scripts and dependencies
├── vite.config.ts               # Vite bundler configuration
├── src/
│   ├── main.tsx                 # React application mounting point
│   ├── App.tsx                  # Core state-based router, ambient backdrops, owner route handler
│   ├── config.ts                # Single source of truth for all client configuration (URLs, passcodes, etc.)
│   ├── data.ts                  # Static seeds, mock listings, team roster, contact details, price formatters
│   ├── store.tsx                # Context provider managing editable properties, leads, services, and copy
│   ├── ui.tsx                   # Reusable UI primitives: Reveal, CountUp, SectionHead, Logo, Diamond
│   ├── index.css                # Tailwind v4 theme tokens, glass panels, button styles, animations
│   ├── components/
│   │   ├── Nav.tsx              # Sticky glass navbar, mobile hamburger drawer, touch passthrough
│   │   ├── Footer.tsx           # Multi-column site footer with quick links, contacts, and copyright
│   │   ├── MessengerFab.tsx     # Floating Facebook Messenger widget with touch isolation & backdrop
│   │   └── PropertyCard.tsx     # Property card component with cinema photo/video lightbox portal
│   └── pages/
│       ├── Home.tsx             # Homepage showcase and featured listings
│       ├── Properties.tsx       # Property catalog with location filters and centered grid alignment
│       ├── Services.tsx         # Comprehensive services overview and buyer roadmap
│       ├── About.tsx            # Company story, mission, core principles, and team
│       ├── Contact.tsx          # Contact channels and lead generation form with auto-prefill
│       └── Admin.tsx            # Passcode-protected Owner Console (Leads, Properties, Content, Setup)
├── public/assets/               # Static assets, branding images, and property photography
├── README.md                    # Setup and integration documentation for administrators
└── GEMINI.md                    # Architectural reference rules and developer handover guidelines
```

---

## 4. Key Behaviors & Business Logic

### 1. Smart Grid Alignment (Lone Listing Centering)
When filtering properties (e.g., Iloilo's 4 model units: Samantha, Janella, Natalia, Rosanna):
- **Desktop (3-column view):** If the final row has only one property (`length % 3 === 1`), the solitary card automatically receives `xl:col-start-2 xl:col-span-1`, centering it in column 2 rather than leaving an empty gap on the right.
- **Tablet (2-column view):** If an odd number of cards leaves a solitary card (`length % 2 === 1`), it receives `sm:col-span-2 sm:max-w-md sm:mx-auto`, keeping the layout balanced.

### 2. One-Click Unit Inquiry
Clicking "Inquire" on any property card or featured showcase:
1. Automatically switches to the `Contact` page.
2. Pre-fills `propertyInterest` with the exact property name.
3. Pre-fills the message box with: `"Hello, I am interested in inquiring about this unit: [Property Name]. Please provide more details and schedule a site visit."`
4. Smooth-scrolls the viewport to the inquiry form.
5. Automatically focuses the "Full Name" input field after a ~140ms settling timeout.

### 3. Google Sheets CRM Integration
- The Contact form sends a `no-cors` HTTP POST request with `Content-Type: text/plain;charset=utf-8` to the Google Apps Script Web App.
- This bypasses standard browser CORS preflight restrictions, enabling static hosting to save leads directly to a Google Sheet.
- Leads are simultaneously written to the browser's `localStorage` (`dhn_leads_v1`), ensuring the Owner Console leads table remains functional even in demo mode or if offline.
- When `SHEET_READ_URL` is configured, clicking **"Sync from Sheet"** in the Owner Console performs a GET request to fetch remote leads and deduplicates records by `timestamp + phone`.

### 4. Owner Console Security
- Reachable only via the secret hash route: `https://[domain]/#/dhn-owner` (no hyperlinks exist anywhere on the public site).
- Requires passcode `DHN2026` (configurable via `src/config.ts`).
- Failed attempts are tracked in `localStorage` (`dhn_admin_attempts`). After 5 consecutive failed entries, the gate is locked for 60 seconds (`dhn_admin_locked_until`), persisting across browser refreshes.
- Authorized session is stored in `sessionStorage` (`dhn_admin`), which expires automatically when the browser tab is closed.

### 5. Mobile Touch & Interaction Isolation
- The floating Messenger widget wrapper uses `pointer-events-none` so inactive space never blocks background taps.
- The chat popup card is mounted only when `open === true`, with a full-screen tap-to-dismiss overlay (`bg-black/50 backdrop-blur-sm`).
- Nav mobile drawer is unmounted when closed, preventing invisible hit-testing boxes from intercepting hero buttons.
- Form inputs enforce a minimum font size of `16px` to prevent iOS Safari from automatically zooming in when fields are focused.
- All interactive elements strictly meet the WCAG touch target guideline of `≥ 44px`.

---

## 5. Configuration & Credentials Reference (`src/config.ts`)

All operational configuration parameters are centralized in `src/config.ts`:

| Configuration Key | Current Value | Description / Action Required |
| :--- | :--- | :--- |
| `GOOGLE_SCRIPT_URL` | `""` | Deploy Google Apps Script (code in `README.md`) and paste web app `/exec` URL here |
| `SHEET_READ_URL` | `""` | Same Web App `/exec` URL (powers "Sync from Sheet" in Admin Console) |
| `MESSENGER_URL` | `https://m.me/dreamhomenavigators01` | Official Facebook Messenger endpoint |
| `MESSENGER_QUICK_REPLIES` | 4 Real Estate Prompts | Quick reply chips shown in the widget chat popup |
| `ADMIN_ROUTE_HASH` | `#/dhn-owner` | Secret URL hash route to access the Owner Console |
| `ADMIN_PASSCODE` | `DHN2026` | Console password (**Recommended to change prior to public launch**) |
| `ADMIN_MAX_ATTEMPTS` | `5` | Maximum failed attempts allowed before lockout |
| `ADMIN_LOCK_SECONDS` | `60` | Duration (in seconds) of temporary console lockout |
| `EMAIL` | `support@dreamhomenavigators.com` | Primary business email displayed across the site |
| `LOGO_URL` | Direct Drive CDN link | Direct brand logo image source (falls back to SVG if offline) |

---

## 6. Deployment & Hosting Guide

The project compiles to pure static HTML/CSS/JS files (`dist/`), making it compatible with any modern static web host.

### Production Build:
```bash
npm install
npm run build
```
The output files will be created in the `dist/` directory.

### Recommended Hosting Options:
1. **Cloudflare Pages (Recommended):**
   - Connect GitHub repository `ronaldanama007/DreamHomeNavigators`.
   - Build command: `npm run build`
   - Output directory: `dist`
   - Includes free SSL, global CDN, and DDoS mitigation.
2. **Netlify / Vercel:**
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## 7. Client Pre-Launch Checklist

Before handing over to the marketing team for public promotion:

- [ ] **Deploy Google Sheet CRM:** Follow instructions in `README.md` to deploy the Google Apps Script and update `GOOGLE_SCRIPT_URL` in `src/config.ts`.
- [ ] **Update Owner Passcode:** Change `ADMIN_PASSCODE` in `src/config.ts` from `DHN2026` to a secure client password.
- [ ] **Custom Domain & SSL:** Map the custom domain (e.g., `dreamhomenavigators.com`) to the hosting provider and confirm HTTPS is active.
- [ ] **Verify Facebook Messenger:** Confirm that messages sent to `https://m.me/dreamhomenavigators01` trigger notifications on the company's Meta Business Suite app.
- [ ] **Test Form Submission:** Submit a test lead through the Contact page and verify that it populates both the Google Sheet and the Owner Console dashboard.
