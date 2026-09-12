import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import {
  AboutContent,
  ABOUT_SEED,
  FEATURED_ID,
  Property,
  PROPERTIES,
  RENTAL_PROPERTIES,
  ServiceItem,
  SERVICE_SEED,
} from "./data";
import { supabase } from "./supabase";

/* ────────────────────────────────────────────────────────────────────────────
   Store — Supabase-backed content + leads.
   - Properties, rentals, services and page content (about / featured) live in
     Supabase (public READ, admin WRITE). They are seeded from src/data.ts, and
     data.ts is also used as an instant first-paint + offline fallback.
   - Content mutators are OPTIMISTIC: they update local state immediately (so the
     Owner Console feels instant and keeps the same synchronous API) and persist
     to Supabase in the background, so edits become live for every visitor.
   - Leads: inserted into the Supabase `leads` table (RLS: anon insert-only);
     a localStorage queue is only an offline fallback when an insert fails.
   ──────────────────────────────────────────────────────────────────────────── */

export interface Lead {
  id: string;
  timestamp: string; // ISO string, mapped from Supabase created_at
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  propertyInterest: string;
  message: string;
  source: string;
}

const LS_LEADS = "dhn_leads_v1";

export interface SiteBackupData {
  version: string;
  exportedAt: string;
  source: string;
  customProperties: Property[]; // all for-sale listings
  deletedProperties: string[]; // retained for backup-format compatibility
  customRentals: Property[]; // all rental listings
  deletedRentals: string[]; // retained for backup-format compatibility
  leads: Lead[];
  services: ServiceItem[];
  about: AboutContent;
  featuredId: string | null;
}

/* ── seeds (also the offline fallback) ── */
const SEED_SALE: Property[] = PROPERTIES.map((p) => ({ ...p, category: "sale" as const }));
const SEED_RENTAL: Property[] = RENTAL_PROPERTIES.map((p) => ({
  ...p,
  category: "rental" as const,
  isRental: true,
}));

interface PropRow { id: string; category: "sale" | "rental"; sort: number; data: Property }
interface SvcRow { id: string; sort: number; data: ServiceItem }
interface ContentRow { key: string; data: unknown }
interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  property_interest: string;
  message: string;
  source: string;
}

function rowToLead(r: LeadRow): Lead {
  return {
    id: r.id,
    timestamp: r.created_at,
    name: r.name ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    location: r.location ?? "",
    budget: r.budget ?? "",
    propertyInterest: r.property_interest ?? "",
    message: r.message ?? "",
    source: r.source ?? "",
  };
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — run in-memory */
  }
}

/** Fire a Supabase write in the background; log (don't throw) on failure. */
function bg(p: PromiseLike<{ error: unknown }>, label: string) {
  Promise.resolve(p).then(({ error }) => {
    if (error) console.warn(`[DHN] ${label} failed to persist:`, error);
  });
}

interface StoreValue {
  properties: Property[];
  rentalProperties: Property[];
  customCount: number;
  deletedCount: number;
  rentalCustomCount: number;
  rentalDeletedCount: number;
  editedIds: string[];
  rentalEditedIds: string[];
  addProperty: (p: Omit<Property, "id">) => Property;
  updateProperty: (p: Property) => void;
  deleteProperty: (id: string) => void;
  resetProperties: () => void;
  addRentalProperty: (p: Omit<Property, "id">) => Property;
  updateRentalProperty: (p: Property) => void;
  deleteRentalProperty: (id: string) => void;
  resetRentalProperties: () => void;
  featuredId: string | null;
  setFeatured: (id: string | null) => void;
  leads: Lead[];
  refreshLeads: () => Promise<{ ok: boolean; error?: string }>;
  addLead: (l: Omit<Lead, "id" | "timestamp">) => Promise<{ ok: boolean }>;
  deleteLead: (id: string) => Promise<void>;
  clearLeads: () => Promise<void>;
  services: ServiceItem[];
  addService: (s: Omit<ServiceItem, "id">) => void;
  updateService: (s: ServiceItem) => void;
  deleteService: (id: string) => void;
  resetServices: () => void;
  about: AboutContent;
  updateAbout: (a: AboutContent) => void;
  resetAbout: () => void;
  createBackup: () => SiteBackupData;
  restoreBackup: (data: SiteBackupData) => { ok: boolean; message: string };
  resetAllToFactory: () => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // Seed-first so the public site paints listings instantly; refreshed from
  // Supabase on mount (loadContent below).
  const [propRows, setPropRows] = useState<Property[]>(() => [...SEED_SALE, ...SEED_RENTAL]);
  const [services, setServices] = useState<ServiceItem[]>(SERVICE_SEED);
  const [about, setAbout] = useState<AboutContent>(ABOUT_SEED);
  const [featuredId, setFeaturedId] = useState<string | null>(FEATURED_ID);
  const [leads, setLeads] = useState<Lead[]>([]);

  // Load shared content from Supabase (public read). Falls back to seeds on error.
  useEffect(() => {
    let active = true;
    (async () => {
      const [pRes, sRes, cRes] = await Promise.all([
        supabase.from("properties").select("*").order("category").order("sort"),
        supabase.from("services").select("*").order("sort"),
        supabase.from("site_content").select("*"),
      ]);
      if (!active) return;
      if (!pRes.error && pRes.data && pRes.data.length) {
        setPropRows(
          (pRes.data as PropRow[]).map((r) => ({ ...r.data, id: r.id, category: r.category }))
        );
      }
      if (!sRes.error && sRes.data && sRes.data.length) {
        setServices((sRes.data as SvcRow[]).map((r) => ({ ...r.data, id: r.id })));
      }
      if (!cRes.error && cRes.data) {
        const rows = cRes.data as ContentRow[];
        const a = rows.find((r) => r.key === "about")?.data as AboutContent | undefined;
        const feat = rows.find((r) => r.key === "featured")?.data as { id: string } | undefined;
        if (a) setAbout(a);
        if (feat && typeof feat.id === "string") setFeaturedId(feat.id);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const properties = useMemo(() => propRows.filter((p) => p.category !== "rental"), [propRows]);
  const rentalProperties = useMemo(() => propRows.filter((p) => p.category === "rental"), [propRows]);

  const insertProp = (p: Property, sort: number) =>
    bg(supabase.from("properties").insert({ id: p.id, category: p.category ?? "sale", sort, data: p }), "add listing");
  const updateProp = (p: Property) =>
    bg(supabase.from("properties").update({ category: p.category ?? "sale", data: p }).eq("id", p.id), "update listing");

  const value: StoreValue = {
    properties,
    rentalProperties,
    customCount: properties.filter((p) => p.id.startsWith("custom-")).length,
    deletedCount: 0,
    rentalCustomCount: rentalProperties.filter((p) => p.id.startsWith("custom-rent-")).length,
    rentalDeletedCount: 0,
    editedIds: [],
    rentalEditedIds: [],

    addProperty: (p) => {
      const created: Property = { ...p, id: `custom-${uuid().slice(0, 8)}`, category: "sale" };
      setPropRows((rows) => [...rows, created]);
      insertProp(created, Math.floor(Date.now() / 1000));
      return created;
    },
    updateProperty: (p) => {
      const enriched: Property = { ...p, category: "sale" };
      setPropRows((rows) => rows.map((x) => (x.id === p.id ? enriched : x)));
      updateProp(enriched);
    },
    deleteProperty: (id) => {
      setPropRows((rows) => rows.filter((x) => x.id !== id));
      bg(supabase.from("properties").delete().eq("id", id), "delete listing");
    },
    resetProperties: () => {
      setPropRows((rows) => [...SEED_SALE, ...rows.filter((r) => r.category === "rental")]);
      void (async () => {
        await supabase.from("properties").delete().eq("category", "sale");
        bg(
          supabase.from("properties").insert(SEED_SALE.map((p, i) => ({ id: p.id, category: "sale", sort: i, data: p }))),
          "reseed for-sale"
        );
      })();
    },

    addRentalProperty: (p) => {
      const created: Property = { ...p, id: `custom-rent-${uuid().slice(0, 8)}`, category: "rental", isRental: true };
      setPropRows((rows) => [...rows, created]);
      insertProp(created, Math.floor(Date.now() / 1000));
      return created;
    },
    updateRentalProperty: (p) => {
      const enriched: Property = { ...p, category: "rental", isRental: true };
      setPropRows((rows) => rows.map((x) => (x.id === p.id ? enriched : x)));
      updateProp(enriched);
    },
    deleteRentalProperty: (id) => {
      setPropRows((rows) => rows.filter((x) => x.id !== id));
      bg(supabase.from("properties").delete().eq("id", id), "delete rental");
    },
    resetRentalProperties: () => {
      setPropRows((rows) => [...rows.filter((r) => r.category !== "rental"), ...SEED_RENTAL]);
      void (async () => {
        await supabase.from("properties").delete().eq("category", "rental");
        bg(
          supabase.from("properties").insert(SEED_RENTAL.map((p, i) => ({ id: p.id, category: "rental", sort: i, data: p }))),
          "reseed rentals"
        );
      })();
    },

    featuredId,
    setFeatured: (id) => {
      setFeaturedId(id);
      bg(supabase.from("site_content").upsert({ key: "featured", data: { id } }), "set featured");
    },

    leads,
    refreshLeads: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return { ok: false, error: error.message };
      setLeads((data as LeadRow[]).map(rowToLead));
      return { ok: true };
    },
    addLead: async (l) => {
      const row = {
        name: l.name,
        phone: l.phone,
        email: l.email,
        location: l.location,
        budget: l.budget,
        property_interest: l.propertyInterest,
        message: l.message,
        source: l.source,
      };
      const { error } = await supabase.from("leads").insert(row);
      if (error) {
        const pending = read<Lead[]>(LS_LEADS, []);
        const fallback: Lead = { ...l, id: uuid(), timestamp: new Date().toISOString() };
        write(LS_LEADS, [fallback, ...pending]);
        return { ok: false };
      }
      return { ok: true };
    },
    deleteLead: async (id) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (!error) setLeads((ls) => ls.filter((l) => l.id !== id));
    },
    clearLeads: async () => {
      const { error } = await supabase
        .from("leads")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (!error) setLeads([]);
    },

    /* ── Services ── */
    services,
    addService: (s) => {
      const created: ServiceItem = { ...s, id: `svc-${uuid().slice(0, 8)}` };
      setServices((sv) => [...sv, created]);
      bg(supabase.from("services").insert({ id: created.id, sort: Math.floor(Date.now() / 1000), data: created }), "add service");
    },
    updateService: (s) => {
      setServices((sv) => sv.map((x) => (x.id === s.id ? s : x)));
      bg(supabase.from("services").update({ data: s }).eq("id", s.id), "update service");
    },
    deleteService: (id) => {
      setServices((sv) => sv.filter((x) => x.id !== id));
      bg(supabase.from("services").delete().eq("id", id), "delete service");
    },
    resetServices: () => {
      setServices(SERVICE_SEED);
      void (async () => {
        await supabase.from("services").delete().neq("id", "");
        bg(
          supabase.from("services").insert(SERVICE_SEED.map((s, i) => ({ id: s.id, sort: i, data: s }))),
          "reseed services"
        );
      })();
    },

    /* ── About ── */
    about,
    updateAbout: (a) => {
      setAbout(a);
      bg(supabase.from("site_content").upsert({ key: "about", data: a }), "update about");
    },
    resetAbout: () => {
      setAbout(ABOUT_SEED);
      bg(supabase.from("site_content").upsert({ key: "about", data: ABOUT_SEED }), "reset about");
    },

    /* ── Backup & restore ── */
    createBackup: (): SiteBackupData => ({
      version: "2.0",
      exportedAt: new Date().toISOString(),
      source: "Dream Home Navigators Owner Console",
      customProperties: properties,
      deletedProperties: [],
      customRentals: rentalProperties,
      deletedRentals: [],
      leads,
      services,
      about,
      featuredId,
    }),
    restoreBackup: (data: SiteBackupData) => {
      try {
        if (!data || typeof data !== "object") {
          return { ok: false, message: "Invalid backup data format." };
        }
        const sale = Array.isArray(data.customProperties)
          ? data.customProperties.map((p) => ({ ...p, category: "sale" as const }))
          : SEED_SALE;
        const rental = Array.isArray(data.customRentals)
          ? data.customRentals.map((p) => ({ ...p, category: "rental" as const, isRental: true }))
          : SEED_RENTAL;
        setPropRows([...sale, ...rental]);
        if (Array.isArray(data.services)) setServices(data.services);
        if (data.about && typeof data.about === "object") setAbout(data.about);
        if (data.featuredId !== undefined) setFeaturedId(data.featuredId);

        // Publish the restored content to Supabase so it is live for everyone.
        void (async () => {
          await supabase.from("properties").delete().neq("id", "");
          bg(
            supabase.from("properties").insert(
              [...sale, ...rental].map((p, i) => ({ id: p.id, category: p.category ?? "sale", sort: i, data: p }))
            ),
            "restore listings"
          );
          if (Array.isArray(data.services)) {
            await supabase.from("services").delete().neq("id", "");
            bg(supabase.from("services").insert(data.services.map((s, i) => ({ id: s.id, sort: i, data: s }))), "restore services");
          }
          if (data.about) bg(supabase.from("site_content").upsert({ key: "about", data: data.about }), "restore about");
          if (data.featuredId !== undefined) bg(supabase.from("site_content").upsert({ key: "featured", data: { id: data.featuredId } }), "restore featured");
        })();

        return {
          ok: true,
          message: `Backup restored and published (exported: ${new Date(data.exportedAt || Date.now()).toLocaleDateString()}).`,
        };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : "Failed to restore backup.",
        };
      }
    },
    resetAllToFactory: () => {
      setPropRows([...SEED_SALE, ...SEED_RENTAL]);
      setServices(SERVICE_SEED);
      setAbout(ABOUT_SEED);
      setFeaturedId(FEATURED_ID);
      // Leads are NOT reset here — they live in Supabase, not local content.
      void (async () => {
        await supabase.from("properties").delete().neq("id", "");
        bg(
          supabase.from("properties").insert(
            [...SEED_SALE, ...SEED_RENTAL].map((p, i) => ({ id: p.id, category: p.category ?? "sale", sort: i, data: p }))
          ),
          "factory reset listings"
        );
        await supabase.from("services").delete().neq("id", "");
        bg(supabase.from("services").insert(SERVICE_SEED.map((s, i) => ({ id: s.id, sort: i, data: s }))), "factory reset services");
        bg(supabase.from("site_content").upsert({ key: "about", data: ABOUT_SEED }), "factory reset about");
        bg(supabase.from("site_content").upsert({ key: "featured", data: { id: FEATURED_ID } }), "factory reset featured");
      })();
    },
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
