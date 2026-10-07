/**
 * Zentrale Stammdaten der Website.
 *
 * Alles, was sich über die Zeit ändern kann (Kontakt, Adresse, Profile),
 * wird ausschließlich hier gepflegt – Header, Footer, Kontaktbereich,
 * Impressum, Datenschutz und strukturierte Daten (SEO) lesen von hier.
 */
export const site = {
  brand: "ProjeXs",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.projexs.de",

  owner: {
    name: "Daniela Franzen",
    roles: {
      de: ["Projektleitung", "Programmmanagement", "Interim Management"],
      en: ["Project leadership", "Programme management", "Interim management"],
    },
  },

  contact: {
    email: "Daniela.Franzen@projexs.de",
    /** Anzeigeformat */
    phone: "+49 172 4020639",
    /** Für tel:-Links (ohne Leerzeichen) */
    phoneHref: "+491724020639",
    linkedin: "https://www.linkedin.com/in/daniela-franzen-8b927219b/",
  },

  /** Ladungsfähige Anschrift für Impressum & Datenschutzerklärung. */
  address: {
    street: "Sonnenkamp 2",
    zip: "21244",
    city: "Buchholz in der Nordheide",
    region: "Niedersachsen",
    country: "Deutschland",
    countryCode: "DE",
  },

  legal: {
    /** Umsatzsteuer-Identifikationsnummer gem. § 27a UStG – leer = wird nicht angezeigt. */
    vatId: "",
  },

  images: {
    hero: "/images/daniela-franzen-hero.jpg",
    portrait: "/images/daniela-franzen-portrait.jpg",
    golive: "/images/daniela-franzen-golive.jpg",
    avatar: "/images/daniela-franzen-avatar.jpg",
  },
} as const;

export type Site = typeof site;
