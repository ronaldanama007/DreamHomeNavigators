/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DREAM HOME NAVIGATORS — CLIENT CONFIGURATION
 *  Edit ONLY this file to customize integrations. No other code changes needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const CONFIG = {
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
   * Convenience only; real protection is Supabase Auth + RLS, not this hash.
   * Open it by typing this hash route, e.g. https://yoursite.com/#/dhn-owner
   */
  ADMIN_ROUTE_HASH: "#/dhn-owner",

  /** Business email shown across the site + contact cards. */
  EMAIL: "support@dreamhomenavigators.com",

  /**
   * Brand logos shown in header, footer and console.
   * Local official logo assets from client materials.
   */
  LOGO_MARK_URL: "/assets/img/logo-mark-light.png",
  LOGO_URL: "/assets/img/logo-full-light.png",
};
