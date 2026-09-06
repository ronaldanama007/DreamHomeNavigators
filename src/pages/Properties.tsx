import { LOCATIONS, Page } from "../data";
import { useStore } from "../store";
import { Reveal } from "../ui";
import PropertyCard from "../components/PropertyCard";

interface Props {
  filter: string;
  onFilter: (loc: string) => void;
  inquire: (name: string) => void;
  go: (p: Page) => void;
}

export default function Properties({ filter, onFilter, inquire, go }: Props) {
  const { properties } = useStore();
  const filtered =
    filter === "All" ? properties : properties.filter((p) => p.location === filter);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-8 sm:pt-36">
        <Reveal>
          <span className="kicker">Property listings</span>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display max-w-2xl text-3xl font-semibold leading-tight text-slate-50 sm:text-5xl xl:text-6xl">
              Explore <span className="text-brand-300">selected properties</span>
            </h1>
            <p className="max-w-md text-[14.5px] leading-relaxed text-slate-300/90">
              Browse a selection of current property materials and contact Dream Home Navigators for availability, pricing and viewing details.
            </p>
          </div>
        </Reveal>

        {/* Filter pills */}
        <Reveal delay={120}>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="mr-1 hidden items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-outline sm:inline-flex">
              <span className="material-symbols-outlined text-[16px] text-secondary">filter_alt</span>
              Filter
            </span>
            {["All", ...LOCATIONS].map((loc) => {
              const active = filter === loc;
              return (
                <button
                  key={loc}
                  onClick={() => onFilter(loc)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 sm:px-5 sm:py-2.5 min-h-[44px] cursor-pointer touch-manipulation active:scale-95 ${
                    active
                      ? "glass-chip-selected scale-[1.03]"
                      : "glass-chip text-on-surface-variant hover:text-white hover:border-primary/40"
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />}
                  {loc !== "All" && !active && (
                    <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                  )}
                  {loc}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
                      active ? "bg-primary-container text-white" : "bg-white/10 text-on-surface-variant"
                    }`}
                  >
                    {loc === "All" ? properties.length : properties.filter((p) => p.location === loc).length}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Result meta */}
        <div className="mt-6 sm:mt-8 flex items-center gap-3 text-[13px] font-semibold text-on-surface-variant">
          <span className="h-px w-8 bg-secondary/60" />
          Showing <strong className="text-secondary">{filtered.length}</strong> of {properties.length} units
          {filter !== "All" && (
            <>
              in <strong className="text-white">{filter}</strong>
            </>
          )}
        </div>

        {/* Grid or Concierge Sourcing Card */}
        {filtered.length > 0 ? (
          <div className="mt-7 grid gap-6 sm:gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => {
              const isLast = i === filtered.length - 1;
              const isSingleIn3Col = filtered.length % 3 === 1 && isLast;
              const isSingleIn2Col = filtered.length % 2 === 1 && isLast;

              return (
                <div
                  key={`${filter}-${p.id}`}
                  className={`flex flex-col h-full ${
                    isSingleIn2Col ? "sm:col-span-2 sm:max-w-md sm:mx-auto w-full" : ""
                  } ${
                    isSingleIn3Col
                      ? "xl:col-span-1 xl:col-start-2 xl:max-w-none xl:mx-0"
                      : isSingleIn2Col
                      ? "xl:col-span-1 xl:col-start-auto"
                      : ""
                  }`}
                >
                  <PropertyCard p={p} onInquire={inquire} index={i} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel mt-7 flex flex-col items-center rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto border border-brand-400/25">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/20 text-2xl text-brand-300">
              <i className="fa-solid fa-compass" />
            </span>
            <span className="mt-4 kicker justify-center">On-Demand Sourcing</span>
            <h3 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Properties in {filter} are Curated on Request
            </h3>
            <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-slate-300">
              We actively source, inspect, and verify residential and investment properties across {filter}. Tell us your budget, preferred area, and must-haves — our licensed team will present verified matching options within 24–48 hours.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-brand-300" /> Title verification</span>
              <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-brand-300" /> Developer vetting</span>
              <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-brand-300" /> Site viewing coordination</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3.5 justify-center">
              <button onClick={() => inquire(`${filter} Property Search`)} className="btn btn-primary">
                <i className="fa-regular fa-paper-plane" />
                Request {filter} Property Match
              </button>
              <a href="https://m.me/dreamhomenavigators01" target="_blank" rel="noreferrer" className="btn btn-ghost">
                <i className="fa-brands fa-facebook-messenger text-brand-300" />
                Ask on Messenger
              </a>
            </div>
          </div>
        )}

        {/* Sourcing / CTA band */}
        <Reveal>
          <div className="glass-panel-deep mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl px-7 py-9 md:flex-row">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Looking for a property in another location?
              </h2>
              <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-slate-300">
                Tell us the area and type of property you are looking for and the team can discuss available options with you.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={() => go("contact")} className="btn btn-primary">
                <i className="fa-regular fa-paper-plane" />
                Send an Inquiry
              </button>
              <a
                href="https://m.me/dreamhomenavigators01"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                <i className="fa-brands fa-facebook-messenger text-brand-300" />
                Message on Messenger
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
