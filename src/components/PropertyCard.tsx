import { useState } from "react";
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
  const images = p.gallery && p.gallery.length > 0 ? p.gallery : [p.img];
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImg = images[activeIdx] || p.img;

  return (
    <>
      <article
        className="glass-panel-light group flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transition-none animate-card-in"
        style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      >
        <div className="relative h-56 overflow-hidden bg-ink-950/20">
          <img
            src={currentImg}
            alt={`${p.name} - Photo ${activeIdx + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/75 via-transparent to-brand-950/15" />

          {/* Badges */}
          <span
            className={`absolute left-3.5 top-3.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md ${
              p.badge === "Featured"
                ? "bg-brass-400 text-brand-950"
                : p.badge === "RFO"
                ? "bg-emerald-600"
                : "bg-brand-600"
            }`}
          >
            {p.badge}
          </span>

          <span className="glass-chip absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 !bg-ink-950/65 px-2.5 py-1 text-[11px] font-bold text-white shadow">
            <i className="fa-solid fa-location-dot text-brand-300" />
            {p.location}
          </span>

          {/* Photo Switcher Dots if multi-photo */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-ink-950/70 px-2.5 py-1 backdrop-blur-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="mr-1 text-[11px] font-bold text-brand-200 transition hover:text-white"
                title="View photo fullscreen"
              >
                <i className="fa-solid fa-expand" />
              </button>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(i);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    activeIdx === i
                      ? "w-4 bg-brand-400"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
            <span className="glass-chip !bg-ink-950/65 px-2.5 py-1 text-[11px] font-bold text-white">
              {p.type}
            </span>
            <span className="text-xs font-semibold text-brand-100 drop-shadow">
              {p.area}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-display text-[19px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
            {p.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-600">
            {p.tagline}
          </p>

          {/* Specs */}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-slate-200/90 py-3 text-[12.5px] font-semibold text-slate-700">
            {p.id === "pine-deluxe" ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-layer-group text-brand-600" /> Two-storey
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-car text-brand-600" /> Carport
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bed text-brand-600" /> Bedrooms on request
                </span>
              </>
            ) : p.id === "jaro-house" ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bed text-brand-600" /> 3 Bedrooms
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bath text-brand-600" /> 2 Toilet &amp; Bath
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-car text-brand-600" /> Carport
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-door-open text-brand-600" /> Balcony
                </span>
              </>
            ) : (
              <>
                {p.beds > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-bed text-brand-600" /> {p.beds} Bed{p.beds > 1 ? "s" : ""}
                  </span>
                )}
                {p.baths > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-bath text-brand-600" /> {p.baths} Bath{p.baths > 1 ? "s" : ""}
                  </span>
                )}
                {p.sqm > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-ruler-combined text-brand-600" /> {p.sqm} sqm
                  </span>
                )}
                {p.parking > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <i className="fa-solid fa-car text-brand-600" /> Carport
                  </span>
                )}
              </>
            )}
          </div>

          {/* Pricing */}
          <div className="mt-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {p.priceLabel || (p.price < 100_000 ? "Price starts at" : "Starting at")}
            </span>
            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <p className="font-display text-[24px] font-bold tracking-tight text-brand-900">
                {fmtPrice(p.price)}
              </p>
            </div>
            {p.priceNote && (
              <p className="mt-1 text-[11.5px] italic text-slate-500">
                {p.priceNote}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2">
            <button
              onClick={() => onInquire(p.name)}
              className="btn btn-primary flex-1 justify-center !py-2.5 text-[13px]"
            >
              <i className="fa-regular fa-paper-plane" />
              Ask About This Property
            </button>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-600"
                title="View photo gallery"
              >
                <i className="fa-solid fa-images" />
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-card-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-ink-950 p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3">
              <div>
                <h4 className="font-display text-lg font-semibold text-white">
                  {p.name}
                </h4>
                <p className="text-xs text-brand-300">
                  {images.length > 1 ? `Photo ${activeIdx + 1} of ${images.length}` : p.area}
                </p>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Close photo preview"
              >
                <i className="fa-solid fa-xmark text-lg" />
              </button>
            </div>

            <div className="relative max-h-[65vh] overflow-auto rounded-xl">
              <img
                src={currentImg}
                alt={p.name}
                className="h-auto max-h-[65vh] w-full rounded-xl object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`overflow-hidden rounded-lg border-2 transition ${
                      activeIdx === i ? "border-brand-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${i + 1}`}
                      className="h-12 w-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-display text-lg font-bold text-brand-300">
                {fmtPrice(p.price)}
              </span>
              <button
                onClick={() => {
                  setLightboxOpen(false);
                  onInquire(p.name);
                }}
                className="btn btn-primary !py-2 !px-4 text-xs"
              >
                Inquire About This Unit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
