import { ReactNode, useEffect, useRef, useState } from "react";
import { CONFIG } from "./config";

export const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Scroll reveal wrapper ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced()) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- Animated count-up stat ---------- */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1500,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        if (prefersReduced()) {
          setDisplay(value);
          return;
        }
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(value * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ---------- Section heading ---------- */
export function SectionHead({
  kicker,
  title,
  sub,
  align = "left",
  light = false,
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <span className={`kicker ${align === "center" ? "justify-center" : ""}`}>
        {kicker}
      </span>
      <h2
        className={`font-display mt-4 text-3xl font-semibold leading-[1.12] sm:text-4xl lg:text-[2.75rem] ${
          light ? "text-slate-900" : "text-slate-50"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-base ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-slate-600" : "text-slate-300/90"}`}
        >
          {sub}
        </p>
      )}
    </Reveal>
  );
}

/* ---------- Brand logo ----------------------------------------------------
   Renders the client's custom logo (LOGO_URL in src/config.ts). If the image
   ever fails to load (Drive link not public, rate-limited, offline), it falls
   back to the built-in compass mark so the brand block never breaks.        */
export function Logo({ size = 42 }: { size?: number }) {
  const [failed, setFailed] = useState(false);

  if (CONFIG.LOGO_URL && !failed) {
    return (
      <img
        src={CONFIG.LOGO_URL}
        alt="Dream Home Navigators logo"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-lg object-contain"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22" stroke="#93c5fd" strokeWidth="1.6" opacity="0.7" />
      <circle cx="24" cy="24" r="17.5" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2.5 4" opacity="0.8" />
      <path d="M13 25 L24 15 L35 25" stroke="#f8fafc" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 11.5 L26.8 19.5 L24 22.5 L21.2 19.5 Z" fill="#93c5fd" />
      <path d="M24 36.5 L21.2 28.5 L24 25.5 L26.8 28.5 Z" fill="#e6c98c" />
      <circle cx="24" cy="24" r="1.9" fill="#f8fafc" />
      <path d="M16 33 H32" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Brass compass diamond used as a separator ---------- */
export function Diamond({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 ${className}`} aria-hidden="true">
      <path d="M6 0 L8.4 6 L6 12 L3.6 6 Z" fill="#d9b26a" />
    </svg>
  );
}
