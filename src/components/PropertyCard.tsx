import { Property, fmtPrice } from "../data";

export default function PropertyCard({
  p,
  onInquire,
  index = 0,
}: {
  p: Property;
  onInquire: (name: string) => void;
  index?: number;
}) {
  return (
    <article
      className="glass-panel-light group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transition-none animate-card-in"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-brand-950/10" />
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg ${
            p.badge === "Featured"
              ? "bg-brass-400 text-brand-950"
              : p.badge === "RFO"
              ? "bg-emerald-500"
              : "bg-brand-600"
          }`}
        >
          {p.badge}
        </span>
        <span className="glass-chip absolute right-3 top-3 inline-flex items-center gap-1.5 !bg-ink-950/55 px-2.5 py-1 text-[11px] font-bold text-white">
          <i className="fa-solid fa-location-dot text-brand-300" />
          {p.location}
        </span>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <p className="text-xs font-semibold text-brand-100">{p.area}</p>
          <span className="glass-chip !bg-ink-950/55 px-2.5 py-1 text-[11px] font-bold text-white">
            {p.type}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[19px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
          {p.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-slate-600">
          {p.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-slate-300/70 py-3 text-[12.5px] font-semibold text-slate-700">
          {p.beds > 0 ? (
            <>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-bed text-brand-600" /> {p.beds} Bed{p.beds > 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="fa-solid fa-bath text-brand-600" /> {p.baths} Bath{p.baths > 1 ? "s" : ""}
              </span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px]">
              <i className="fa-solid fa-house text-brand-600" /> {p.lotNote ?? "House / Residential"}
            </span>
          )}
          {p.sqm > 0 && p.beds > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <i className="fa-solid fa-ruler-combined text-brand-600" /> {p.sqm} sqm
            </span>
          )}
          {p.parking > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <i className="fa-solid fa-car text-brand-600" /> Carport
            </span>
          )}
        </div>

        <div className="mt-4">
          {p.price < 100_000 && (
            <span className="block text-[11px] font-semibold text-slate-500">
              {p.id === "jaro-house" ? "Monthly amortization" : "Price starts at"}
            </span>
          )}
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[22px] font-extrabold tracking-tight text-brand-800">
              {fmtPrice(p.price)}
            </p>
          </div>
          {p.priceNote && (
            <p className="mt-0.5 text-[11px] italic text-slate-500">
              {p.priceNote}
            </p>
          )}
        </div>

        <button
          onClick={() => onInquire(p.name)}
          className="btn btn-primary mt-4 w-full justify-center !py-2.5 text-[13.5px]"
        >
          <i className="fa-regular fa-paper-plane" />
          Ask About This Property
        </button>
      </div>
    </article>
  );
}
