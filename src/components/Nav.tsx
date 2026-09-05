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
    <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5">
      <div
        className={`mx-auto mt-3 flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5 transition-all duration-300 sm:mt-4 sm:px-5 ${
          scrolled
            ? "glass-panel-deep !rounded-2xl shadow-2xl"
            : "border border-transparent"
        }`}
      >
        <button
          onClick={() => nav("home")}
          className="group flex items-center gap-3 text-left"
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
              className={`relative rounded-lg px-3.5 py-2 text-[13.5px] font-semibold tracking-wide transition-colors duration-200 ${
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
            className="btn btn-primary ml-1 !px-4 !py-2 text-[13px]"
          >
            <i className="fa-regular fa-paper-plane" />
            Send an Inquiry
          </button>
        </nav>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 text-slate-100 transition hover:bg-white/10 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`mx-auto max-w-7xl overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "mt-2 max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-panel-deep grid gap-1 rounded-2xl p-3">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => nav(l.id)}
              className={`rounded-lg px-4 py-3 text-left text-sm font-semibold transition ${
                page === l.id
                  ? "bg-brand-600/30 text-brand-200"
                  : "text-slate-200 hover:bg-white/5"
              }`}
            >
              <i className="fa-solid fa-compass mr-3 text-brand-300/70" />
              {l.label}
            </button>
          ))}
          <a
            href="tel:+639216030693"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
          >
            <i className="fa-solid fa-phone text-xs text-brand-300" />
            Call +63 921 603 0693
          </a>
          <button onClick={() => nav("contact")} className="btn btn-primary mt-1 justify-center">
            <i className="fa-regular fa-paper-plane" />
            Send an Inquiry
          </button>
        </div>
      </div>
    </header>
  );
}
