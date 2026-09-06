import { useEffect, useState } from "react";
import { Page } from "../data";
import { Logo } from "../ui";
import { CONFIG } from "../config";

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
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = (p: Page) => {
    setOpen(false);
    go(p);
  };

  const openOwnerPortal = () => {
    setOpen(false);
    window.location.hash = CONFIG.ADMIN_ROUTE_HASH;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080f22]/90 backdrop-blur-[36px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8),0_0_32px_0_rgba(37,99,235,0.2)] border-b border-[#38bdf8]/30"
          : "bg-[#080f22]/80 backdrop-blur-[32px] shadow-[0_12px_32px_rgba(0,0,0,0.4)] border-b border-surface-container-high/40"
      }`}
    >
      <div className="h-20 max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop flex items-center justify-between gap-space-md">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-space-sm shrink-0">
          <button
            onClick={() => nav("home")}
            className="flex items-center gap-space-sm group text-left cursor-pointer active:scale-95 transition-transform"
            aria-label="Dream Home Navigators — Home"
          >
            <span className="transition-transform duration-500 group-hover:rotate-12 shrink-0">
              <Logo size={36} />
            </span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                Dream Home Navigators
              </span>
              <span className="font-label-overline text-label-overline text-tertiary tracking-wider uppercase">
                Guiding You Home, Building Your Future
              </span>
            </div>
          </button>
        </div>

        {/* Center pill navigation */}
        <nav
          className="hidden xl:flex items-center gap-space-xs bg-[#050d23]/80 backdrop-blur-xl px-space-sm py-space-xs rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-[rgba(59,130,246,0.25)]"
        >
          {LINKS.map((l) => {
            const isActive = page === l.id;
            return (
              <button
                key={l.id}
                onClick={() => nav(l.id)}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "transition-all bg-primary-container/25 text-[#60a5fa] border border-[#3b82f6] shadow-[0_0_14px_rgba(59,130,246,0.3)] font-label-lg rounded-full px-space-sm py-space-xxs flex items-center gap-1.5 cursor-pointer"
                    : "px-space-sm py-space-xxs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:text-white hover:bg-surface-container transition-all cursor-pointer"
                }
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />}
                <span>{l.label}</span>
              </button>
            );
          })}
          <button
            onClick={openOwnerPortal}
            className="px-space-sm py-space-xxs rounded-full font-label-lg text-label-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-all cursor-pointer"
            title="Open Console"
          >
            Owner Portal
          </button>
        </nav>

        {/* Right CTA cluster */}
        <div className="flex items-center gap-space-md shrink-0">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-label-overline text-label-overline text-on-surface-variant">
              Direct Line
            </span>
            <a
              className="font-label-md text-label-md text-secondary hover:text-primary transition-colors"
              href="tel:+639216030693"
            >
              +63 921 603 0693
            </a>
          </div>

          <button
            onClick={() => nav("contact")}
            className="hidden sm:inline-flex items-center gap-space-xs px-space-md py-space-xs bg-primary-container text-on-primary-container rounded-full font-label-lg text-label-lg hover:bg-inverse-primary hover:text-on-primary shadow-[0_0_20px_rgba(37,99,235,0.35)] transition-all cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span>Send an Inquiry</span>
          </button>

          <button
            onClick={openOwnerPortal}
            className="w-8 h-8 rounded-full bg-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Owner Portal"
            aria-label="Owner Portal"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </button>

          {/* Mobile hamburger button */}
          <button
            className="grid h-10 w-10 min-h-[40px] min-w-[40px] place-items-center rounded-xl border border-surface-container-high bg-surface-container/80 text-on-surface transition hover:bg-surface-container-high active:scale-90 cursor-pointer xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="material-symbols-outlined text-[20px]">
              {open ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-20 -z-10 bg-surface-dim/80 backdrop-blur-md xl:hidden transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      {open && (
        <div className="max-w-max-width mx-auto px-gutter-mobile py-space-sm xl:hidden animate-card-in">
          <div className="bg-surface-container/95 border border-surface-container-high backdrop-blur-2xl rounded-2xl p-space-md shadow-2xl flex flex-col gap-space-xs">
            {LINKS.map((l) => {
              const isActive = page === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => nav(l.id)}
                  className={`min-h-[46px] rounded-xl px-space-md py-space-xs text-left font-label-lg text-label-lg transition flex items-center justify-between cursor-pointer active:scale-[0.98] ${
                    isActive
                      ? "bg-primary-container text-on-primary-container font-bold"
                      : "text-on-surface hover:bg-surface-container-high"
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              );
            })}

            <button
              onClick={openOwnerPortal}
              className="min-h-[46px] rounded-xl px-space-md py-space-xs text-left font-label-lg text-label-lg text-tertiary hover:bg-surface-container-high transition flex items-center justify-between cursor-pointer"
            >
              <span>Owner Portal</span>
              <span className="material-symbols-outlined text-[18px]">
                admin_panel_settings
              </span>
            </button>

            <div className="pt-space-xs border-t border-surface-container-high/60 flex flex-col gap-space-xs">
              <a
                href="tel:+639216030693"
                className="min-h-[44px] flex items-center justify-center gap-space-xs rounded-full bg-surface-container-high/80 text-secondary font-label-md text-label-md hover:bg-surface-bright transition"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>Call +63 921 603 0693</span>
              </a>
              <button
                onClick={() => nav("contact")}
                className="min-h-[44px] flex items-center justify-center gap-space-xs rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-md hover:bg-inverse-primary hover:text-on-primary transition"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span>Send an Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

