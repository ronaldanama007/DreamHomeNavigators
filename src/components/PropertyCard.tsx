import { useState, useEffect } from "react";
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
  const [showVideo, setShowVideo] = useState(false);

  const currentImg = images[activeIdx] || p.img;

  const openLightbox = (withVideo = false) => {
    setShowVideo(withVideo && Boolean(p.videoId));
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, images.length]);

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
            onClick={() => openLightbox(false)}
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

          {/* Video Tour Play Icon if video exists */}
          {p.videoId && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLightbox(true);
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 rounded-full bg-brand-600/90 px-4 py-2 text-xs font-extrabold text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-brand-500"
            >
              <i className="fa-solid fa-play text-xs text-white" />
              Watch Video
            </button>
          )}

          {/* Photo Switcher on Card */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-ink-950/80 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-sm">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  setShowVideo(false);
                }}
                className="px-1 text-slate-300 transition hover:text-brand-300"
                aria-label="Previous image"
              >
                <i className="fa-solid fa-chevron-left text-[10px]" />
              </button>
              <span className="px-1 text-[11px] font-mono text-slate-200">
                {activeIdx + 1}/{images.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  setShowVideo(false);
                }}
                className="px-1 text-slate-300 transition hover:text-brand-300"
                aria-label="Next image"
              >
                <i className="fa-solid fa-chevron-right text-[10px]" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(false);
                }}
                className="ml-1 border-l border-white/20 pl-1.5 text-brand-300 transition hover:text-white"
                title="View photo fullscreen"
              >
                <i className="fa-solid fa-expand text-[11px]" />
              </button>
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
            {p.id === "ongpin-tower" ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-building text-brand-600" /> 57 Storeys
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bed text-brand-600" /> 2–5 Bedrooms
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-ruler-combined text-brand-600" /> 99–480 sqm
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-seedling text-brand-600" /> Sustainable Design
                </span>
              </>
            ) : p.id === "pine-deluxe" ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bed text-brand-600" /> 4 Bedrooms
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bath text-brand-600" /> 3 T&amp;B
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-car text-brand-600" /> 2 Carports
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-ruler-combined text-brand-600" /> Approx. 90 sqm
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-door-open text-brand-600" /> Balcony &amp; High Ceiling
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
            {p.videoId && (
              <button
                type="button"
                onClick={() => openLightbox(true)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-500 bg-brand-50 text-brand-600 transition hover:bg-brand-600 hover:text-white"
                title="Watch Video Tour"
              >
                <i className="fa-solid fa-play text-xs" />
              </button>
            )}
            {images.length > 1 && !p.videoId && (
              <button
                type="button"
                onClick={() => openLightbox(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-600"
                title="View photo gallery"
              >
                <i className="fa-solid fa-images" />
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Lightbox / Video Modal (True Fullscreen) */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-black/95 text-white backdrop-blur-xl animate-card-in select-none"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-ink-950/80 px-4 py-3 sm:px-8 sm:py-4">
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-base sm:text-xl font-semibold text-white">
                    {p.name}
                  </h4>
                  <span className="rounded-full bg-brand-600/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {p.badge}
                  </span>
                </div>
                <p className="text-xs text-brand-300">
                  <i className="fa-solid fa-location-dot mr-1" />
                  {p.area} {p.developer ? `· ${p.developer}` : ""}
                  {!showVideo && images.length > 1 && (
                    <span className="ml-2 font-mono text-slate-400">
                      (Photo {activeIdx + 1} of {images.length})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Video vs Photo toggle if video exists */}
            <div className="flex items-center gap-3">
              {p.videoId && (
                <div className="flex items-center rounded-xl bg-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      showVideo ? "bg-brand-600 text-white shadow" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <i className="fa-solid fa-film" />
                    <span className="hidden sm:inline">Video Tour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVideo(false)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      !showVideo ? "bg-brand-600 text-white shadow" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <i className="fa-solid fa-images" />
                    <span className="hidden sm:inline">Photos</span> ({images.length})
                  </button>
                </div>
              )}

              {/* Close Button: Only exit on X or Esc */}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-white transition hover:bg-white/20 hover:border-white/40 active:scale-95 shadow-md"
                aria-label="Close fullscreen (Esc)"
                title="Close (Esc)"
              >
                <i className="fa-solid fa-xmark text-base sm:text-lg" />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Close (Esc)</span>
              </button>
            </div>
          </div>

          {/* Media Content: True Fullscreen stage */}
          <div className="relative flex flex-1 w-full items-center justify-center min-h-0 overflow-hidden p-2 sm:p-6">
            {p.videoId && showVideo ? (
              <div className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/15">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${p.videoId}?autoplay=1&rel=0`}
                  title={`${p.name} Video Tour`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <div className="relative flex h-full w-full items-center justify-center">
                <img
                  src={currentImg}
                  alt={`${p.name} - Photo ${activeIdx + 1}`}
                  className="h-full w-full max-h-[82vh] object-contain rounded-xl shadow-2xl transition-all duration-200 select-none"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-full bg-black/65 text-white border border-white/20 backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 shadow-2xl active:scale-95"
                      aria-label="Previous photo"
                      title="Previous (Left Arrow)"
                    >
                      <i className="fa-solid fa-chevron-left text-lg sm:text-2xl" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-full bg-black/65 text-white border border-white/20 backdrop-blur-md transition-all hover:bg-black/90 hover:scale-110 shadow-2xl active:scale-95"
                      aria-label="Next photo"
                      title="Next (Right Arrow)"
                    >
                      <i className="fa-solid fa-chevron-right text-lg sm:text-2xl" />
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar: Thumbnails & Inquire CTA (NO external website link) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-ink-950/80 px-4 py-3 sm:px-8 sm:py-3.5">
            {images.length > 1 && !showVideo ? (
              <div className="flex items-center gap-2 overflow-x-auto max-w-[65vw] sm:max-w-[75vw] py-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowVideo(false);
                      setActiveIdx(i);
                    }}
                    className={`overflow-hidden rounded-lg border-2 shrink-0 transition-all ${
                      activeIdx === i
                        ? "border-brand-400 scale-105 shadow-md shadow-brand-500/50"
                        : "border-transparent opacity-50 hover:opacity-100 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${i + 1}`}
                      className="h-10 w-14 object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                Dream Home Navigators · Verified Property Inclusions
              </div>
            )}

            <button
              onClick={() => {
                setLightboxOpen(false);
                onInquire(p.name);
              }}
              className="btn btn-primary !py-2.5 !px-6 text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/50 ml-auto"
            >
              Inquire About This Unit
              <i className="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
