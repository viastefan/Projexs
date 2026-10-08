import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Dictionary } from "@/lib/i18n";

type PageKey = "home" | "contact" | "imprint" | "privacy" | "terms";

const paths: Record<PageKey, { de: string; en: string }> = {
  home: { de: "/", en: "/en" },
  contact: { de: "/kontakt", en: "/en/contact" },
  imprint: { de: "/impressum", en: "/en/legal-notice" },
  privacy: { de: "/datenschutz", en: "/en/privacy" },
  terms: { de: "/agb", en: "/agb" },
};

/** Titel-Suffix für alle Unterseiten, z. B. „Kontakt | ProjeXs – Daniela Franzen“. */
export const titleSuffix = `${site.brand} – ${site.owner.name}`;

/** Gemeinsame Metadaten für das Layout einer Sprache (Titel-Template, Icons, Format-Erkennung). */
export function buildLayoutMetadata(dict: Dictionary): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: dict.meta.title, template: `%s | ${titleSuffix}` },
    description: dict.meta.description,
    applicationName: site.brand,
    authors: [{ name: site.owner.name, url: site.url }],
    creator: site.owner.name,
    publisher: site.brand,
    category: "business",
    formatDetection: { telephone: false, email: false, address: false },
    referrer: "strict-origin-when-cross-origin",
  };
}

/**
 * Metadaten pro Seite. Für Unterseiten `title` kurz angeben („Kontakt“) –
 * das Template aus dem Layout ergänzt den Markennamen.
 */
export function buildMetadata(
  dict: Dictionary,
  page: PageKey,
  overrides: { title?: string; description?: string; noindex?: boolean } = {},
): Metadata {
  const locale = dict.locale as "de" | "en";
  const path = paths[page][locale];
  const title = page === "home" ? { absolute: dict.meta.title } : (overrides.title ?? dict.meta.title);
  const fullTitle = page === "home" ? dict.meta.title : `${overrides.title ?? dict.meta.title} | ${titleSuffix}`;
  const description = overrides.description ?? dict.meta.description;
  const noindex = Boolean(overrides.noindex);

  return {
    title,
    description,
    keywords: page === "home" ? dict.meta.keywords : undefined,
    alternates: {
      canonical: path,
      languages:
        page === "terms"
          ? { "de-DE": paths.terms.de, "x-default": paths.terms.de }
          : { "de-DE": paths[page].de, "en-GB": paths[page].en, en: paths[page].en, "x-default": paths[page].de },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.brand,
      title: fullTitle,
      description,
      locale: dict.ogLocale,
      alternateLocale: locale === "de" ? ["en_GB"] : ["de_DE"],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}
