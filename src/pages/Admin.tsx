import { FormEvent, useMemo, useState } from "react";
import { CONFIG } from "../config";
import { fmtPrice, LOCATIONS, Page, Property } from "../data";
import { Lead, useStore } from "../store";
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

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-ink-950/80">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <i className="fa-solid fa-code text-brand-400" />
          Google Apps Script
        </span>
        <CopyBtn text={code} />
      </div>
      <pre className="max-h-72 overflow-auto p-4 text-[11.5px] leading-relaxed text-brand-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const APPS_SCRIPT = `// ─── Dream Home Navigators · Lead CRM (Google Apps Script) ───
// 1. Create a Google Sheet. 2. Extensions → Apps Script.
// 3. Paste this file, save, then Deploy → New deployment →
//    type: Web app · Execute as: Me · Who has access: Anyone.
// 4. Copy the Web App URL into GOOGLE_SCRIPT_URL and
//    SHEET_READ_URL in src/config.ts of the website.

var SHEET_NAME = "Leads";
var HEADERS = ["Timestamp", "Name", "Phone", "Email", "Location",
  "Budget", "Property of Interest", "Message", "Source"];

function doGet() {
  var rows = getSheet_().getDataRange().getValues();
  var headers = rows.shift() || HEADERS;
  var leads = rows.map(function (r) {
    var o = {};
    headers.forEach(function (h, i) { o[h] = r[i]; });
    return o;
  });
  return json_({ ok: true, leads: leads });
}

function doPost(e) {
  var d = JSON.parse((e.postData && e.postData.contents) || "{}");
  getSheet_().appendRow([
    new Date(),
    d.name || "", d.phone || "", d.email || "",
    d.location || "", d.budget || "",
    d.propertyInterest || "", d.message || "",
    d.source || "Website"
  ]);
  return json_({ ok: true });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`;

/* ─────────────────────────── gate ─────────────────────────── */

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (code.trim() === CONFIG.ADMIN_PASSCODE) {
      onUnlock();
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 600);
    }
  }

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 pt-32 pb-10">
      <form
        onSubmit={submit}
        className={`glass-panel-deep rounded-2xl p-8 text-center transition-transform ${
          wrong ? "animate-[shake_0.5s_ease]" : ""
        }`}
      >
        <div className="mx-auto flex justify-center">
          <Logo size={52} />
        </div>
        <h1 className="font-display mt-5 text-2xl font-semibold text-white">
          Navigator Console
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
          Restricted area for the Dream Home Navigators team. Enter the admin
          passcode to manage properties and view leads.
        </p>
        <div className="relative mt-6">
          <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Admin passcode"
            autoFocus
            className="w-full rounded-xl border bg-white/5 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        {wrong && (
          <p className="mt-3 text-xs font-bold text-rose-400">
            <i className="fa-solid fa-triangle-exclamation mr-1.5" />
            Incorrect passcode. Check Admin → Setup Guide in the docs.
          </p>
        )}
        <button type="submit" className="btn btn-primary mt-5 w-full">
          <i className="fa-solid fa-unlock" />
          Unlock Console
        </button>
        <p className="mt-5 text-[11px] text-slate-500">
          Default passcode is set in <code className="text-brand-300">src/config.ts</code> (ADMIN_PASSCODE)
        </p>
      </form>
    </section>
  );
}

/* ─────────────────────────── dashboard tab ─────────────────────────── */

function Dashboard({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const { leads, deleteLead, clearLeads, importLeads } = useStore();
  const [syncing, setSyncing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

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

  async function syncFromSheet() {
    if (!CONFIG.SHEET_READ_URL) {
      notify("Set SHEET_READ_URL in src/config.ts first — see Setup Guide.", false);
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch(CONFIG.SHEET_READ_URL);
      const data = await res.json();
      const rows: unknown[] = Array.isArray(data) ? data : data?.leads ?? [];
      const normalized: Omit<Lead, "id">[] = rows.map((r) => {
        const row = r as Record<string, unknown>;
        const g = (...keys: string[]) => {
          for (const k of keys) {
            const hit = Object.keys(row).find(
              (rk) => rk.toLowerCase().replace(/[^a-z]/g, "") === k.toLowerCase()
            );
            if (hit && row[hit] !== undefined && row[hit] !== "") return String(row[hit]);
          }
          return "";
        };
        return {
          timestamp: g("timestamp", "date") || new Date().toISOString(),
          name: g("name", "fullname"),
          phone: g("phone", "mobile"),
          email: g("email"),
          location: g("location", "preferredlocation"),
          budget: g("budget", "budgetrange"),
          propertyInterest: g("propertyofinterest", "property", "propertyinterest"),
          message: g("message"),
          source: g("source") || "Google Sheet",
          synced: true,
        };
      });
      const added = importLeads(normalized);
      notify(
        added > 0
          ? `${added} new lead${added > 1 ? "s" : ""} imported from the Sheet.`
          : "Sheet is already in sync — no new leads.",
        true
      );
    } catch {
      notify("Could not reach the Sheet. Check SHEET_READ_URL & deployment access.", false);
    } finally {
      setSyncing(false);
    }
  }

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
          <button onClick={syncFromSheet} disabled={syncing} className="btn btn-primary !px-4 !py-2.5 text-[13px] disabled:opacity-70">
            <i className={`fa-solid ${syncing ? "fa-circle-notch fa-spin" : "fa-arrows-rotate"}`} />
            {syncing ? "Syncing…" : "Sync from Sheet"}
          </button>
          <button onClick={exportCsv} className="btn btn-ghost !px-4 !py-2.5 text-[13px]">
            <i className="fa-solid fa-file-csv text-brand-300" />
            Export CSV
          </button>
          {leads.length > 0 && (
            <button
              onClick={() => {
                if (confirmClear) {
                  clearLeads();
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

      {!CONFIG.SHEET_READ_URL && (
        <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-[12.5px] font-semibold text-amber-200">
          <i className="fa-solid fa-circle-info mt-0.5" />
          Sheet sync is off — SHEET_READ_URL in src/config.ts is empty. Leads below are
          captured locally in this browser. Follow the Setup Guide to connect the Google Sheet CRM.
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
            open Contact and send a sample inquiry, or press "Sync from Sheet" once configured.
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
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider ${
                          l.synced
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-brand-500/15 text-brand-300"
                        }`}
                      >
                        <i className={`fa-solid ${l.synced ? "fa-cloud-check" : "fa-database"} text-[9px]`} />
                        {l.synced ? "Sheet" : "Local"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => deleteLead(l.id)}
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
  beds: "3",
  baths: "2",
  sqm: "",
  parking: "1",
  type: "House & Lot",
  badge: "New Launch",
  tagline: "",
  img: IMAGE_CHOICES[0],
  customImg: "",
};

function PropertiesAdmin({ notify }: { notify: (msg: string, ok?: boolean) => void }) {
  const { properties, addProperty, deleteProperty, resetProperties, customCount, deletedCount } =
    useStore();
  const [f, setF] = useState(EMPTY_FORM);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const set = (k: keyof typeof EMPTY_FORM) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setF((p) => ({ ...p, [k]: e.target.value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || !f.price || !f.sqm) {
      notify("Name, price and floor area are required.", false);
      return;
    }
    addProperty({
      name: f.name.trim(),
      location: f.location,
      area: f.area.trim() || f.location,
      price: Number(f.price),
      priceNote: "TCP",
      beds: Number(f.beds) || 0,
      baths: Number(f.baths) || 0,
      sqm: Number(f.sqm),
      parking: Number(f.parking) || 0,
      type: f.type,
      badge: f.badge,
      tagline: f.tagline.trim() || "Newly listed by Dream Home Navigators — inquire for full unit details and viewing schedule.",
      img: f.customImg.trim() || f.img,
    });
    notify(`"${f.name.trim()}" is now live on the Properties page.`, true);
    setF(EMPTY_FORM);
  }

  const inputCls =
    "w-full rounded-lg border border-white/12 bg-white/[0.06] px-3.5 py-2.5 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-500/25";
  const labelCls = "mb-1.5 block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-400";

  return (
    <div className="animate-card-in grid gap-8 lg:grid-cols-5">
      {/* Add form */}
      <form onSubmit={submit} className="glass-panel-deep rounded-2xl p-6 lg:col-span-3 sm:p-7">
        <h2 className="font-display text-xl font-semibold text-white">
          <i className="fa-solid fa-plus mr-2.5 text-brand-300" />
          Add a Property
        </h2>
        <p className="mt-1.5 text-[12.5px] text-slate-400">
          Appears instantly on the Properties page (and Home, if Featured). Saved in this browser.
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
          <i className="fa-solid fa-house-circle-check" />
          Publish Listing
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
                    {p.id.startsWith("custom-") && (
                      <span className="rounded-full bg-brass-400/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-brass-300">
                        Added
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirmDelete === p.id) {
                      deleteProperty(p.id);
                      setConfirmDelete(null);
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
      {/* 1 — Google Sheet CRM */}
      <div className={stepCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={h3Cls}>
            <span className={numCls}>1</span>
            Connect the Google Sheet CRM (leads)
          </h3>
          <StatusDot ok={!!CONFIG.GOOGLE_SCRIPT_URL} />
        </div>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-300/90">
          Every inquiry from the Contact form is posted to a Google Sheet via Apps Script using{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">fetch</code>{" "}
          with <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">mode: "no-cors"</code>{" "}
          and <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">Content-Type: text/plain</code>{" "}
          — this avoids CORS preflight failures with Apps Script. Leads are also logged locally so the
          Dashboard works even before you connect the sheet.
        </p>
        <ol className={olCls}>
          <li className={liCls}>{tick}<span>Create a new Google Sheet and name it <b className="text-white">Dream Home Navigators — Leads</b>.</span></li>
          <li className={liCls}>{tick}<span>In the sheet, open <b className="text-white">Extensions → Apps Script</b>.</span></li>
          <li className={liCls}>{tick}<span>Delete the sample code, paste the script below, and press <b className="text-white">Save</b>. It auto-creates a "Leads" tab with headers on the first submission.</span></li>
          <li className={liCls}>{tick}<span>Click <b className="text-white">Deploy → New deployment → Web app</b>. Set <b className="text-white">Execute as: Me</b> and <b className="text-white">Who has access: Anyone</b>. Authorize when prompted.</span></li>
          <li className={liCls}>{tick}<span>Copy the <b className="text-white">Web App URL</b> and paste it into <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">GOOGLE_SCRIPT_URL</code> <i>and</i> <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">SHEET_READ_URL</code> in <b className="text-white">src/config.ts</b>.</span></li>
          <li className={liCls}>{tick}<span>Rebuild the site, then test with a sample inquiry — it should appear in the Sheet within seconds.</span></li>
        </ol>
        <CodeBlock code={APPS_SCRIPT} />
      </div>

      {/* 2 — Dashboard sync */}
      <div className={stepCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={h3Cls}>
            <span className={numCls}>2</span>
            Enable Dashboard → "Sync from Sheet"
          </h3>
          <StatusDot ok={!!CONFIG.SHEET_READ_URL} />
        </div>
        <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-slate-300/90">
          The same script above answers GET requests with all sheet rows as JSON. Once{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">SHEET_READ_URL</code>{" "}
          is set in src/config.ts, the Dashboard's <b className="text-white">Sync from Sheet</b> button
          pulls every lead (including ones entered manually into the sheet) and de-duplicates them
          against what's already shown.
        </p>
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

      {/* 4 — Admin & storage notes */}
      <div className={stepCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={h3Cls}>
            <span className={numCls}>4</span>
            Admin console & data notes
          </h3>
          <StatusDot ok />
        </div>
        <ul className={olCls}>
          <li className={liCls}>{tick}<span>Change the console passcode via <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">ADMIN_PASSCODE</code> in src/config.ts (current: <b className="text-white">{CONFIG.ADMIN_PASSCODE}</b>).</span></li>
          <li className={liCls}>{tick}<span>Added/removed properties and locally captured leads persist in the browser's <b className="text-white">localStorage</b> — ideal for a single-device demo, and instantly visible to visitors of that browser.</span></li>
          <li className={liCls}>{tick}<span>For a multi-user production setup, keep the Google Sheet as the source of truth: manage listings in a second "Properties" sheet tab, and leads sync here via the button in step 2.</span></li>
          <li className={liCls}>{tick}<span>Business email shown site-wide is set via <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-brand-200">EMAIL</code> in src/config.ts.</span></li>
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────── page shell ─────────────────────────── */

type Tab = "dashboard" | "properties" | "setup";

export default function Admin({ go }: { go: (p: Page) => void }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("dhn_admin") === "1");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3600);
  };

  if (!authed) {
    return (
      <Gate
        onUnlock={() => {
          sessionStorage.setItem("dhn_admin", "1");
          setAuthed(true);
        }}
      />
    );
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Leads Dashboard", icon: "fa-gauge-high" },
    { id: "properties", label: "Properties", icon: "fa-house" },
    { id: "setup", label: "Setup Guide", icon: "fa-plug" },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-5 pt-32 pb-6 sm:px-8 sm:pt-36">
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
            Manage listings, monitor the lead CRM, and configure integrations — without touching code.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button onClick={() => go("properties")} className="btn btn-ghost !px-4 !py-2.5 text-[13px]">
            <i className="fa-solid fa-eye text-brand-300" />
            View live site
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("dhn_admin");
              setAuthed(false);
            }}
            className="btn btn-ghost !px-4 !py-2.5 text-[13px]"
          >
            <i className="fa-solid fa-lock text-brand-300" />
            Lock
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
        {tab === "setup" && <SetupGuide />}
      </div>
    </section>
  );
}
