import { useState } from "react";
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

export default function Rentals({ filter, onFilter, inquire, go }: Props) {
  const { rentalProperties } = useStore();
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>("All");

  const filteredByLoc =
    filter === "All"
      ? rentalProperties
      : rentalProperties.filter((p) => p.location === filter);

  const filtered =
    propertyTypeFilter === "All"
      ? filteredByLoc
      : filteredByLoc.filter((p) =>
          propertyTypeFilter === "Commercial"
            ? p.badge === "Commercial Space" || p.type.toLowerCase().includes("commercial")
            : propertyTypeFilter === "Furnished"
            ? p.badge === "Fully Furnished"
            : propertyTypeFilter === "Daily"
            ? p.badge === "Daily Stay" || (p.priceNote && p.priceNote.toLowerCase().includes("daily"))
            : true
        );

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-8 sm:pt-36">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="kicker">Rental Properties</span>
            <span className="glass-chip px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-300">
              <i className="fa-solid fa-key mr-1.5 text-emerald-400" />
              Verified Vacancies
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-display max-w-2xl text-3xl font-semibold leading-tight text-slate-50 sm:text-5xl xl:text-6xl">
                Curated <span className="text-brand-300">Rental Residences</span> &amp; Suites
              </h1>
              <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-slate-300/90">
                Premium long-term residences, furnished executive condominiums, scenic vacation villas, and commercial spaces across Iloilo, Tagaytay, Cavite, Antipolo, and Binondo.
              </p>
            </div>

            {/* Quick Switch to For Sale */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => go("properties")}
                className="btn btn-ghost !py-2.5 !px-4 text-xs font-bold text-brand-200 hover:text-white"
              >
                <i className="fa-solid fa-house-chimney mr-1.5 text-brand-400" />
                Looking to buy? View Properties For Sale
              </button>
            </div>
          </div>
        </Reveal>

        {/* Territory Filter Pills */}
        <Reveal delay={120}>
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="mr-1 hidden items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400 sm:inline-flex">
              <i className="fa-solid fa-location-dot text-brand-400" />
              Territory
            </span>
            {["All", ...LOCATIONS].map((loc) => {
              const active = filter === loc;
              const count =
                loc === "All"
                  ? rentalProperties.length
                  : rentalProperties.filter((p) => p.location === loc).length;

              return (
                <button
                  key={loc}
                  onClick={() => onFilter(loc)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all duration-250 sm:px-5 sm:py-2.5 sm:text-[13px] min-h-[44px] cursor-pointer touch-manipulation active:scale-95 ${
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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Result Meta & Amenities Quick Tags */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-[13px] font-semibold text-slate-400">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-brand-500/60" />
            Showing <strong className="text-brand-300">{filtered.length}</strong> of {rentalProperties.length} rental units
            {filter !== "All" && (
              <>
                in <strong className="text-slate-100">{filter}</strong>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Lease Types:</span>
            <button
              onClick={() => setPropertyTypeFilter("All")}
              className={`px-3 py-1 rounded-full border text-[11px] transition ${
                propertyTypeFilter === "All"
                  ? "border-brand-400 bg-brand-500/20 text-brand-200 font-bold"
                  : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setPropertyTypeFilter(propertyTypeFilter === "Furnished" ? "All" : "Furnished")}
              className={`px-3 py-1 rounded-full border text-[11px] transition ${
                propertyTypeFilter === "Furnished"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 font-bold"
                  : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              Fully Furnished
            </button>
            <button
              onClick={() => setPropertyTypeFilter(propertyTypeFilter === "Daily" ? "All" : "Daily")}
              className={`px-3 py-1 rounded-full border text-[11px] transition ${
                propertyTypeFilter === "Daily"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 font-bold"
                  : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              Daily Stay
            </button>
            <button
              onClick={() => setPropertyTypeFilter(propertyTypeFilter === "Commercial" ? "All" : "Commercial")}
              className={`px-3 py-1 rounded-full border text-[11px] transition ${
                propertyTypeFilter === "Commercial"
                  ? "border-amber-400 bg-amber-500/20 text-amber-200 font-bold"
                  : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              Commercial Lease
            </button>
          </div>
        </div>

        {/* Listings Grid with Smart Centering for Solitary Last Card */}
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
              <i className="fa-solid fa-key" />
            </span>
            <span className="mt-4 kicker justify-center">On-Demand Lease Sourcing</span>
            <h3 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Rental Units in {filter} are Sourced on Request
            </h3>
            <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-slate-300">
              We actively match qualified tenants with verified landlords across {filter}. Tell us your budget, move-in timeline, and unit specifications — our team will deliver vetted lease options within 24–48 hours.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-brand-300" /> Contract &amp; lease review</span>
              <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-brand-300" /> Landlord vetting</span>
              <span className="inline-flex items-center gap-1.5"><i className="fa-solid fa-circle-check text-brand-300" /> Guided unit walkthrough</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3.5 justify-center">
              <button onClick={() => inquire(`${filter} Rental Search`)} className="btn btn-primary">
                <i className="fa-regular fa-paper-plane" />
                Request {filter} Rental Match
              </button>
              <a href="https://m.me/dreamhomenavigators01" target="_blank" rel="noreferrer" className="btn btn-ghost">
                <i className="fa-brands fa-facebook-messenger text-brand-300" />
                Ask on Messenger
              </a>
            </div>
          </div>
        )}

        {/* Landlord / Tenant Assistance Sourcing CTA Band */}
        <Reveal>
          <div className="glass-panel-deep mt-16 flex flex-col items-center justify-between gap-6 rounded-2xl px-7 py-9 md:flex-row">
            <div>
              <span className="kicker">Property Owners &amp; Landlords</span>
              <h2 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
                Have a property to lease out?
              </h2>
              <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-slate-300">
                List your residential or commercial unit with Dream Home Navigators. We connect your property with vetted executives, expats, and long-term corporate tenants.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <button onClick={() => inquire("Property Listing for Lease")} className="btn btn-primary">
                <i className="fa-solid fa-bullhorn" />
                List Your Property
              </button>
              <a
                href="https://m.me/dreamhomenavigators01"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
              >
                <i className="fa-brands fa-facebook-messenger text-brand-300" />
                Inquire on Messenger
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
