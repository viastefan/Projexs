import { de, type Dictionary } from "@/content/de";
import { en } from "@/content/en";

export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];

const dictionaries: Record<Locale, Dictionary> = { de, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };

/** Seitenpaare DE ↔ EN für den Sprachumschalter und hreflang. */
export const pagePairs: Array<{ de: string; en: string }> = [
  { de: "/", en: "/en" },
  { de: "/kontakt", en: "/en/contact" },
  { de: "/impressum", en: "/en/legal-notice" },
  { de: "/datenschutz", en: "/en/privacy" },
  { de: "/agb", en: "/en" },
];

export function alternatePath(pathname: string, target: Locale): string {
  const pair = pagePairs.find((p) => p.de === pathname || p.en === pathname);
  if (pair) return pair[target];
  return target === "de" ? "/" : "/en";
}
