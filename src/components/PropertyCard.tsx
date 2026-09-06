import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const filmstripRef = useRef<HTMLDivElement>(null);

  const currentImg = images[activeIdx] || p.img;

  const openLightbox = (withVideo = false) => {
    setShowVideo(withVideo && Boolean(p.videoId));
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
    setLightboxOpen(false);
  };

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsNativeFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsNativeFullscreen(false);
    }
  };

  // Keyboard navigation & body scroll lock (Strict: only exits on Escape or X button)
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else if (e.key === "f" || e.key === "F") {
        toggleNativeFullscreen();
      }
    };

    const handleFsChange = () => {
      setIsNativeFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFsChange);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, images.length]);

  // Smoothly center the active thumbnail in the filmstrip
  useEffect(() => {
    if (!lightboxOpen || !filmstripRef.current) return;
    const activeThumb = filmstripRef.current.children[activeIdx] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIdx, lightboxOpen]);

  // Touch swipe handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        // Swipe left -> next image
        setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      } else {
        // Swipe right -> previous image
        setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
    }
    setTouchStartX(null);
  };

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
            ) : p.id === "samantha-welford" ? (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bed text-brand-600" /> 4 Bedrooms
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-bath text-brand-600" /> 3 T&amp;B
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-car text-brand-600" /> Paved Carport
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-ruler-combined text-brand-600" /> 84 sqm Floor / 120 sqm Lot
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-door-open text-brand-600" /> Balcony &amp; Maid's Rm
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

          {/* Highlights */}
          {p.highlights && p.highlights.length > 0 && (
            <ul className="mt-3.5 space-y-1.5 border-b border-slate-100 pb-3.5 text-xs text-slate-600">
              {p.highlights.slice(0, 3).map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <i className="fa-solid fa-circle-check mt-0.5 text-brand-600 text-[11px]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Price & CTA */}
          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {p.priceLabel || "Price"}
              </p>
              <p className="font-display text-2xl font-bold tracking-tight text-brand-700">
                {fmtPrice(p.price)}
              </p>
              {p.lotNote && (
                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                  {p.lotNote}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {p.videoId && (
                <button
                  type="button"
                  onClick={() => openLightbox(true)}
                  className="btn btn-ghost !px-3 !py-2 text-xs !border-brand-300 text-brand-700 hover:!bg-brand-50"
                  title="Watch Video Tour"
                >
                  <i className="fa-solid fa-play text-brand-600" />
                  <span className="hidden sm:inline">Video</span>
                </button>
              )}
              {images.length > 1 && !p.videoId && (
                <button
                  type="button"
                  onClick={() => openLightbox(false)}
                  className="btn btn-ghost !px-3 !py-2 text-xs !border-slate-300 text-slate-700 hover:!bg-slate-100"
                  title="View photo gallery"
                >
                  <i className="fa-solid fa-images text-brand-600" />
                  <span className="hidden sm:inline">Photos ({images.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onInquire(p.name)}
                className="btn btn-primary !px-4 !py-2 text-xs font-bold"
              >
                Inquire
                <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* ========================================================================= */}
      {/* IMMERSIVE FULL-VIEWPORT CINEMA LIGHTBOX (Exit via 'X' or 'Esc' Only)       */}
      {/* ========================================================================= */}
      {lightboxOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${p.name} Fullscreen Showcase`}
            className="fixed inset-0 z-[999999] flex h-screen w-screen flex-col justify-between bg-black/98 text-white backdrop-blur-2xl select-none"
          >
          {/* Top Bar: Clean, modern luxury real estate navigation */}
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-ink-950/85 px-4 py-3 sm:px-8 sm:py-3.5 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-600/30 border border-brand-400/40 text-brand-300 shadow-sm">
                <i className="fa-solid fa-compass text-base" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-semibold leading-tight text-white sm:text-xl">
                    {p.name}
                  </h3>
                  <span className="rounded-full bg-brand-600/90 px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                    {p.badge}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-300/85">
                  <i className="fa-solid fa-location-dot mr-1 text-brand-400" />
                  {p.area} {p.developer ? `· ${p.developer}` : ""}
                  {!showVideo && images.length > 1 && (
                    <span className="ml-2 font-mono text-xs font-bold text-brand-200">
                      Photo {String(activeIdx + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Mode toggles & Control Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3.5">
              {p.videoId && (
                <div className="flex items-center rounded-full bg-white/10 p-1 border border-white/15">
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                      showVideo ? "bg-brand-600 text-white shadow-md" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <i className="fa-solid fa-film text-[11px]" />
                    <span>Video Tour</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVideo(false)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                      !showVideo ? "bg-brand-600 text-white shadow-md" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <i className="fa-solid fa-images text-[11px]" />
                    <span>Photos ({images.length})</span>
                  </button>
                </div>
              )}

              {/* Native Fullscreen Toggle Button */}
              <button
                type="button"
                onClick={toggleNativeFullscreen}
                className="hidden sm:grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20 hover:border-white/40 active:scale-95"
                title={isNativeFullscreen ? "Exit full screen (F)" : "Enter full screen (F)"}
                aria-label="Toggle full screen"
              >
                <i className={`fa-solid ${isNativeFullscreen ? "fa-compress" : "fa-expand"} text-sm`} />
              </button>

              {/* Close Button: Strictly exits only on click or Esc key */}
              <button
                type="button"
                onClick={closeLightbox}
                className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-white transition-all hover:bg-rose-600 hover:border-rose-500 hover:text-white active:scale-95 shadow-md group"
                aria-label="Close fullscreen (Esc)"
                title="Close (Esc)"
              >
                <i className="fa-solid fa-xmark text-base transition-transform group-hover:rotate-90" />
                <span className="text-xs font-bold uppercase tracking-wider">Close</span>
                <kbd className="hidden md:inline rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-mono uppercase text-white/90">
                  Esc
                </kbd>
              </button>
            </div>
          </header>

          {/* Center Stage: True Full-Bleed Viewport */}
          <main
            className="relative flex flex-1 w-full min-h-0 items-center justify-center overflow-hidden p-2 sm:p-5"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {p.videoId && showVideo ? (
              <div className="relative aspect-video w-full max-w-6xl max-h-[82vh] overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/20">
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
                  alt={`${p.name} - Showcase view ${activeIdx + 1}`}
                  fetchPriority="high"
                  loading="eager"
                  className="h-full w-full max-h-[82vh] object-contain rounded-xl shadow-2xl transition-all duration-300 select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                />

                {/* Floating Left Navigation Chevron */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-2xl active:scale-95"
                    aria-label="Previous photo"
                    title="Previous (Left Arrow)"
                  >
                    <i className="fa-solid fa-chevron-left text-lg sm:text-2xl" />
                  </button>
                )}

                {/* Floating Right Navigation Chevron */}
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 grid h-12 w-12 sm:h-16 sm:w-16 place-items-center rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 shadow-2xl active:scale-95"
                    aria-label="Next photo"
                    title="Next (Right Arrow)"
                  >
                    <i className="fa-solid fa-chevron-right text-lg sm:text-2xl" />
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Bottom Bar: Interactive Filmstrip, Spec Highlight & Inquire CTA */}
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-ink-950/85 px-4 py-2.5 sm:px-8 sm:py-3 backdrop-blur-md">
            {images.length > 1 && !showVideo ? (
              <div
                ref={filmstripRef}
                className="flex items-center gap-2 overflow-x-auto max-w-[65vw] sm:max-w-[75vw] py-1 scrollbar-thin"
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowVideo(false);
                      setActiveIdx(i);
                    }}
                    className={`relative overflow-hidden rounded-lg border-2 shrink-0 transition-all duration-200 ${
                      activeIdx === i
                        ? "border-brand-400 scale-105 ring-2 ring-brand-400/80 shadow-lg shadow-brand-500/50 opacity-100"
                        : "border-transparent opacity-45 hover:opacity-100 hover:border-white/40"
                    }`}
                    aria-label={`Jump to photo ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Thumb ${i + 1}`}
                      className="h-11 w-16 sm:h-12 sm:w-20 object-cover"
                      loading="lazy"
                    />
                    <span className="absolute bottom-0.5 right-1 rounded bg-black/75 px-1 text-[9px] font-mono text-white">
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="inline-flex items-center gap-1.5 text-brand-300">
                  <i className="fa-solid fa-shield-halved" />
                  PRC-Licensed Representation
                </span>
                <span className="hidden sm:inline text-slate-400">
                  Guiding You Home, Building Your Future
                </span>
              </div>
            )}

            {/* Direct Lead Inquire CTA Button (No external website leak) */}
            <button
              type="button"
              onClick={() => {
                closeLightbox();
                onInquire(p.name);
              }}
              className="btn btn-primary !py-2.5 !px-6 text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/50 ml-auto flex items-center gap-2 group"
            >
              <span>Inquire About This Unit</span>
              <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1" />
            </button>
          </footer>
        </div>,
        document.body
      )}
    </>
  );
}
