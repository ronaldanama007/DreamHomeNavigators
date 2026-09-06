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
        className="glass-card-interactive group flex h-full flex-col overflow-hidden rounded-xl animate-card-in select-none"
        style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      >
        {/* High-Resolution Hero Image with dark gradient baseline overlay */}
        <div className="relative h-60 overflow-hidden bg-surface-container-lowest">
          <img
            src={currentImg}
            alt={`${p.name} - Photo ${activeIdx + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none cursor-pointer"
            onClick={() => openLightbox(false)}
          />
          {/* Baseline gradient overlay: linear-gradient(to top, rgba(3, 7, 18, 0.9) 0%, transparent 60%) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712]/95 via-[#030712]/40 to-transparent" />

          {/* Floating Top-Left Luxury Badges */}
          <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-white shadow-md backdrop-blur-md ${
                p.badge === "Featured"
                  ? "bg-primary-container text-white border border-primary/30"
                  : p.badge === "RFO"
                  ? "bg-emerald-600/90 text-white border border-emerald-400/30"
                  : "bg-surface-container-high/90 text-on-surface border border-outline-variant/40"
              }`}
            >
              {p.badge}
            </span>
          </div>

          {/* Floating Top-Right Location Tag */}
          <span className="glass-chip absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[14px]">location_on</span>
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
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center gap-2 rounded-full bg-primary-container/90 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-inverse-primary cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
              Watch Video Tour
            </button>
          )}

          {/* Photo Switcher on Card */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full bg-[#050d23]/80 px-2.5 py-1 text-xs font-semibold text-white shadow-md backdrop-blur-md border border-surface-container-high/60">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  setShowVideo(false);
                }}
                className="px-1 text-on-surface-variant transition hover:text-secondary cursor-pointer"
                aria-label="Previous image"
              >
                <i className="fa-solid fa-chevron-left text-[10px]" />
              </button>
              <span className="px-1 text-[11px] font-mono text-on-surface">
                {activeIdx + 1}/{images.length}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  setShowVideo(false);
                }}
                className="px-1 text-on-surface-variant transition hover:text-secondary cursor-pointer"
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
                className="ml-1 border-l border-white/20 pl-1.5 text-secondary transition hover:text-white cursor-pointer"
                title="View photo fullscreen"
              >
                <i className="fa-solid fa-expand text-[11px]" />
              </button>
            </div>
          )}

          <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
            <span className="glass-chip px-2.5 py-1 text-[11px] font-medium text-on-surface">
              {p.type}
            </span>
            <span className="text-xs font-semibold text-on-surface-variant drop-shadow">
              {p.area}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between gap-4">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-semibold leading-snug text-white transition-colors group-hover:text-primary">
              {p.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
              {p.tagline}
            </p>

            {/* Specialized Component: Architectural Spec Bar */}
            <div className="mt-4 architectural-spec-bar flex-wrap">
              {p.id === "ongpin-tower" ? (
                <>
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">apartment</span>
                    <span className="font-semibold">57</span>
                    <span className="text-on-surface-variant text-[11px]">Storeys</span>
                  </div>
                  <div className="architectural-spec-divider" />
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">bed</span>
                    <span className="font-semibold">2–5</span>
                    <span className="text-on-surface-variant text-[11px]">Beds</span>
                  </div>
                  <div className="architectural-spec-divider" />
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">square_foot</span>
                    <span className="font-semibold">99–480</span>
                    <span className="text-on-surface-variant text-[11px]">sqm</span>
                  </div>
                </>
              ) : p.id === "pine-deluxe" ? (
                <>
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">bed</span>
                    <span className="font-semibold">4</span>
                    <span className="text-on-surface-variant text-[11px]">Beds</span>
                  </div>
                  <div className="architectural-spec-divider" />
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">bathtub</span>
                    <span className="font-semibold">3</span>
                    <span className="text-on-surface-variant text-[11px]">Baths</span>
                  </div>
                  <div className="architectural-spec-divider" />
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">directions_car</span>
                    <span className="font-semibold">2</span>
                    <span className="text-on-surface-variant text-[11px]">Cars</span>
                  </div>
                  <div className="architectural-spec-divider" />
                  <div className="architectural-spec-item text-white">
                    <span className="material-symbols-outlined text-secondary text-[16px]">square_foot</span>
                    <span className="font-semibold">~90</span>
                    <span className="text-on-surface-variant text-[11px]">sqm</span>
                  </div>
                </>
              ) : (
                <>
                  {p.beds > 0 && (
                    <div className="architectural-spec-item text-white">
                      <span className="material-symbols-outlined text-secondary text-[16px]">bed</span>
                      <span className="font-semibold">{p.beds}</span>
                      <span className="text-on-surface-variant text-[11px]">Beds</span>
                    </div>
                  )}
                  {p.baths > 0 && (
                    <>
                      <div className="architectural-spec-divider" />
                      <div className="architectural-spec-item text-white">
                        <span className="material-symbols-outlined text-secondary text-[16px]">bathtub</span>
                        <span className="font-semibold">{p.baths}</span>
                        <span className="text-on-surface-variant text-[11px]">Baths</span>
                      </div>
                    </>
                  )}
                  {p.sqm > 0 && (
                    <>
                      <div className="architectural-spec-divider" />
                      <div className="architectural-spec-item text-white">
                        <span className="material-symbols-outlined text-secondary text-[16px]">square_foot</span>
                        <span className="font-semibold">{p.sqm}</span>
                        <span className="text-on-surface-variant text-[11px]">sqm</span>
                      </div>
                    </>
                  )}
                  {p.parking > 0 && (
                    <>
                      <div className="architectural-spec-divider" />
                      <div className="architectural-spec-item text-white">
                        <span className="material-symbols-outlined text-secondary text-[16px]">directions_car</span>
                        <span className="font-semibold">{p.parking}</span>
                        <span className="text-on-surface-variant text-[11px]">Car</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Highlights */}
            {p.highlights && p.highlights.length > 0 && (
              <ul className="mt-3.5 space-y-1.5 border-b border-surface-container-high/60 pb-3.5 font-body-sm text-body-sm text-on-surface-variant">
                {p.highlights.slice(0, 2).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span className="line-clamp-1">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price & Primary CTA */}
          <div className="mt-auto flex items-end justify-between pt-2 gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-label-overline text-label-overline uppercase tracking-wider text-outline truncate">
                {p.priceLabel || "Valuation"}
              </p>
              <p className="font-price-xl text-[24px] sm:text-[28px] font-extrabold tracking-tight text-[#38bdf8] drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
                {fmtPrice(p.price)}
              </p>
              {p.lotNote && (
                <p className="mt-0.5 font-body-sm text-[12px] font-medium text-on-surface-variant truncate">
                  {p.lotNote}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {p.videoId && (
                <button
                  type="button"
                  onClick={() => openLightbox(true)}
                  className="btn btn-ghost !px-3 !py-2 text-xs"
                  title="Watch Video Tour"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">play_circle</span>
                  <span className="hidden xs:inline sm:inline">Tour</span>
                </button>
              )}
              {images.length > 1 && !p.videoId && (
                <button
                  type="button"
                  onClick={() => openLightbox(false)}
                  className="btn btn-ghost !px-3 !py-2 text-xs"
                  title="View photo gallery"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">photo_library</span>
                  <span className="hidden xs:inline sm:inline">({images.length})</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onInquire(p.name)}
                className="btn btn-primary !px-4 !py-2 text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)]"
              >
                <span>Inquire</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
