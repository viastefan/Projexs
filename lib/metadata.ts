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

export function buildMetadata(
  dict: Dictionary,
  page: PageKey,
  overrides: { title?: string; description?: string; noindex?: boolean } = {},
): Metadata {
  const locale = dict.locale as "de" | "en";
  const path = paths[page][locale];
  const title = overrides.title ?? dict.meta.title;
  const description = overrides.description ?? dict.meta.description;

  return {
    metadataBase: new URL(site.url),
    title,
    description,
    keywords: page === "home" ? dict.meta.keywords : undefined,
    applicationName: site.brand,
    authors: [{ name: site.owner.name, url: site.url }],
    creator: site.owner.name,
    alternates: {
      canonical: path,
      languages:
        page === "terms"
          ? undefined
          : { "de-DE": paths[page].de, en: paths[page].en, "x-default": paths[page].de },
    },
    openGraph: {
      type: "website",
      url: path,
      siteName: site.brand,
      title,
      description,
      locale: dict.ogLocale,
      alternateLocale: locale === "de" ? ["en_GB"] : ["de_DE"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: overrides.noindex ? { index: false, follow: true } : { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}
