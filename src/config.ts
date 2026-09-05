/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DREAM HOME NAVIGATORS — CLIENT CONFIGURATION
 *  Edit ONLY this file to customize integrations. No other code changes needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const CONFIG = {
  /**
   * GOOGLE SHEET CRM — lead ingestion endpoint (POST)
   * Paste your deployed Google Apps Script Web App URL here.
   * Leave empty ("") to run in demo mode: leads are saved locally in the
   * browser and still appear in the Admin → Dashboard, but nothing is sent
   * to Google Sheets until this URL is set.
   */
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbznESNpQfCihwM9rjpea7roKuS4z0tuhkqbES-LtJl-3C6bQgITvpLpj_G3XMYeMe37Tw/exec",

  /**
   * GOOGLE SHEET CRM — read endpoint (GET) used by Admin → Dashboard → "Sync from Sheet".
   * Usually the SAME Web App URL as above (the provided Apps Script handles
   * both GET and POST). Leave empty to disable sheet sync.
   */
  SHEET_READ_URL: "https://script.google.com/macros/s/AKfycbznESNpQfCihwM9rjpea7roKuS4z0tuhkqbES-LtJl-3C6bQgITvpLpj_G3XMYeMe37Tw/exec",

  /** Floating Messenger widget target (m.me link). */
  MESSENGER_URL: "https://m.me/dreamhomenavigators01",

  /** Quick-reply prompts shown in the Messenger widget popup. */
  MESSENGER_QUICK_REPLIES: [
    "Schedule a site visit",
    "Inquire about Pine Deluxe",
    "Do you have OFW payment terms?",
    "What are your current promos?",
  ],

  /**
   * HIDDEN ADMIN ROUTE — the console is NOT linked anywhere on the public site.
   * It can only be opened by typing this hash route in the browser address bar,
   * e.g. https://yoursite.com/#/dhn-owner
   * Change it to something only the owners know (keep the leading "#/").
   */
  ADMIN_ROUTE_HASH: "#/dhn-owner",

  /** Passcode for the Admin Console. Change before launch. */
  ADMIN_PASSCODE: "DHN2026",

  /** Lockout policy: after MAX wrong passcodes, the gate locks for LOCK seconds. */
  ADMIN_MAX_ATTEMPTS: 5,
  ADMIN_LOCK_SECONDS: 60,

  /** Business email shown across the site + contact cards. */
  EMAIL: "inquiries@dreamhomenavigators.com",
};
