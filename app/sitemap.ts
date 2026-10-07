import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  const lastModified = new Date();

  const pairs = [
    { de: "/", en: "/en", priority: 1, changeFrequency: "monthly" as const },
    { de: "/impressum", en: "/en/legal-notice", priority: 0.3, changeFrequency: "yearly" as const },
    { de: "/datenschutz", en: "/en/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return [
    ...pairs.flatMap((p) =>
      (["de", "en"] as const).map((lang) => ({
        url: url(p[lang]),
        lastModified,
        changeFrequency: p.changeFrequency,
        priority: lang === "de" ? p.priority : p.priority * 0.9,
        alternates: { languages: { "de-DE": url(p.de), en: url(p.en) } },
      })),
    ),
    { url: url("/agb"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
