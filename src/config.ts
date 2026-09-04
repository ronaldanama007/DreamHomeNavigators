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
  GOOGLE_SCRIPT_URL: "",

  /**
   * GOOGLE SHEET CRM — read endpoint (GET) used by Admin → Dashboard → "Sync from Sheet".
   * Usually the SAME Web App URL as above (the provided Apps Script handles
   * both GET and POST). Leave empty to disable sheet sync.
   */
  SHEET_READ_URL: "",

  /** Floating Messenger widget target (m.me link). */
  MESSENGER_URL: "https://m.me/dreamhomenavigators01",

  /** Quick-reply prompts shown in the Messenger widget popup. */
  MESSENGER_QUICK_REPLIES: [
    "Schedule a site visit",
    "Inquire about Pine Deluxe",
    "Do you have OFW payment terms?",
    "What are your current promos?",
  ],

  /** Passcode for the Admin Console (/#/admin). Change before launch. */
  ADMIN_PASSCODE: "DHN2026",

  /** Business email shown across the site + contact cards. */
  EMAIL: "inquiries@dreamhomenavigators.com",
};
