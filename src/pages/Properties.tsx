import { LOCATIONS, Page, PROPERTIES } from "../data";
import { Reveal } from "../ui";
import PropertyCard from "../components/PropertyCard";

interface Props {
  filter: string;
  onFilter: (loc: string) => void;
  inquire: (name: string) => void;
  go: (p: Page) => void;
}

export default function Properties({ filter, onFilter, inquire, go }: Props) {
  const filtered =
    filter === "All" ? PROPERTIES : PROPERTIES.filter((p) => p.location === filter);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-32 sm:px-8 sm:pt-36">
        <Reveal>
          <span className="kicker">Listings & inventory</span>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display max-w-2xl text-4xl font-semibold leading-[1.08] text-slate-50 sm:text-5xl xl:text-6xl">
              Properties across <span className="text-brand-300">five territories</span>
            </h1>
            <p className="max-w-sm text-[15px] leading-relaxed text-slate-300/90">
              Verified units with clean documentation. Filter by location, then hit{" "}
              <strong className="text-slate-100">"Inquire About This Unit"</strong> — we pre-fill
              everything for you.
            </p>
          </div>
        </Reveal>

        {/* Filter pills */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-wrap items-center gap-2.5">
            <span className="mr-1 hidden items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 sm:inline-flex">
              <i className="fa-solid fa-filter text-brand-400" />
              Filter
            </span>
            {["All", ...LOCATIONS].map((loc) => {
              const active = filter === loc;
              return (
                <button
                  key={loc}
                  onClick={() => onFilter(loc)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-[13px] font-bold transition-all duration-250 sm:px-5 ${
                    active
                      ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-[0_8px_24px_-6px_rgba(37,99,235,0.7)] scale-[1.03]"
                      : "glass-chip text-slate-200 hover:-translate-y-0.5 hover:border-brand-300/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {loc !== "All" && (
                    <i className={`fa-solid fa-location-dot text-[11px] ${active ? "text-brand-200" : "text-brand-400"}`} />
                  )}
                  {loc}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-extrabold ${
                      active ? "bg-white/25 text-white" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {loc === "All" ? PROPERTIES.length : PROPERTIES.filter((p) => p.location === loc).length}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Result meta */}
        <div className="mt-8 flex items-center gap-3 text-[13px] font-semibold text-slate-400">
          <span className="h-px w-8 bg-brand-500/60" />
          Showing <strong className="text-brand-300">{filtered.length}</strong> of {PROPERTIES.length} units
          {filter !== "All" && (
            <>
              in <strong className="text-slate-100">{filter}</strong>
            </>
          )}
        </div>

        {/* Grid */}
        <div className="mt-7 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, i) => (
            <PropertyCard key={`${filter}-${p.id}`} p={p} onInquire={inquire} index={i} />
          ))}
        </div>

        {/* Sourcing band */}
        <Reveal>
          <div className="glass-panel-deep mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl px-7 py-9 md:flex-row">
            <div>
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Didn't find <em className="italic text-brass-300">the one?</em>
              </h2>
              <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-slate-300">
                Tell us your budget and target area — our property matching desk sources
                off-market and pre-launch units within 48 hours, at no cost to you.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={() => go("contact")} className="btn btn-primary">
                <i className="fa-solid fa-magnifying-glass-location" />
                Request Property Matching
              </button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
