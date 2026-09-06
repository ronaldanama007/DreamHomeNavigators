import { useCallback, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Page, Prefill } from "./data";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import MessengerFab from "./components/MessengerFab";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { StoreProvider } from "./store";
import { CONFIG } from "./config";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [locFilter, setLocFilter] = useState<string>("All");
  const [prefill, setPrefill] = useState<Prefill | null>(null);

  /* ── Hidden owner route ────────────────────────────────────────────────────
     The console is reachable ONLY by typing the secret hash route
     (CONFIG.ADMIN_ROUTE_HASH, default "#/dhn-owner") in the address bar.
     No link to it exists anywhere on the public site.                    */
  const [ownerMode, setOwnerMode] = useState(
    () => window.location.hash === CONFIG.ADMIN_ROUTE_HASH
  );
  useEffect(() => {
    const onHash = () => setOwnerMode(window.location.hash === CONFIG.ADMIN_ROUTE_HASH);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const exitOwnerMode = useCallback(() => {
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const go = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const browseLocation = useCallback(
    (loc: string) => {
      setLocFilter(loc);
      go("properties");
    },
    [go]
  );

  /* One-click "Inquire About This Unit" → navigate to Contact, pre-fill, focus */
  const inquire = useCallback(
    (propertyName: string) => {
      setPrefill({
        property: propertyName,
        message: `Hello, I am interested in inquiring about this unit: ${propertyName}. Please provide more details and schedule a site visit.`,
        ts: Date.now(),
      });
      go("contact");
    },
    [go]
  );

  useEffect(() => {
    if (ownerMode) {
      /* Deliberately nondescript — does not advertise an admin area */
      document.title = "Owner Console";
      return;
    }
    document.title =
      page === "home"
        ? "Dream Home Navigators — Find the Right Property. Build the Future You Envision."
        : `${
            { properties: "Properties", services: "Services", about: "About Us", contact: "Contact" }[
              page as Exclude<Page, "home">
            ]
          } · Dream Home Navigators`;
  }, [page, ownerMode]);

  /* Owner console: standalone full-screen view, hidden from the public shell */
  if (ownerMode) {
    return (
      <StoreProvider>
        <div className="relative min-h-screen">
          <div className="fixed inset-0 -z-10 bg-ink-950 pointer-events-none select-none">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "radial-gradient(52% 44% at 18% 8%, rgba(37,99,235,0.22), transparent 70%), radial-gradient(46% 40% at 88% 82%, rgba(30,64,175,0.26), transparent 70%)",
              }}
            />
            <div className="blueprint-grid absolute inset-0" />
          </div>
          <Admin exit={exitOwnerMode} />
        </div>
      </StoreProvider>
    );
  }

  return (
    <StoreProvider>
    <div className="relative min-h-screen">
      {/* ---- Fixed ambient background ---- */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-ink-950 pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/95 via-[#091228]/90 to-[#030712]/98" />
        <div
          className="absolute inset-0 opacity-80 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 18% 12%, rgba(37,99,235,0.24), transparent 70%), radial-gradient(55% 45% at 85% 75%, rgba(56,189,248,0.18), transparent 70%)",
          }}
        />
        <div className="blueprint-grid absolute inset-0 opacity-60" />
        {/* Floating decorative compasses */}
        <svg
          className="absolute -left-24 top-1/3 h-96 w-96 text-primary/[0.05] animate-float-slow"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.75" />
          <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 5" />
          <path d="M50 8 L57 50 L50 92 L43 50 Z" fill="currentColor" />
          <path d="M8 50 L50 43 L92 50 L50 57 Z" fill="currentColor" />
        </svg>
        <svg
          className="absolute -right-20 top-16 h-72 w-72 text-secondary/[0.06] animate-float-slow [animation-delay:2s]"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.75" />
          <path d="M50 12 L56 50 L50 88 L44 50 Z" fill="currentColor" />
          <path d="M12 50 L50 44 L88 50 L50 56 Z" fill="currentColor" />
        </svg>
      </div>

      <Nav page={page} go={go} />

      <main key={page} className="w-full pt-20 bg-background min-h-screen relative overflow-x-hidden z-10 animate-card-in">
        {page === "home" && <Home go={go} inquire={inquire} browseLocation={browseLocation} />}
        {page === "properties" && (
          <Properties filter={locFilter} onFilter={setLocFilter} inquire={inquire} go={go} />
        )}
        {page === "services" && <Services go={go} />}
        {page === "about" && <About go={go} inquire={inquire} />}
        {page === "contact" && <Contact prefill={prefill} go={go} />}
      </main>

      <Footer go={go} browseLocation={browseLocation} />
      <MessengerFab />
      <Analytics />
    </div>
    </StoreProvider>
  );
}
