import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "../config";
import { ABOUT_SEED, fmtPrice, LOCATIONS, Property, ServiceItem } from "../data";
import { SiteBackupData, useStore } from "../store";
import { supabase } from "../supabase";
import { Logo } from "../ui";

/* ─────────────────────────── helpers ─────────────────────────── */

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? iso
    : d.toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
        copied
          ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
          : "border-white/15 bg-white/5 text-slate-300 hover:border-brand-300/50 hover:text-white"
      }`}
    >
      <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ─────────────────────────── gate ─────────────────────────── */

function Gate() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError("Incorrect email or password.");
    // On success, onAuthStateChange in <Admin> flips the view — no local flag.
  }

  return (
    <section className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center px-5 py-10">
      <form onSubmit={submit} className="glass-panel-deep rounded-2xl p-8 text-center">
        <div className="mx-auto flex justify-center">
          <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-800 text-2xl text-white shadow-lg shadow-brand-950/60">
            <i className="fa-solid fa-shield-halved" />
          </span>
        </div>
        <h1 className="font-display mt-5 text-2xl font-semibold text-white">Owner Console</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
          Restricted area for the Dream Home Navigators team. Sign in with your admin account.
        </p>

        <div className="relative mt-6">
          <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="username"
            required
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <div className="relative mt-3">
          <i className="fa-solid fa-key absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-white/12 bg-white/5 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>

        {error && (
          <p className="mt-3 text-xs font-bold text-rose-400" role="alert">
            <i className="fa-solid fa-triangle-exclamation mr-1.5" />
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary mt-5 w-full">
          <i className={`fa-solid ${busy ? "fa-spinner fa-spin" : "fa-unlock"}`} />
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-[11px] text-slate-600">
        Access is restricted to invited admin accounts.
      </p>
    </section>
  );
}

/* ─────────────────────────── dashboard tab ─────────────────────────── */

function Dashboard({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const { leads, deleteLead, clearLeads, refreshLeads } = useStore();
  const [loading, setLoading] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await refreshLeads();
      if (active && !res.ok) notify("Could not load leads from Supabase.", false);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => {
    const week = Date.now() - 7 * 864e5;
    const byLoc = new Map<string, number>();
    const byProp = new Map<string, number>();
    leads.forEach((l) => {
      if (l.location) byLoc.set(l.location, (byLoc.get(l.location) ?? 0) + 1);
      if (l.propertyInterest)
        byProp.set(l.propertyInterest, (byProp.get(l.propertyInterest) ?? 0) + 1);
    });
    const top = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1])[0];
    return {
      total: leads.length,
      week: leads.filter((l) => new Date(l.timestamp).getTime() >= week).length,
      topLoc: top(byLoc),
      topProp: top(byProp),
    };
  }, [leads]);

  function exportCsv() {
    if (!leads.length) {
      notify("No leads to export yet.", false);
      return;
    }
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [
      ["Timestamp", "Name", "Phone", "Email", "Location", "Budget", "Property of Interest", "Message", "Source"].join(","),
      ...leads.map((l) =>
        [l.timestamp, l.name, l.phone, l.email, l.location, l.budget, l.propertyInterest, l.message, l.source]
          .map(esc)
          .join(",")
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhn-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify("CSV downloaded.", true);
  }

  const chips: { label: string; value: string; icon: string }[] = [
    { label: "Total leads", value: String(stats.total), icon: "fa-inbox" },
    { label: "Last 7 days", value: String(stats.week), icon: "fa-bolt" },
    {
      label: "Top location",
      value: stats.topLoc ? `${stats.topLoc[0]} (${stats.topLoc[1]})` : "—",
      icon: "fa-location-dot",
    },
    {
      label: "Most requested",
      value: stats.topProp ? stats.topProp[0].split("—")[0].trim() : "—",
      icon: "fa-house-chimney",
    },
  ];

  return (
    <div className="animate-card-in">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {chips.map((c) => (
          <div key={c.label} className="glass-panel flex items-center gap-4 p-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lg">
              <i className={`fa-solid ${c.icon}`} />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-[22px] font-semibold leading-none text-white">
                {c.value}
              </p>
              <p className="mt-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                {c.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-white">
          Lead Inbox
          <span className="ml-3 align-middle rounded-full bg-brand-500/20 px-2.5 py-1 text-xs font-extrabold text-brand-300">
            {leads.length}
          </span>
        </h2>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={exportCsv} className="btn btn-ghost !px-4 !py-2.5 text-[13px]">
            <i className="fa-solid fa-file-csv text-brand-300" />
            Export CSV
          </button>
          {leads.length > 0 && (
            <button
              onClick={() => {
                if (confirmClear) {
                  void clearLeads();
                  setConfirmClear(false);
                  notify("Lead log cleared.", true);
                } else {
                  setConfirmClear(true);
                  setTimeout(() => setConfirmClear(false), 3000);
                }
              }}
              className={`btn !px-4 !py-2.5 text-[13px] ${
                confirmClear
                  ? "bg-rose-500/20 text-rose-300 border border-rose-400/50"
                  : "btn-ghost"
              }`}
            >
              <i className="fa-solid fa-trash-can" />
              {confirmClear ? "Confirm clear?" : "Clear all"}
            </button>
          )}
        </div>
      </div>

      {loading && (
        <p className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[12.5px] font-semibold text-slate-300">
          <i className="fa-solid fa-spinner fa-spin" />
          Loading leads from Supabase…
        </p>
      )}

      {leads.length === 0 ? (
        <div className="glass-panel mt-5 flex flex-col items-center rounded-2xl px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-brand-400/30 bg-brand-500/10 text-2xl text-brand-300">
            <i className="fa-regular fa-folder-open" />
          </span>
          <h3 className="font-display mt-5 text-xl font-semibold text-white">No leads yet</h3>
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-slate-400">
            Every inquiry submitted on the Contact page lands here automatically. Test it:
            open Contact and send a sample inquiry — it appears here within seconds.
          </p>
        </div>
      ) : (
        <div className="glass-panel-deep mt-5 overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-[10.5px] uppercase tracking-[0.18em] text-slate-400">
                  <th className="px-5 py-3.5 font-extrabold">Date</th>
                  <th className="px-5 py-3.5 font-extrabold">Name</th>
                  <th className="px-5 py-3.5 font-extrabold">Contact</th>
                  <th className="px-5 py-3.5 font-extrabold">Location</th>
                  <th className="px-5 py-3.5 font-extrabold">Budget</th>
                  <th className="px-5 py-3.5 font-extrabold">Property</th>
                  <th className="px-5 py-3.5 font-extrabold">Source</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} className="group border-b border-white/5 transition hover:bg-white/[0.04]">
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-300">{fmtDate(l.timestamp)}</td>
                    <td className="px-5 py-3.5 font-bold text-white">{l.name || "—"}</td>
                    <td className="px-5 py-3.5">
                      {l.phone && (
                        <a href={`tel:${l.phone}`} className="block font-semibold text-brand-300 hover:text-brand-200">
                          <i className="fa-solid fa-phone mr-1.5 text-[11px]" />{l.phone}
                        </a>
                      )}
                      {l.email && <span className="block text-[12px] text-slate-400">{l.email}</span>}
                      {!l.phone && !l.email && <span className="text-slate-500">—</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{l.location || "—"}</td>
                    <td className="px-5 py-3.5 text-slate-300">{l.budget || "—"}</td>
                    <td className="max-w-[220px] truncate px-5 py-3.5 font-semibold text-slate-200" title={l.propertyInterest}>
                      {l.propertyInterest || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-brand-300">
                        <i className="fa-solid fa-database text-[9px]" />
                        {l.source || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => void deleteLead(l.id)}
                        aria-label={`Delete lead from ${l.name || "unknown"}`}
                        className="rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-500 opacity-0 transition hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-300 focus:opacity-100 group-hover:opacity-100"
                      >
                        <i className="fa-solid fa-xmark" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/10 px-5 py-3 text-[11.5px] font-semibold text-slate-500">
            {leads.length} record{leads.length > 1 ? "s" : ""} · newest first · rows with full
            messages available in CSV export
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── properties tab ─────────────────────────── */

const IMAGE_CHOICES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
];

const EMPTY_FORM = {
  name: "",
  location: LOCATIONS[0],
  area: "",
  price: "",
  priceNote: "TCP",
  beds: "3",
  baths: "2",
  sqm: "",
  parking: "1",
  lotNote: "",
  type: "House & Lot",
  badge: "New Launch",
  tagline: "",
  img: IMAGE_CHOICES[0],
  customImg: "",
};

function PropertiesAdmin({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const {
    properties,
    editedIds,
    addProperty,
    updateProperty,
    deleteProperty,
    resetProperties,
    customCount,
    deletedCount,
    featuredId,
    setFeatured,
  } = useStore();
  const [f, setF] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setF((p) => ({ ...p, [k]: e.target.value }));

  function resetForm() {
    setF(EMPTY_FORM);
    setEditingId(null);
  }

  /* Load every detail of a listing into the form for editing */
  function startEdit(p: Property) {
    setEditingId(p.id);
    setF({
      name: p.name,
      location: p.location,
      area: p.area,
      price: String(p.price),
      priceNote: p.priceNote ?? "TCP",
      beds: String(p.beds),
      baths: String(p.baths),
      sqm: String(p.sqm),
      parking: String(p.parking),
      lotNote: p.lotNote ?? "",
      type: p.type,
      badge: p.badge,
      tagline: p.tagline,
      img: IMAGE_CHOICES.includes(p.img) ? p.img : IMAGE_CHOICES[0],
      customImg: IMAGE_CHOICES.includes(p.img) ? "" : p.img,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.price || !f.sqm) {
      notify("Name, price and floor area are required.", false);
      return;
    }
    const details = {
      name: f.name.trim(),
      location: f.location,
      area: f.area.trim() || f.location,
      price: Number(f.price),
      priceNote: f.priceNote.trim() || "TCP",
      beds: Number(f.beds) || 0,
      baths: Number(f.baths) || 0,
      sqm: Number(f.sqm),
      parking: Number(f.parking) || 0,
      lotNote: f.lotNote.trim() || undefined,
      type: f.type,
      badge: f.badge,
      tagline: f.tagline.trim() || "Newly listed by Dream Home Navigators — inquire for full unit details and viewing schedule.",
      img: f.customImg.trim() || f.img,
    };
    let id: string | null = editingId;
    if (editingId) {
      const orig = properties.find((p) => p.id === editingId);
      if (orig) updateProperty({ ...orig, ...details, id: editingId });
    } else {
      id = addProperty(details).id;
    }
    /* Badging a unit "Featured" also claims the Home hero spot */
    let extra = "";
    if (details.badge === "Featured" && id) {
      setFeatured(id);
      extra = " Also set as the Home featured listing.";
    }
    notify(
      (editingId
        ? `"${details.name}" updated on the live site.`
        : `"${details.name}" is now live on the Properties page.`) + extra,
      true
    );
    resetForm();
  }

  const inputCls =
    "w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/25";
  const labelCls = "mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400";

  return (
    <div className="animate-card-in grid gap-8 lg:grid-cols-5">
      {/* Add / Edit form */}
      <form
        onSubmit={submit}
        className={`glass-panel-deep rounded-2xl p-6 lg:col-span-3 sm:p-7 transition-shadow ${
          editingId ? "ring-2 ring-brand-400/50" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-white">
            <i className={`fa-solid ${editingId ? "fa-pen-to-square" : "fa-plus"} mr-2.5 text-brand-300`} />
            {editingId ? "Edit Property" : "Add a Property"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-amber-400/50 bg-amber-400/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 transition hover:bg-amber-400/20"
            >
              <i className="fa-solid fa-xmark mr-1.5" />
              Cancel edit
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[12.5px] text-slate-400">
          {editingId
            ? "Every detail below is editable — changes go live the moment you save. Saved in this browser."
            : "Appears instantly on the Properties page (and Home, if Featured). Saved in this browser."}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Property name *</label>
            <input value={f.name} onChange={set("name")} placeholder="e.g. Acacia Court at Riverton Estates" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Location *</label>
            <select value={f.location} onChange={set("location")} className={inputCls}>
              {LOCATIONS.map((l) => <option key={l} value={l} className="bg-ink-900">{l}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Area / subdivision</label>
            <input value={f.area} onChange={set("area")} placeholder="e.g. Riverton Estates, Oton" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Price (PHP) *</label>
            <input value={f.price} onChange={set("price")} type="number" min="0" placeholder="e.g. 8500000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Price note</label>
            <input value={f.priceNote} onChange={set("priceNote")} placeholder="e.g. TCP, Spot cash, Negotiable" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Floor area (sqm) *</label>
            <input value={f.sqm} onChange={set("sqm")} type="number" min="0" placeholder="e.g. 120" className={inputCls} />
          </div>
          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            <div>
              <label className={labelCls}>Beds</label>
              <input value={f.beds} onChange={set("beds")} type="number" min="0" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Baths</label>
              <input value={f.baths} onChange={set("baths")} type="number" min="0" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Parking</label>
              <input value={f.parking} onChange={set("parking")} type="number" min="0" className={inputCls} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Lot note <span className="normal-case tracking-normal text-slate-500">(shown for Lot-type listings, e.g. "Corner lot · 220 sqm")</span></label>
            <input value={f.lotNote} onChange={set("lotNote")} placeholder="Optional — replaces beds/baths on the card for lot-only listings" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select value={f.type} onChange={set("type")} className={inputCls}>
              {["House & Lot", "Condo", "Townhouse", "Lot"].map((t) => (
                <option key={t} value={t} className="bg-ink-900">{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Badge</label>
            <select value={f.badge} onChange={set("badge")} className={inputCls}>
              {["New Launch", "Featured", "RFO", "Pre-Selling"].map((b) => (
                <option key={b} value={b} className="bg-ink-900">{b}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Tagline</label>
            <textarea value={f.tagline} onChange={set("tagline")} rows={2} placeholder="One-line selling point shown on the card…" className={`${inputCls} resize-none`} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Photo — pick one or paste your own URL</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {IMAGE_CHOICES.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => setF((p) => ({ ...p, img: url, customImg: "" }))}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    !f.customImg && f.img === url
                      ? "border-brand-400 ring-2 ring-brand-500/40"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  {!f.customImg && f.img === url && (
                    <span className="absolute inset-0 grid place-items-center bg-brand-600/40 text-white">
                      <i className="fa-solid fa-check text-xs" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              value={f.customImg}
              onChange={set("customImg")}
              placeholder="…or paste a custom image URL (https://…)"
              className={`${inputCls} mt-2.5`}
            />
            {f.customImg.trim() && (
              <img src={f.customImg.trim()} alt="Custom preview" className="mt-2.5 h-28 w-full rounded-lg object-cover" />
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
          <i className={`fa-solid ${editingId ? "fa-floppy-disk" : "fa-house-circle-check"}`} />
          {editingId ? "Save Changes" : "Publish Listing"}
        </button>
      </form>

      {/* Manage list */}
      <div className="lg:col-span-2">
        <div className="glass-panel-deep rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-white">
              <i className="fa-solid fa-list-check mr-2.5 text-brand-300" />
              Manage
              <span className="ml-2.5 rounded-full bg-brand-500/20 px-2.5 py-1 align-middle text-xs font-extrabold text-brand-300">
                {properties.length}
              </span>
            </h2>
            {(customCount > 0 || deletedCount > 0) && (
              <button
                onClick={() => {
                  if (confirmReset) {
                    resetProperties();
                    setConfirmReset(false);
                    notify("Property list restored to defaults.", true);
                  } else {
                    setConfirmReset(true);
                    setTimeout(() => setConfirmReset(false), 3000);
                  }
                }}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
                  confirmReset
                    ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                    : "border-white/12 text-slate-400 hover:border-brand-300/50 hover:text-white"
                }`}
              >
                {confirmReset ? "Confirm?" : "Restore defaults"}
              </button>
            )}
          </div>

          <ul className="mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {properties.map((p) => (
              <li key={p.id} className="group flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.04] p-2.5 transition hover:border-white/20 hover:bg-white/[0.07]">
                <img src={p.img} alt="" loading="lazy" className="h-14 w-16 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-white">{p.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold text-slate-400">
                    <span><i className="fa-solid fa-location-dot mr-1 text-brand-400" />{p.location}</span>
                    <span className="text-brand-300">{fmtPrice(p.price)}</span>
                    {featuredId === p.id && (
                      <span className="rounded-full bg-brass-400/25 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-brass-200">
                        <i className="fa-solid fa-star mr-1 text-[8px]" />
                        Home featured
                      </span>
                    )}
                    {p.id.startsWith("custom-") ? (
                      <span className="rounded-full bg-brass-400/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-brass-300">
                        Added
                      </span>
                    ) : editedIds.includes(p.id) ? (
                      <span className="rounded-full bg-brand-400/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-brand-300">
                        Edited
                      </span>
                    ) : null}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const next = featuredId === p.id ? null : p.id;
                    setFeatured(next);
                    notify(
                      next
                        ? `"${p.name}" is now the featured listing on the Home hero.`
                        : `Featured spot cleared — Home falls back to the first "Featured" badge.`,
                      true
                    );
                  }}
                  aria-label={featuredId === p.id ? `Unfeature ${p.name}` : `Feature ${p.name} on Home`}
                  title={featuredId === p.id ? "Remove from Home hero" : "Show in the Home hero"}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-extrabold tracking-wider transition ${
                    featuredId === p.id
                      ? "border-brass-300/60 bg-brass-400/15 text-brass-300"
                      : "border-white/12 text-slate-500 hover:border-brass-300/50 hover:bg-brass-400/10 hover:text-brass-300"
                  }`}
                >
                  <i className={`fa-${featuredId === p.id ? "solid" : "regular"} fa-star`} />
                </button>
                <button
                  onClick={() => startEdit(p)}
                  aria-label={`Edit ${p.name}`}
                  title="Edit details"
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider transition ${
                    editingId === p.id
                      ? "border-brand-400/70 bg-brand-500/25 text-brand-200"
                      : "border-white/12 text-slate-500 hover:border-brand-400/50 hover:bg-brand-400/10 hover:text-brand-300"
                  }`}
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  onClick={() => {
                    if (confirmDelete === p.id) {
                      deleteProperty(p.id);
                      if (featuredId === p.id) setFeatured(null);
                      setConfirmDelete(null);
                      if (editingId === p.id) resetForm();
                      notify(`"${p.name}" removed.`, true);
                    } else {
                      setConfirmDelete(p.id);
                      setTimeout(() => setConfirmDelete(null), 2600);
                    }
                  }}
                  aria-label={`Delete ${p.name}`}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider transition ${
                    confirmDelete === p.id
                      ? "border-rose-400/60 bg-rose-500/20 text-rose-300"
                      : "border-white/12 text-slate-500 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-300"
                  }`}
                >
                  {confirmDelete === p.id ? "Sure?" : <i className="fa-solid fa-trash-can" />}
                </button>
              </li>
            ))}
            {properties.length === 0 && (
              <li className="rounded-xl border border-dashed border-white/15 p-6 text-center text-[13px] text-slate-400">
                No properties. Add one or restore defaults.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── rentals tab ─────────────────────────── */

const RENTAL_BADGE_OPTIONS = [
  "Daily Stay",
  "Fully Furnished",
  "Long-term Lease",
  "Ready for Occupancy",
  "Commercial Space",
  "Executive Suite",
];

const RENTAL_TYPE_OPTIONS = [
  "Condominium Staycation / Suite",
  "Executive Condominium Unit",
  "Scenic Vacation Villa / Loft",
  "Two-Storey Single Detached Home",
  "Modern Multi-Level Hillside Home",
  "Mixed Commercial / Residential Suite",
  "Townhouse Unit",
  "Studio Apartment",
];

const RENTAL_IMAGE_CHOICES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
];

const EMPTY_RENTAL_FORM = {
  name: "",
  location: LOCATIONS[0],
  area: "",
  price: "",
  priceLabel: "Monthly Rental Rate",
  priceNote: "Inclusive of monthly condominium association dues. Min. 1-year contract.",
  beds: "2",
  baths: "2",
  sqm: "65",
  parking: "1",
  lotNote: "Furnished · Air Conditioned · High Speed Fiber Ready",
  type: RENTAL_TYPE_OPTIONS[0],
  badge: RENTAL_BADGE_OPTIONS[0],
  tagline: "",
  img: RENTAL_IMAGE_CHOICES[0],
  customImg: "",
};

function RentalsAdmin({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const {
    rentalProperties,
    rentalEditedIds,
    addRentalProperty,
    updateRentalProperty,
    deleteRentalProperty,
    resetRentalProperties,
    rentalCustomCount,
    rentalDeletedCount,
  } = useStore();

  const [f, setF] = useState(EMPTY_RENTAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY_RENTAL_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setF((p) => ({ ...p, [k]: e.target.value }));

  function resetForm() {
    setF(EMPTY_RENTAL_FORM);
    setEditingId(null);
  }

  function startEdit(p: Property) {
    setEditingId(p.id);
    setF({
      name: p.name,
      location: p.location,
      area: p.area,
      price: String(p.price),
      priceLabel: p.priceLabel || "Monthly Rental Rate",
      priceNote: p.priceNote || "Inclusive of monthly dues. Min. 1-year contract.",
      beds: String(p.beds),
      baths: String(p.baths),
      sqm: String(p.sqm),
      parking: String(p.parking),
      lotNote: p.lotNote ?? "",
      type: p.type,
      badge: p.badge,
      tagline: p.tagline,
      img: RENTAL_IMAGE_CHOICES.includes(p.img) ? p.img : RENTAL_IMAGE_CHOICES[0],
      customImg: RENTAL_IMAGE_CHOICES.includes(p.img) ? "" : p.img,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.price || !f.sqm) {
      notify("Unit name, monthly rate, and floor area are required.", false);
      return;
    }

    const details = {
      name: f.name.trim(),
      location: f.location,
      area: f.area.trim() || f.location,
      price: Number(f.price),
      priceLabel: f.priceLabel.trim() || "Monthly Rental Rate",
      priceNote: f.priceNote.trim() || "Inclusive of association dues. Min. 1-year contract.",
      beds: Number(f.beds) || 0,
      baths: Number(f.baths) || 0,
      sqm: Number(f.sqm),
      parking: Number(f.parking) || 0,
      lotNote: f.lotNote.trim() || undefined,
      type: f.type,
      badge: f.badge,
      tagline:
        f.tagline.trim() ||
        "Prime rental residence presented by Dream Home Navigators — inquire for lease schedule.",
      img: f.customImg.trim() || f.img,
      category: "rental" as const,
      isRental: true,
    };

    if (editingId) {
      const orig = rentalProperties.find((p) => p.id === editingId);
      if (orig) updateRentalProperty({ ...orig, ...details, id: editingId });
    } else {
      addRentalProperty(details);
    }

    notify(
      editingId
        ? `Rental unit "${details.name}" updated on the live site.`
        : `Rental unit "${details.name}" is now live on the Rentals page.`,
      true
    );
    resetForm();
  }

  const inputCls =
    "w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/25";
  const labelCls =
    "mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400";

  return (
    <div className="animate-card-in grid gap-8 lg:grid-cols-5">
      {/* Add / Edit Form */}
      <form
        onSubmit={submit}
        className={`glass-panel-deep rounded-2xl p-6 lg:col-span-3 sm:p-7 transition-shadow ${
          editingId ? "ring-2 ring-emerald-400/50" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-white">
            <i
              className={`fa-solid ${
                editingId ? "fa-pen-to-square" : "fa-key"
              } mr-2.5 text-emerald-300`}
            />
            {editingId ? "Edit Rental Property" : "Add Rental Property"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-amber-400/50 bg-amber-400/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 transition hover:bg-amber-400/20"
            >
              <i className="fa-solid fa-xmark mr-1.5" />
              Cancel edit
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[12.5px] text-slate-400">
          {editingId
            ? "Modify lease terms, monthly rate, territory, and photos. Updates apply live immediately."
            : "Publish verified rental listings with monthly rates and lease terms. Appears immediately on the Rental Properties catalog."}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Unit / Property Name *</label>
            <input
              value={f.name}
              onChange={set("name")}
              placeholder="e.g. Courtyard Executive Suite at Iloilo Business Park"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Territory / Location *</label>
            <select value={f.location} onChange={set("location")} className={inputCls}>
              {LOCATIONS.map((l) => (
                <option key={l} value={l} className="bg-ink-900">
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Area / District</label>
            <input
              value={f.area}
              onChange={set("area")}
              placeholder="e.g. Mandurriao, Iloilo City"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Monthly Rent (PHP / month) *</label>
            <input
              value={f.price}
              onChange={set("price")}
              type="number"
              min="0"
              placeholder="e.g. 38000"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Price Label</label>
            <input
              value={f.priceLabel}
              onChange={set("priceLabel")}
              placeholder="e.g. Monthly Rental Rate"
              className={inputCls}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Lease &amp; Payment Note</label>
            <input
              value={f.priceNote}
              onChange={set("priceNote")}
              placeholder="e.g. Inclusive of association dues. 1 month advance, 2 months deposit."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Floor Area (sqm) *</label>
            <input
              value={f.sqm}
              onChange={set("sqm")}
              type="number"
              min="0"
              placeholder="e.g. 68"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Badge / Lease Status</label>
            <select value={f.badge} onChange={set("badge")} className={inputCls}>
              {RENTAL_BADGE_OPTIONS.map((b) => (
                <option key={b} value={b} className="bg-ink-900">
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            <div>
              <label className={labelCls}>Bedrooms</label>
              <input
                value={f.beds}
                onChange={set("beds")}
                type="number"
                min="0"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Bathrooms</label>
              <input
                value={f.baths}
                onChange={set("baths")}
                type="number"
                min="0"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Parking Slots</label>
              <input
                value={f.parking}
                onChange={set("parking")}
                type="number"
                min="0"
                className={inputCls}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Property Type</label>
            <input
              value={f.type}
              onChange={set("type")}
              list="rental-type-suggestions"
              placeholder="e.g. Executive Condominium Unit, Scenic Villa, Commercial Space"
              className={inputCls}
            />
            <datalist id="rental-type-suggestions">
              {RENTAL_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>
              Features / Key Note{" "}
              <span className="normal-case tracking-normal text-slate-500">
                (e.g. "Corner Unit · High Floor · City Skyline View")
              </span>
            </label>
            <input
              value={f.lotNote}
              onChange={set("lotNote")}
              placeholder="e.g. Fully Furnished · High-Speed Fiber Ready · Balcony"
              className={inputCls}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Tagline</label>
            <textarea
              value={f.tagline}
              onChange={set("tagline")}
              rows={2}
              placeholder="One-line summary for tenant appeal…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Photo — pick preset or paste custom URL</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {RENTAL_IMAGE_CHOICES.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => setF((p) => ({ ...p, img: url, customImg: "" }))}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    !f.customImg && f.img === url
                      ? "border-emerald-400 ring-2 ring-emerald-500/40"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  {!f.customImg && f.img === url && (
                    <span className="absolute inset-0 grid place-items-center bg-emerald-600/40 text-white">
                      <i className="fa-solid fa-check text-xs" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <input
              value={f.customImg}
              onChange={set("customImg")}
              placeholder="…or paste an image URL (https://…)"
              className={`${inputCls} mt-2.5`}
            />
            {f.customImg.trim() && (
              <img
                src={f.customImg.trim()}
                alt="Custom preview"
                className="mt-2.5 h-28 w-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
          <i className={`fa-solid ${editingId ? "fa-floppy-disk" : "fa-plus"}`} />
          {editingId ? "Save Rental Changes" : "Publish Rental Unit"}
        </button>
      </form>

      {/* Rental Units Catalog List */}
      <div className="lg:col-span-2">
        <div className="glass-panel-deep rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-white">
              <i className="fa-solid fa-key mr-2.5 text-emerald-300" />
              Manage Rentals
              <span className="ml-2.5 rounded-full bg-emerald-500/20 px-2.5 py-1 align-middle text-xs font-extrabold text-emerald-300">
                {rentalProperties.length}
              </span>
            </h2>
            {(rentalCustomCount > 0 || rentalDeletedCount > 0) && (
              <button
                onClick={() => {
                  if (confirmReset) {
                    resetRentalProperties();
                    setConfirmReset(false);
                    notify("Rental list restored to defaults.", true);
                  } else {
                    setConfirmReset(true);
                    setTimeout(() => setConfirmReset(false), 3000);
                  }
                }}
                className={`rounded-lg border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
                  confirmReset
                    ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                    : "border-white/12 text-slate-400 hover:border-emerald-300/50 hover:text-white"
                }`}
              >
                {confirmReset ? "Confirm?" : "Restore defaults"}
              </button>
            )}
          </div>

          <ul className="mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {rentalProperties.map((p) => (
              <li
                key={p.id}
                className="group flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.04] p-2.5 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <img
                  src={p.img}
                  alt=""
                  loading="lazy"
                  className="h-14 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-white">{p.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold text-slate-400">
                    <span>
                      <i className="fa-solid fa-location-dot mr-1 text-emerald-400" />
                      {p.location}
                    </span>
                    <span className="text-emerald-300">{fmtPrice(p.price, true)}</span>
                    <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[9.5px] font-extrabold text-slate-300">
                      {p.badge}
                    </span>
                    {p.id.startsWith("custom-rent-") ? (
                      <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-emerald-300">
                        Added
                      </span>
                    ) : rentalEditedIds.includes(p.id) ? (
                      <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-cyan-300">
                        Edited
                      </span>
                    ) : null}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(p)}
                  aria-label={`Edit ${p.name}`}
                  title="Edit details"
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider transition ${
                    editingId === p.id
                      ? "border-emerald-400/70 bg-emerald-500/25 text-emerald-200"
                      : "border-white/12 text-slate-500 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300"
                  }`}
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  onClick={() => {
                    if (confirmDelete === p.id) {
                      deleteRentalProperty(p.id);
                      setConfirmDelete(null);
                      if (editingId === p.id) resetForm();
                      notify(`Rental unit "${p.name}" removed.`, true);
                    } else {
                      setConfirmDelete(p.id);
                      setTimeout(() => setConfirmDelete(null), 2600);
                    }
                  }}
                  aria-label={`Delete ${p.name}`}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider transition ${
                    confirmDelete === p.id
                      ? "border-rose-400/60 bg-rose-500/20 text-rose-300"
                      : "border-white/12 text-slate-500 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-300"
                  }`}
                >
                  {confirmDelete === p.id ? "Sure?" : <i className="fa-solid fa-trash-can" />}
                </button>
              </li>
            ))}
            {rentalProperties.length === 0 && (
              <li className="rounded-xl border border-dashed border-white/15 p-6 text-center text-[13px] text-slate-400">
                No rental units listed. Add one or restore default listings.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── services tab ─────────────────────────── */

const ICON_CHOICES = [
  "fa-house-chimney",
  "fa-magnifying-glass-location",
  "fa-chart-line",
  "fa-file-signature",
  "fa-building-columns",
  "fa-handshake",
  "fa-video",
  "fa-key",
  "fa-scale-balanced",
  "fa-clipboard-list",
  "fa-phone-volume",
  "fa-earth-asia",
  "fa-compass",
  "fa-sack-dollar",
  "fa-tower-broadcast",
  "fa-hand-holding-dollar",
  "fa-headset",
  "fa-shield-halved",
];

const ADMIN_INPUT =
  "w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/25";
const ADMIN_LABEL =
  "mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400";

const EMPTY_SVC = { icon: ICON_CHOICES[0], title: "", desc: "", bullets: "" };

function ServicesAdmin({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const { services, addService, updateService, deleteService, resetServices } = useStore();
  const [f, setF] = useState(EMPTY_SVC);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (k: keyof typeof EMPTY_SVC) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setF((p) => ({ ...p, [k]: e.target.value }));

  function resetForm() {
    setF(EMPTY_SVC);
    setEditingId(null);
  }

  function startEdit(s: ServiceItem) {
    setEditingId(s.id);
    setF({ icon: s.icon, title: s.title, desc: s.desc, bullets: s.bullets.join("\n") });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.title.trim() || !f.desc.trim()) {
      notify("Service title and description are required.", false);
      return;
    }
    const data = {
      icon: f.icon,
      title: f.title.trim(),
      desc: f.desc.trim(),
      bullets: f.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
    };
    if (editingId) {
      updateService({ ...data, id: editingId });
      notify(`Service "${data.title}" updated on the live site.`, true);
    } else {
      addService(data);
      notify(`Service "${data.title}" added to the Services page.`, true);
    }
    resetForm();
  }

  return (
    <div className="animate-card-in grid gap-8 lg:grid-cols-5">
      {/* Service form */}
      <form onSubmit={submit} className="glass-panel-deep rounded-2xl p-6 sm:p-7 lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-white">
            <i className={`fa-solid ${editingId ? "fa-pen-to-square" : "fa-plus"} mr-2.5 text-brand-300`} />
            {editingId ? "Edit Service" : "Add a Service"}
          </h2>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-[12px] font-extrabold uppercase tracking-wider text-slate-400 transition hover:text-white">
              <i className="fa-solid fa-xmark mr-1.5" />
              Cancel edit
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[12.5px] text-slate-400">
          Service cards on the Services page — and the three previews on Home — update instantly.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={ADMIN_LABEL}>Icon</label>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg text-white shadow-lg">
                <i className={`fa-solid ${f.icon}`} />
              </span>
              <select value={f.icon} onChange={set("icon")} className={ADMIN_INPUT}>
                {ICON_CHOICES.map((ic) => (
                  <option key={ic} value={ic} className="bg-ink-900">
                    {ic.replace("fa-", "").replace(/-/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={ADMIN_LABEL}>Service title *</label>
            <input value={f.title} onChange={set("title")} placeholder="e.g. Lease-to-Own Assistance" className={ADMIN_INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={ADMIN_LABEL}>Description *</label>
            <textarea value={f.desc} onChange={set("desc")} rows={3} placeholder="What this service does for the client…" className={`${ADMIN_INPUT} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className={ADMIN_LABEL}>What's included — one bullet per line</label>
            <textarea
              value={f.bullets}
              onChange={set("bullets")}
              rows={4}
              placeholder={"Needs & budget discovery call\nCurated shortlist in 48 hours\nSide-by-side unit comparisons"}
              className={`${ADMIN_INPUT} resize-none`}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-6 w-full sm:w-auto">
          <i className={`fa-solid ${editingId ? "fa-floppy-disk" : "fa-briefcase"}`} />
          {editingId ? "Save Changes" : "Add Service"}
        </button>
      </form>

      {/* Manage list */}
      <div className="lg:col-span-2">
        <div className="glass-panel-deep rounded-2xl p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-white">
              <i className="fa-solid fa-list-check mr-2.5 text-brand-300" />
              Services
              <span className="ml-2.5 rounded-full bg-brand-500/20 px-2.5 py-1 align-middle text-xs font-extrabold text-brand-300">
                {services.length}
              </span>
            </h2>
            <button
              onClick={() => {
                if (confirmReset) {
                  resetServices();
                  resetForm();
                  setConfirmReset(false);
                  notify("Services restored to defaults.", true);
                } else {
                  setConfirmReset(true);
                  setTimeout(() => setConfirmReset(false), 3000);
                }
              }}
              className={`rounded-lg border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
                confirmReset
                  ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                  : "border-white/12 text-slate-400 hover:border-brand-300/50 hover:text-white"
              }`}
            >
              {confirmReset ? "Confirm?" : "Restore defaults"}
            </button>
          </div>

          <ul className="mt-5 max-h-[560px] space-y-3 overflow-y-auto pr-1">
            {services.map((s) => (
              <li key={s.id} className="group flex items-center gap-3.5 rounded-xl border border-white/8 bg-white/[0.04] p-2.5 transition hover:border-white/20 hover:bg-white/[0.07]">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-base text-white shadow-lg">
                  <i className={`fa-solid ${s.icon}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-bold text-white">{s.title}</p>
                  <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-400">
                    {s.bullets.length} bullet{s.bullets.length === 1 ? "" : "s"} · {s.desc}
                  </p>
                </div>
                <button
                  onClick={() => startEdit(s)}
                  aria-label={`Edit ${s.title}`}
                  title="Edit service"
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] transition ${
                    editingId === s.id
                      ? "border-brand-400/70 bg-brand-500/25 text-brand-200"
                      : "border-white/12 text-slate-500 hover:border-brand-400/50 hover:bg-brand-400/10 hover:text-brand-300"
                  }`}
                >
                  <i className="fa-solid fa-pen" />
                </button>
                <button
                  onClick={() => {
                    if (confirmDelete === s.id) {
                      deleteService(s.id);
                      setConfirmDelete(null);
                      if (editingId === s.id) resetForm();
                      notify(`Service "${s.title}" removed.`, true);
                    } else {
                      setConfirmDelete(s.id);
                      setTimeout(() => setConfirmDelete(null), 2600);
                    }
                  }}
                  aria-label={`Delete ${s.title}`}
                  className={`shrink-0 rounded-lg border px-3 py-2 text-[11px] transition ${
                    confirmDelete === s.id
                      ? "border-rose-400/60 bg-rose-500/20 text-rose-300"
                      : "border-white/12 text-slate-500 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-rose-300"
                  }`}
                >
                  {confirmDelete === s.id ? "Sure?" : <i className="fa-solid fa-trash-can" />}
                </button>
              </li>
            ))}
            {services.length === 0 && (
              <li className="rounded-xl border border-dashed border-white/15 p-6 text-center text-[13px] text-slate-400">
                No services yet. Add one or restore defaults.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── about tab ─────────────────────────── */

function AboutAdmin({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const { about, updateAbout, resetAbout } = useStore();
  const [f, setF] = useState(() => ({ ...about, whyUsText: about.whyUs.join("\n") }));
  const [confirmReset, setConfirmReset] = useState(false);

  const set = (k: keyof typeof f) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setF((p) => ({ ...p, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.headline.trim() || !f.paragraph1.trim()) {
      notify("Headline and the first story paragraph are required.", false);
      return;
    }
    updateAbout({
      kicker: f.kicker.trim() || "Our story",
      headline: f.headline.trim(),
      paragraph1: f.paragraph1.trim(),
      paragraph2: f.paragraph2.trim(),
      mission: f.mission.trim(),
      vision: f.vision.trim(),
      whyUs: f.whyUsText.split("\n").map((w) => w.trim()).filter(Boolean),
    });
    notify("About page updated on the live site.", true);
  }

  function doReset() {
    resetAbout();
    setF({ ...ABOUT_SEED, whyUsText: ABOUT_SEED.whyUs.join("\n") });
    setConfirmReset(false);
    notify("About page restored to defaults.", true);
  }

  return (
    <div className="animate-card-in mx-auto max-w-4xl">
      <form onSubmit={submit} className="glass-panel-deep rounded-2xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              <i className="fa-solid fa-address-card mr-2.5 text-brand-300" />
              About Page Content
            </h2>
            <p className="mt-1.5 text-[12.5px] text-slate-400">
              Story, mission & vision, and the "Why choose us" checklist — all live-editable.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirmReset) doReset();
              else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 3000);
              }
            }}
            className={`rounded-lg border px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider transition ${
              confirmReset
                ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                : "border-white/12 text-slate-400 hover:border-brand-300/50 hover:text-white"
            }`}
          >
            {confirmReset ? "Confirm reset?" : "Restore defaults"}
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label className={ADMIN_LABEL}>Section kicker</label>
            <input value={f.kicker} onChange={set("kicker")} className={ADMIN_INPUT} />
          </div>
          <div>
            <label className={ADMIN_LABEL}>Story headline *</label>
            <input value={f.headline} onChange={set("headline")} className={ADMIN_INPUT} />
          </div>
          <div className="sm:col-span-2">
            <label className={ADMIN_LABEL}>Story — paragraph 1 *</label>
            <textarea value={f.paragraph1} onChange={set("paragraph1")} rows={4} className={`${ADMIN_INPUT} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className={ADMIN_LABEL}>Story — paragraph 2</label>
            <textarea value={f.paragraph2} onChange={set("paragraph2")} rows={3} className={`${ADMIN_INPUT} resize-none`} />
          </div>
          <div>
            <label className={ADMIN_LABEL}>Mission</label>
            <textarea value={f.mission} onChange={set("mission")} rows={4} className={`${ADMIN_INPUT} resize-none`} />
          </div>
          <div>
            <label className={ADMIN_LABEL}>Vision</label>
            <textarea value={f.vision} onChange={set("vision")} rows={4} className={`${ADMIN_INPUT} resize-none`} />
          </div>
          <div className="sm:col-span-2">
            <label className={ADMIN_LABEL}>"Why choose us" checklist — one point per line</label>
            <textarea value={f.whyUsText} onChange={set("whyUsText")} rows={7} className={`${ADMIN_INPUT} resize-none`} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-6">
          <i className="fa-solid fa-floppy-disk" />
          Save About Page
        </button>
      </form>
      <p className="mt-4 text-center text-[12px] text-slate-500">
        <i className="fa-solid fa-circle-info mr-1.5 text-brand-400" />
        Team roster and credentials are set in <code className="text-brand-300">src/data.ts</code> (TEAM array).
      </p>
    </div>
  );
}

/* ─────────────────────────── setup tab ─────────────────────────── */

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider ${
        ok ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"} animate-pulse`} />
      {ok ? "Configured" : "Action needed"}
    </span>
  );
}

function SetupGuide() {
  const stepCls = "glass-panel rounded-2xl p-6 sm:p-7";
  const h3Cls = "font-display flex items-center gap-3 text-[19px] font-semibold text-white";
  const numCls =
    "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-sm font-extrabold text-white";
  const olCls = "mt-4 space-y-2.5 text-[13.5px] leading-relaxed text-slate-300";
  const liCls = "flex gap-2.5";
  const tick = <i className="fa-solid fa-angle-right mt-1 text-brand-400" />;

  return (
    <div className="animate-card-in space-y-6">
      {/* 1 — Supabase CRM */}
      <div className={stepCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={h3Cls}>
            <span className={numCls}>1</span>
            Leads CRM — Supabase
          </h3>
          <StatusDot ok />
        </div>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-300/90">
          Leads are stored securely in Supabase (Postgres) and protected by Row Level Security:
          the public Contact form can only <b className="text-white">submit</b> a lead, and only
          signed-in admin accounts can read or delete them. The publishable key that ships in the
          site is safe to expose — access is enforced server-side by RLS, not by hiding the key.
        </p>
        <ol className={olCls}>
          <li className={liCls}>{tick}<span>Set <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">VITE_SUPABASE_URL</code> and <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">VITE_SUPABASE_ANON_KEY</code> in <b className="text-white">.env</b> (see <b className="text-white">.env.example</b>). Find them in Supabase → Project Settings → API.</span></li>
          <li className={liCls}>{tick}<span>The <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">leads</code> table and its RLS policies are created by the migration in <b className="text-white">supabase/migrations</b>.</span></li>
          <li className={liCls}>{tick}<span>To add another admin, invite them from <b className="text-white">Supabase → Authentication → Users</b>. Keep public signups disabled so only invited accounts can sign in.</span></li>
          <li className={liCls}>{tick}<span>Test with a sample inquiry on the Contact page — it appears in this Dashboard within seconds.</span></li>
        </ol>
      </div>

      {/* 3 — Messenger */}
      <div className={stepCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={h3Cls}>
            <span className={numCls}>3</span>
            Messenger widget & quick replies
          </h3>
          <StatusDot ok={CONFIG.MESSENGER_URL.includes("m.me/")} />
        </div>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-300/90">
          The floating widget is pre-wired to{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">{CONFIG.MESSENGER_URL}</code>{" "}
          and opens Facebook Messenger in a new tab. To change the page or the quick-reply prompts, edit{" "}
          <b className="text-white">src/config.ts</b>:
        </p>
        <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-ink-950/80">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">src/config.ts</span>
            <CopyBtn
              text={`MESSENGER_URL: "https://m.me/dreamhomenavigators01",\nMESSENGER_QUICK_REPLIES: [\n  "Schedule a site visit",\n  "Inquire about Pine Deluxe",\n]`}
            />
          </div>
          <pre className="overflow-auto p-4 text-[12px] leading-relaxed text-brand-100">
            <code>{`MESSENGER_URL: "https://m.me/dreamhomenavigators01",
MESSENGER_QUICK_REPLIES: [
  "Schedule a site visit",
  "Inquire about Pine Deluxe",
  "Do you have OFW payment terms?",
  "What are your current promos?",
]`}</code>
          </pre>
        </div>
        <p className="mt-3 text-[12.5px] text-slate-400">
          <i className="fa-solid fa-circle-info mr-2 text-brand-400" />
          Tip: for true in-chat quick replies, also add them in Meta Business Suite → Inbox →
          Automated responses → Frequently asked questions.
        </p>
      </div>

      {/* 4 — Console security & data notes */}
      <div className={stepCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={h3Cls}>
            <span className={numCls}>4</span>
            Console security & data notes
          </h3>
          <StatusDot ok />
        </div>
        <ul className={olCls}>
          <li className={liCls}>
            {tick}
            <span>
              <b className="text-white">Hidden route — no public link exists.</b> The console is
              reachable only by typing the secret route into the browser address bar:{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">
                https://yoursite.com{CONFIG.ADMIN_ROUTE_HASH}
              </code>
              . Change it to something only the owners know via{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">ADMIN_ROUTE_HASH</code>{" "}
              in src/config.ts (keep the leading <b className="text-white">#/</b>).
            </span>
          </li>
          <li className={liCls}>
            {tick}
            <span>
              <b className="text-white">Real authentication.</b> The console requires a Supabase
              email/password login. Only invited admin accounts exist (public signups are disabled),
              and Supabase rate-limits sign-in attempts server-side. Press{" "}
              <b className="text-white">Sign out</b> to end the session.
            </span>
          </li>
          <li className={liCls}>
            {tick}
            <span>
              <b className="text-white">Lead data is protected by RLS, not the bundle.</b> Even
              though the site is static, the Supabase publishable key it ships can only insert a
              lead — reading and deleting leads require a signed-in admin. Anonymous visitors cannot
              read the CRM.
            </span>
          </li>
          <li className={liCls}>{tick}<span>Added/edited/removed properties still persist in the browser's <b className="text-white">localStorage</b> — ideal for a single-device demo, and instantly visible to visitors of that browser. Leads, by contrast, live in Supabase and are shared across all admins.</span></li>
          <li className={liCls}>{tick}<span>Business email shown site-wide is set via <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">EMAIL</code> in src/config.ts.</span></li>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────── backup tab ─────────────────────────── */

function BackupAdmin({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const {
    properties,
    rentalProperties,
    leads,
    services,
    about,
    createBackup,
    restoreBackup,
    resetAllToFactory,
  } = useStore();

  const [confirmFactoryReset, setConfirmFactoryReset] = useState(false);
  const [jsonText, setJsonText] = useState("");
  const [importPreview, setImportPreview] = useState<SiteBackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    const backup = createBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `dhn-backup-${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify("Website snapshot backup downloaded successfully.", true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as SiteBackupData;

        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid JSON structure.");
        }

        setImportPreview(parsed);
        setJsonText(text);
        setImportError(null);
      } catch (err) {
        setImportError(
          `Failed to parse backup file: ${err instanceof Error ? err.message : "Malformed JSON"}`
        );
        setImportPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyRestore = () => {
    if (!importPreview) {
      notify("No valid backup data selected to restore.", false);
      return;
    }

    const res = restoreBackup(importPreview);
    notify(res.message, res.ok);
    if (res.ok) {
      setImportPreview(null);
      setJsonText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="animate-card-in space-y-8">
      {/* Top Banner */}
      <div className="glass-panel-deep rounded-2xl p-6 sm:p-7 border border-brand-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="glass-chip px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-300">
              <i className="fa-solid fa-shield-halved mr-1.5 text-brand-400" />
              Owner Authenticated Security
            </span>
            <h2 className="font-display mt-2.5 text-2xl font-semibold text-white sm:text-3xl">
              Website Snapshot Backup &amp; Disaster Recovery
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">
              Download complete state snapshots of Dream Home Navigators — including custom for-sale listings, verified rental residences, captured CRM leads, customized services, and About copy. Restoring instantly updates live state across all client pages.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="btn btn-primary !px-5 !py-3 text-[13.5px] font-bold shadow-lg shadow-brand-950/60"
          >
            <i className="fa-solid fa-download mr-1 text-sm" />
            Download Backup Snapshot (.json)
          </button>
        </div>

        {/* Current State Summary Chips */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              For-Sale Units
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-white">
              {properties.length}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Rental Units
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-emerald-300">
              {rentalProperties.length}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Captured Leads
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-cyan-300">
              {leads.length}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 text-center">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Core Services
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-amber-300">
              {services.length}
            </div>
          </div>
        </div>
      </div>

      {/* Restore Section & File Picker */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Import Box */}
        <div className="glass-panel-deep rounded-2xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
              <i className="fa-solid fa-cloud-arrow-up text-brand-300" />
              Restore From File
            </h3>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">
              Upload a previously downloaded <code className="rounded bg-white/10 px-1 text-slate-300">.json</code> backup to overwrite or recover your website content.
            </p>

            <div className="mt-5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
                id="backup-file-input"
              />
              <label
                htmlFor="backup-file-input"
                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand-400/40 bg-white/[0.02] p-8 text-center cursor-pointer transition hover:border-brand-400 hover:bg-white/[0.05]"
              >
                <i className="fa-solid fa-file-arrow-up text-3xl text-brand-400 mb-2" />
                <span className="text-sm font-bold text-white">Click to select backup file</span>
                <span className="mt-1 text-xs text-slate-400">Accepts .json backup files exported from Owner Console</span>
              </label>
            </div>

            {importError && (
              <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/15 p-3.5 text-xs font-semibold text-rose-200 flex items-start gap-2">
                <i className="fa-solid fa-circle-exclamation mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            {importPreview && (
              <div className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>
                    <i className="fa-solid fa-circle-check mr-1.5" />
                    Valid backup snapshot ready
                  </span>
                  <span className="text-slate-400">
                    Exported: {fmtDate(importPreview.exportedAt || "")}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-slate-300">
                  <li>• For-sale listings: <b>{importPreview.customProperties?.length ?? 0}</b></li>
                  <li>• Rental listings: <b>{importPreview.customRentals?.length ?? 0}</b></li>
                  <li>• Leads snapshot: <b>{importPreview.leads?.length ?? 0}</b> entries</li>
                  <li>• Services catalog: <b>{importPreview.services?.length ?? 0}</b> packages</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <button
              onClick={handleApplyRestore}
              disabled={!importPreview}
              className="btn btn-primary !px-5 !py-2.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-rotate-left mr-1.5" />
              Apply &amp; Restore Live Site
            </button>
            {importPreview && (
              <button
                onClick={() => {
                  setImportPreview(null);
                  setJsonText("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Manual Paste / Inspect Snapshot */}
        <div className="glass-panel-deep rounded-2xl p-6 sm:p-7 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                <i className="fa-solid fa-code text-cyan-300" />
                Raw JSON Inspector
              </h3>
              {jsonText && <CopyBtn text={jsonText} />}
            </div>
            <p className="mt-1.5 text-[13px] text-slate-400 leading-relaxed">
              Directly view or paste backup JSON payload if transferring between browsers without downloading files.
            </p>

            <textarea
              value={jsonText}
              onChange={(e) => {
                const text = e.target.value;
                setJsonText(text);
                if (!text.trim()) {
                  setImportPreview(null);
                  setImportError(null);
                  return;
                }
                try {
                  const parsed = JSON.parse(text) as SiteBackupData;
                  setImportPreview(parsed);
                  setImportError(null);
                } catch {
                  setImportError("Invalid JSON entered in raw inspector.");
                  setImportPreview(null);
                }
              }}
              rows={8}
              placeholder="Paste raw backup JSON text here to validate and restore…"
              className="mt-4 w-full rounded-xl border border-white/10 bg-ink-950/80 p-3.5 font-mono text-[12px] text-slate-300 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="mt-4 text-[11px] text-slate-500 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-slate-400" />
            <span>Encrypted local storage schema with validation safeguards.</span>
          </div>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-rose-200 flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-rose-400" />
              Danger Zone: Factory Reset
            </h3>
            <p className="mt-1 text-[13px] text-rose-200/80 max-w-xl">
              Purges all custom property listings, custom rental listings, local leads, and custom service/about edits, returning the entire website to pristine factory default data.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirmFactoryReset) {
                resetAllToFactory();
                setConfirmFactoryReset(false);
                notify("All website content has been reset to factory defaults.", true);
              } else {
                setConfirmFactoryReset(true);
                setTimeout(() => setConfirmFactoryReset(false), 4000);
              }
            }}
            className={`btn !px-4 !py-2.5 text-xs font-bold transition ${
              confirmFactoryReset
                ? "bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-950/80"
                : "border border-rose-400/50 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
            }`}
          >
            <i className="fa-solid fa-trash-can mr-1.5" />
            {confirmFactoryReset ? "Click to Confirm Factory Reset" : "Reset Everything to Factory Defaults"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── page shell ─────────────────────────── */

type Tab = "dashboard" | "properties" | "rentals" | "services" | "about" | "backup" | "setup";

export default function Admin({ exit }: { exit: () => void }) {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = still checking
  const [tab, setTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3600);
  };

  if (authed === null) {
    return (
      <section className="mx-auto flex min-h-[85vh] max-w-md items-center justify-center">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-brand-300" />
      </section>
    );
  }
  if (!authed) return <Gate />;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Leads Dashboard", icon: "fa-gauge-high" },
    { id: "properties", label: "Properties", icon: "fa-house" },
    { id: "rentals", label: "Rental Units", icon: "fa-key" },
    { id: "services", label: "Services", icon: "fa-briefcase" },
    { id: "about", label: "About Page", icon: "fa-address-card" },
    { id: "backup", label: "Website Backup", icon: "fa-database" },
    { id: "setup", label: "Setup Guide", icon: "fa-plug" },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-5 pt-12 pb-6 sm:px-8 sm:pt-16">
      {toast && (
        <div
          className={`fixed left-1/2 top-24 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl border px-5 py-3 text-[13px] font-bold shadow-2xl backdrop-blur-xl animate-card-in ${
            toast.ok
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
              : "border-rose-400/40 bg-rose-500/15 text-rose-200"
          }`}
          role="status"
        >
          <i className={`fa-solid ${toast.ok ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          {toast.msg}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="kicker">Restricted area</span>
          <h1 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Navigator Console
          </h1>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-slate-400">
            Manage listings, rental units, the Home featured unit, services, About copy, full auth backups, and the lead CRM — without touching code.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={exit} className="btn btn-ghost !px-4 !py-2.5 text-[13px]">
            <i className="fa-solid fa-eye text-brand-300" />
            View live site
          </button>
          <button
            onClick={() => supabase.auth.signOut()}
            className="btn btn-ghost !px-4 !py-2.5 text-[13px]"
          >
            <i className="fa-solid fa-lock text-brand-300" />
            Sign out
          </button>
        </div>
      </div>

      <div className="glass-chip mt-8 inline-flex max-w-full gap-1 overflow-x-auto !rounded-xl p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-extrabold transition-all ${
              tab === t.id
                ? "bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-lg shadow-brand-950/50"
                : "text-slate-300 hover:bg-white/8 hover:text-white"
            }`}
          >
            <i className={`fa-solid ${t.icon}`} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-7">
        {tab === "dashboard" && <Dashboard notify={notify} />}
        {tab === "properties" && <PropertiesAdmin notify={notify} />}
        {tab === "rentals" && <RentalsAdmin notify={notify} />}
        {tab === "services" && <ServicesAdmin notify={notify} />}
        {tab === "about" && <AboutAdmin notify={notify} />}
        {tab === "backup" && <BackupAdmin notify={notify} />}
        {tab === "setup" && <SetupGuide />}
      </div>
    </section>
  );
}

