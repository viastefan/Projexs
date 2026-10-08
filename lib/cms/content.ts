import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { de } from "@/content/de";
import { en } from "@/content/en";
import { site, type Site } from "@/content/site";
import type { Dictionary } from "@/lib/i18n";
import { isStorageConfigured, readJson, updateJson } from "@/lib/storage";
import { CONTENT_SECTIONS, SITE_FIELDS, type FieldDef } from "./content-schema";
import { PATHS } from "./types";

/**
 * Inhalts-Overrides: Was Daniela in der App ändert, liegt als JSON im
 * privaten Speicher — je Sprache eine Datei mit Pfad → Wert. Die Standardtexte
 * bleiben im Code (`content/de.ts`, `content/en.ts`); beim Rendern werden die
 * Overrides darübergelegt. „Zurücksetzen“ löscht einfach den Eintrag.
 */

export type Locale = "de" | "en";

/** Pfad → Wert, z. B. `{ "hero.titleLead": "…", "faq.items": [...] }`. */
export type ContentOverrides = Record<string, unknown>;

interface OverridesDoc {
  version: 1;
  updatedAt?: string;
  values: ContentOverrides;
}

export const CONTENT_TAG = "content";

const DEFAULTS: Record<Locale, Dictionary> = { de, en };

/* ------------------------------------------------------------ Pfade -- */

export function getPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current === null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function setPath<T>(target: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const root = Array.isArray(target) ? [...(target as unknown[])] : { ...(target as object) };
  let node: Record<string, unknown> = root as Record<string, unknown>;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = node[key];
    const copy = Array.isArray(next) ? [...next] : next && typeof next === "object" ? { ...next } : {};
    node[key] = copy;
    node = copy as Record<string, unknown>;
  }
  node[keys[keys.length - 1]] = value;
  return root as T;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Overrides auf ein Wörterbuch (oder die Stammdaten) legen.
 *
 * Erlaubt sind beide Formen: Pfad-Schlüssel (`"hero.lead": "…"`) und
 * verschachtelte Objekte, die tief zusammengeführt werden. Überschrieben
 * werden nur Strings, Zahlen und Arrays — Objekte werden gemischt, damit
 * ein Override nie Felder löscht, die die Komponenten brauchen.
 */
export function applyOverrides<T>(base: T, overrides: ContentOverrides | null | undefined): T {
  if (!overrides) return base;
  let result = base;
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) continue;
    if (key.includes(".")) {
      if (getPath(result, key) !== undefined) result = setPath(result, key, value);
      continue;
    }
    const current = (result as Record<string, unknown>)[key];
    if (current === undefined) continue;
    if (isPlainObject(current) && isPlainObject(value)) {
      result = setPath(result, key, applyOverrides(current, value));
    } else if (typeof value === "string" || typeof value === "number" || Array.isArray(value)) {
      result = setPath(result, key, value);
    }
  }
  return result;
}

/* ------------------------------------------------------- Prüfung -- */

function coerce(field: FieldDef, value: unknown): unknown {
  switch (field.kind) {
    case "text":
    case "textarea": {
      if (typeof value !== "string") throw new Error(`${field.label}: Text erwartet.`);
      const max = field.kind === "text" ? 400 : 8000;
      return (field.kind === "text" ? value.replace(/[\r\n]+/g, " ") : value.replace(/\r\n/g, "\n")).trim().slice(0, max);
    }
    case "number": {
      const number = typeof value === "number" ? value : Number(String(value).replace(",", "."));
      if (!Number.isFinite(number)) throw new Error(`${field.label}: Zahl erwartet.`);
      return number;
    }
    case "strings": {
      if (!Array.isArray(value)) throw new Error(`${field.label}: Liste erwartet.`);
      return value
        .map((entry) => (typeof entry === "string" ? entry.replace(/\r\n/g, "\n").trim().slice(0, 1000) : ""))
        .filter((entry) => entry.length > 0)
        .slice(0, 100);
    }
    case "items": {
      if (!Array.isArray(value)) throw new Error(`${field.label}: Liste erwartet.`);
      return value.slice(0, 100).map((entry) => {
        if (!isPlainObject(entry)) throw new Error(`${field.label}: Eintrag unvollständig.`);
        const clean: Record<string, unknown> = {};
        for (const sub of field.item ?? []) {
          const raw = entry[sub.path];
          clean[sub.path] = raw === undefined ? emptyValue(sub) : coerce(sub, raw);
        }
        return clean;
      });
    }
  }
}

export function emptyValue(field: FieldDef): unknown {
  switch (field.kind) {
    case "number":
      return 0;
    case "strings":
    case "items":
      return [];
    default:
      return "";
  }
}

export function allContentFields(): FieldDef[] {
  return CONTENT_SECTIONS.flatMap((section) => section.fields);
}

/** Eingaben aus der App prüfen; unbekannte Pfade werden verworfen. */
export function sanitizeOverrides(input: unknown, fields: FieldDef[]): ContentOverrides {
  if (!isPlainObject(input)) throw new Error("Ungültige Daten.");
  const byPath = new Map(fields.map((field) => [field.path, field]));
  const clean: ContentOverrides = {};
  for (const [path, value] of Object.entries(input)) {
    const field = byPath.get(path);
    if (!field) continue;
    clean[path] = coerce(field, value);
  }
  return clean;
}

/* ------------------------------------------------------- Speicher -- */

async function readOverridesDoc(pathname: string): Promise<OverridesDoc> {
  const doc = await readJson<OverridesDoc>(pathname);
  return doc && isPlainObject(doc.values) ? doc : { version: 1, values: {} };
}

const cachedContent = unstable_cache(
  async (locale: Locale): Promise<ContentOverrides> => (await readOverridesDoc(PATHS.content(locale))).values,
  ["content-overrides-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

const cachedSite = unstable_cache(
  async (): Promise<ContentOverrides> => (await readOverridesDoc(PATHS.siteOverrides)).values,
  ["site-overrides-v1"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

/** Gespeicherte Abweichungen von den Standardtexten (serverseitig, gecacht). */
export async function getContentOverrides(locale: Locale): Promise<ContentOverrides> {
  if (!isStorageConfigured()) return {};
  try {
    return await cachedContent(locale);
  } catch (error) {
    console.error("[Inhalte] Overrides nicht lesbar:", error);
    return {};
  }
}

export async function getSiteOverrides(): Promise<ContentOverrides> {
  if (!isStorageConfigured()) return {};
  try {
    return await cachedSite();
  } catch (error) {
    console.error("[Inhalte] Stammdaten-Overrides nicht lesbar:", error);
    return {};
  }
}

/** Ungecacht — für den Editor in der App, der immer den frischen Stand braucht. */
export async function getContentOverridesFresh(locale: Locale): Promise<{ values: ContentOverrides; updatedAt?: string }> {
  const doc = await readOverridesDoc(PATHS.content(locale));
  return { values: doc.values, updatedAt: doc.updatedAt };
}

export async function getSiteOverridesFresh(): Promise<{ values: ContentOverrides; updatedAt?: string }> {
  const doc = await readOverridesDoc(PATHS.siteOverrides);
  return { values: doc.values, updatedAt: doc.updatedAt };
}

/**
 * Overrides speichern: `changes` ersetzt die Einträge der genannten Pfade;
 * `reset` entfernt Pfade (zurück auf den Standardtext). Wo ein Wert dem
 * Standard gleicht, wird gar nichts gespeichert.
 */
export async function saveContentOverrides(
  locale: Locale,
  changes: ContentOverrides,
  reset: string[] = [],
): Promise<ContentOverrides> {
  const defaults = DEFAULTS[locale];
  const doc = await updateJson<OverridesDoc>(PATHS.content(locale), () => ({ version: 1, values: {} }), (current) => {
    const values = { ...current.values };
    for (const path of reset) delete values[path];
    for (const [path, value] of Object.entries(changes)) {
      if (JSON.stringify(value) === JSON.stringify(getPath(defaults, path))) delete values[path];
      else values[path] = value;
    }
    return { version: 1, updatedAt: new Date().toISOString(), values };
  });
  refreshContent();
  return doc.values;
}

export async function saveSiteOverrides(changes: ContentOverrides, reset: string[] = []): Promise<ContentOverrides> {
  const doc = await updateJson<OverridesDoc>(PATHS.siteOverrides, () => ({ version: 1, values: {} }), (current) => {
    const values = { ...current.values };
    for (const path of reset) delete values[path];
    for (const [path, value] of Object.entries(changes)) {
      if (JSON.stringify(value) === JSON.stringify(getPath(site, path))) delete values[path];
      else values[path] = value;
    }
    return { version: 1, updatedAt: new Date().toISOString(), values };
  });
  refreshContent();
  return doc.values;
}

/** Nach jeder Änderung: Daten als veraltet markieren und alle Seiten neu erzeugen lassen. */
export function refreshContent(): void {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------- Auflösen -- */

/** Stammdaten ohne `as const`-Enge, damit Overrides hineinpassen. */
export type ResolvedSite = {
  -readonly [K in keyof Site]: Site[K] extends object ? { -readonly [P in keyof Site[K]]: Site[K][P] } : Site[K];
};

/**
 * Wörterbuch und Stammdaten für eine Sprache — Standardtexte plus die in der
 * App gespeicherten Änderungen. Für die Layouts `app/(de)` und `app/(en)`.
 */
export async function resolveDictionary(locale: Locale): Promise<{ dict: Dictionary; site: ResolvedSite }> {
  const [content, siteOverrides] = await Promise.all([getContentOverrides(locale), getSiteOverrides()]);
  return {
    dict: applyOverrides(DEFAULTS[locale], content),
    site: applyOverrides(site as unknown as ResolvedSite, siteOverrides),
  };
}

export { CONTENT_SECTIONS, SITE_FIELDS };
