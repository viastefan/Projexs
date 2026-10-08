import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Stand der Inhalte je Seite – beim Überarbeiten der Texte anpassen. */
const CONTENT_UPDATED = new Date("2026-10-08");
const LEGAL_UPDATED = new Date("2026-10-01");

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();

  const pairs = [
    { de: "/", en: "/en", priority: 1, changeFrequency: "weekly" as const, lastModified: CONTENT_UPDATED },
    { de: "/kontakt", en: "/en/contact", priority: 0.9, changeFrequency: "monthly" as const, lastModified: CONTENT_UPDATED },
    { de: "/impressum", en: "/en/legal-notice", priority: 0.3, changeFrequency: "yearly" as const, lastModified: LEGAL_UPDATED },
    { de: "/datenschutz", en: "/en/privacy", priority: 0.3, changeFrequency: "yearly" as const, lastModified: LEGAL_UPDATED },
  ];

  return [
    ...pairs.flatMap((p) =>
      (["de", "en"] as const).map((lang) => ({
        url: url(p[lang]),
        lastModified: p.lastModified,
        changeFrequency: p.changeFrequency,
        priority: lang === "de" ? p.priority : Math.round(p.priority * 0.9 * 100) / 100,
        alternates: { languages: { "de-DE": url(p.de), "en-GB": url(p.en), "x-default": url(p.de) } },
      })),
    ),
    { url: url("/agb"), lastModified: LEGAL_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
