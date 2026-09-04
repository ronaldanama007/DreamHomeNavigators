# Dream Home Navigators — Website & Configuration Guide

A 5-page blue-glassmorphism real estate website (Home, Properties, Services, About, Contact)
plus a built-in **Admin Console** (Leads Dashboard + Property Manager + Setup Guide).

All client-configurable settings live in **one file: `src/config.ts`**.

---

## 1. Google Sheet CRM Integration (Lead Form → Google Sheet)

The Contact form submits leads with `fetch` using `mode: "no-cors"` and
`Content-Type: text/plain;charset=utf-8` — this avoids CORS preflight failures with
Google Apps Script. Leads are *also* saved locally in the browser so the Admin Dashboard
works even before the sheet is connected.

### Step-by-step setup

1. **Create a Google Sheet** and name it `Dream Home Navigators — Leads`.
2. Open **Extensions → Apps Script**.
3. Delete the sample code and paste the script below, then **Save** (💾).
   The script auto-creates a `Leads` tab with headers on the first submission.
4. Click **Deploy → New deployment → Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Authorize when prompted.
5. **Copy the Web App URL** (ends in `/exec`).
6. Paste it into `src/config.ts`:

```ts
GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
SHEET_READ_URL:   "https://script.google.com/macros/s/XXXX/exec", // same URL
```

7. Rebuild the site (`npm run build`) and test with a sample inquiry — the row appears
   in the Sheet within seconds.

> ⚠️ After every edit to the Apps Script code, create a **new deployment version**
> (Deploy → Manage deployments → ✏️ → New version) or changes won't go live.

### The Apps Script to paste

```js
// ─── Dream Home Navigators · Lead CRM (Google Apps Script) ───
var SHEET_NAME = "Leads";
var HEADERS = ["Timestamp", "Name", "Phone", "Email", "Location",
  "Budget", "Property of Interest", "Message", "Source"];

function doGet() {
  var rows = getSheet_().getDataRange().getValues();
  var headers = rows.shift() || HEADERS;
  var leads = rows.map(function (r) {
    var o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
  return json_({ ok: true, leads: leads });
}

function doPost(e) {
  var d = JSON.parse((e.postData && e.postData.contents) || "{}");
  getSheet_().appendRow([
    new Date(),
    d.name || "", d.phone || "", d.email || "",
    d.location || "", d.budget || "",
    d.propertyInterest || "", d.message || "",
    d.source || "Website"
  ]);
  return json_({ ok: true });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

The same script handles **POST** (receive leads) and **GET** (return all leads as JSON),
which powers both the form and the dashboard sync below.

### Dashboard → "Sync from Sheet"

With `SHEET_READ_URL` set, the **Admin Console → Leads Dashboard → Sync from Sheet**
button pulls every row from the sheet (including leads typed directly into it),
normalizes headers, and de-duplicates by timestamp + phone.

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

## 3. Admin Console (`Admin Console` link in the footer)

Protected by a passcode (default: **`DHN2026`** — change `ADMIN_PASSCODE` in `src/config.ts`).

### Leads Dashboard
- Stat chips: total leads, last 7 days, top location, most-requested property.
- Full lead table with click-to-call phone links, per-row delete, and clear-all (with confirm).
- **Sync from Sheet** (requires `SHEET_READ_URL`) and **Export CSV**.

### Properties tab — add & delete listings with no code
- **Add:** name, location, area, price (PHP), beds/baths/parking, floor area, type,
  badge, tagline, and a photo (pick a preset or paste any image URL).
  New listings appear on the Properties page instantly (and on Home if badged "Featured").
- **Delete:** trash icon on any listing (defaults are soft-deleted, custom ones removed).
- **Restore defaults** brings back the original 10 listings.
- Changes persist in the browser's `localStorage`.

> 📌 **Production note:** localStorage is per-browser. For a multi-user rollout, keep the
> Google Sheet as the source of truth — manage listings in a second `Properties` tab and
> pull leads via "Sync from Sheet". The same Apps Script pattern extends to listings.

### Setup Guide tab
The Admin Console contains this same guide in-app, with **copy buttons** for the Apps
Script and live status badges showing which integrations are configured.

---

## 4. Everything configurable in `src/config.ts`

| Key | Purpose |
| --- | --- |
| `GOOGLE_SCRIPT_URL` | Apps Script Web App URL — receives form leads (POST) |
| `SHEET_READ_URL` | Same URL — dashboard pulls leads (GET) |
| `MESSENGER_URL` | Messenger widget target |
| `MESSENGER_QUICK_REPLIES` | Widget quick-reply prompts |
| `ADMIN_PASSCODE` | Admin Console passcode |
| `EMAIL` | Business email shown site-wide |

## 5. Run & deploy

```bash
npm install
npm run build    # outputs dist/ — deploy to any static host (Cloudflare Pages, Netlify, Vercel)
```
