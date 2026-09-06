import { useEffect, useState } from "react";
import { Page } from "../data";
import { Logo } from "../ui";

const LINKS: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "properties", label: "Properties" },
  { id: "services", label: "Services" },
  { id: "about", label: "About Us" },
  { id: "contact", label: "Contact" },
];

export default function Nav({
  page,
  go,
}: {
  page: Page;
  go: (p: Page) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (p: Page) => {
    setOpen(false);
    go(p);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5 pointer-events-none">
      <div
        className={`mx-auto mt-3 flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:mt-4 sm:px-5 pointer-events-auto ${
          scrolled
            ? "glass-panel-deep !rounded-2xl shadow-2xl bg-ink-950/90 border border-brand-400/20"
            : "glass-panel !rounded-2xl bg-ink-950/60 backdrop-blur-md border border-white/10 shadow-lg"
        }`}
      >
        <button
          onClick={() => nav("home")}
          className="group flex items-center gap-3 text-left cursor-pointer active:scale-95"
          aria-label="Dream Home Navigators — home"
        >
          <span className="transition-transform duration-500 group-hover:rotate-12">
            <Logo size={42} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-semibold tracking-wide text-slate-50">
              Dream Home Navigators
            </span>
            <span className="hidden sm:block text-[10.5px] font-medium tracking-wide text-brand-200/80">
              Guiding You Home, Building Your Future
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => nav(l.id)}
              className={`relative rounded-lg px-3.5 py-2 text-[13.5px] font-semibold tracking-wide transition-colors duration-200 cursor-pointer ${
                page === l.id
                  ? "text-brand-300"
                  : "text-slate-200 hover:bg-white/5 hover:text-white"
              }`}
            >
              {l.label}
              <span
                className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-300 transition-all duration-300 ${
                  page === l.id ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
              />
            </button>
          ))}
          <a
            href="tel:+639216030693"
            className="ml-2 flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium text-slate-300 transition hover:text-white"
          >
            <i className="fa-solid fa-phone text-xs text-brand-300" />
            <span>+63 921 603 0693</span>
          </a>
          <button
            onClick={() => nav("contact")}
            className="btn btn-primary ml-1 !px-4 !py-2 text-[13px] active:scale-95"
          >
            <i className="fa-regular fa-paper-plane" />
            Send an Inquiry
          </button>
        </nav>

        <button
          className="grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-xl border border-white/15 bg-white/10 text-slate-100 transition hover:bg-white/15 active:scale-90 cursor-pointer pointer-events-auto lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"} text-base`} />
        </button>
      </div>

      {/* Mobile menu backdrop dismiss */}
      {open && (
        <div
          className="fixed inset-0 -z-10 bg-ink-950/75 backdrop-blur-md lg:hidden pointer-events-auto transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu */}
      <div
        className={`mx-auto max-w-7xl overflow-hidden transition-all duration-300 lg:hidden ${
          open
            ? "mt-2.5 max-h-[460px] opacity-100 pointer-events-auto visible"
            : "max-h-0 opacity-0 pointer-events-none invisible"
        }`}
      >
        <div className="glass-panel-deep grid gap-1.5 rounded-2xl p-3 shadow-2xl border border-brand-400/20">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => nav(l.id)}
              className={`min-h-[48px] rounded-xl px-4 py-3 text-left text-[14.5px] font-bold transition flex items-center cursor-pointer active:scale-[0.98] ${
                page === l.id
                  ? "bg-brand-600/35 text-brand-200 border border-brand-400/30"
                  : "text-slate-200 hover:bg-white/5 active:bg-white/10"
              }`}
            >
              <i className="fa-solid fa-compass mr-3 text-brand-300/80" />
              {l.label}
            </button>
          ))}
          <a
            href="tel:+639216030693"
            className="min-h-[48px] flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-slate-200 transition hover:bg-white/5 active:bg-white/10 active:scale-[0.98]"
          >
            <i className="fa-solid fa-phone text-xs text-brand-300" />
            Call +63 921 603 0693
          </a>
          <button
            onClick={() => nav("contact")}
            className="btn btn-primary min-h-[48px] mt-1 justify-center text-sm font-bold active:scale-[0.98]"
          >
            <i className="fa-regular fa-paper-plane" />
            Send an Inquiry
          </button>
        </div>
      </div>
    </header>
  );
}
