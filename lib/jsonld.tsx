import { site } from "@/content/site";
import type { Dictionary } from "@/lib/i18n";

export type JsonLdPage = "home" | "contact" | "imprint" | "privacy" | "terms";

/** Ungefähre Koordinaten des Standorts (Buchholz in der Nordheide) für LocalBusiness-Daten. */
const GEO = { latitude: 53.3286, longitude: 9.868 };

const abs = (path: string) => new URL(path, site.url).toString();

/**
 * Strukturierte Daten (schema.org) für Suchmaschinen und KI-Assistenten:
 * Organisation (ProfessionalService) mit Adresse, Geo, Kontaktpunkt und Leistungen,
 * Person, WebSite, Breadcrumbs und – auf der Startseite – FAQ.
 */
export function buildJsonLd(dict: Dictionary, page: JsonLdPage = "home") {
  const isDe = dict.locale === "de";
  const home = abs(dict.routes.home);
  const personId = `${site.url}/#daniela-franzen`;
  const orgId = `${site.url}/#projexs`;
  const websiteId = `${site.url}/#website`;

  const pagePath: Record<JsonLdPage, string> = {
    home: dict.routes.home,
    contact: dict.routes.contact,
    imprint: dict.routes.imprint,
    privacy: dict.routes.privacy,
    terms: dict.routes.terms,
  };
  const pageName: Record<JsonLdPage, string> = {
    home: isDe ? "Startseite" : "Home",
    contact: dict.contactPage.eyebrow,
    imprint: dict.footer.imprint,
    privacy: dict.footer.privacy,
    terms: dict.footer.terms,
  };

  const services = dict.services.roles.map((role, i) => ({
    "@type": "Service",
    "@id": `${home}#service-${i + 1}`,
    name: role.title,
    description: role.text,
    serviceType: role.title,
    provider: { "@id": orgId },
    areaServed: ["DE", "AT", "CH", "EU"],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: abs(dict.routes.contact),
      availableLanguage: ["de", "en"],
    },
    url: `${home}#${dict.ids.services}`,
  }));

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: pageName.home, item: home },
      ...(page === "home" ? [] : [{ "@type": "ListItem", position: 2, name: pageName[page], item: abs(pagePath[page]) }]),
    ],
  };

  const graph: unknown[] = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: site.url,
      name: site.brand,
      alternateName: `${site.brand} – ${site.owner.name}`,
      inLanguage: ["de-DE", "en"],
      publisher: { "@id": orgId },
    },
    {
      "@type": ["ProfessionalService", "LocalBusiness"],
      "@id": orgId,
      name: site.brand,
      legalName: `${site.brand} – ${site.owner.name}`,
      url: home,
      description: dict.meta.description,
      email: site.contact.email,
      telephone: site.contact.phoneHref,
      image: abs(site.images.hero),
      logo: abs("/icon.svg"),
      founder: { "@id": personId },
      employee: { "@id": personId },
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.zip,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.countryCode,
      },
      geo: { "@type": "GeoCoordinates", ...GEO },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${site.address.street}, ${site.address.zip} ${site.address.city}`)}`,
      areaServed: [
        { "@type": "City", name: "Hamburg" },
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Austria" },
        { "@type": "Country", name: "Switzerland" },
        { "@type": "Place", name: "Europe" },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: isDe ? "Anfragen" : "enquiries",
          telephone: site.contact.phoneHref,
          email: site.contact.email,
          availableLanguage: ["de", "en"],
          areaServed: ["DE", "AT", "CH", "EU"],
        },
      ],
      knowsAbout: isDe
        ? ["SAP S/4HANA", "SAP Projektmanagement", "SAP Programmmanagement", "SAP Template Rollout", "Interim Management", "IT-Krisenmanagement", "SAP SD", "SAP MM"]
        : ["SAP S/4HANA", "SAP project management", "SAP programme management", "SAP template rollout", "Interim management", "IT crisis management", "SAP SD", "SAP MM"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: dict.services.eyebrow,
        itemListElement: services.map((s) => ({ "@type": "Offer", itemOffered: { "@id": s["@id"] } })),
      },
      sameAs: [site.contact.linkedin],
      inLanguage: dict.htmlLang,
    },
    ...services,
    {
      "@type": "Person",
      "@id": personId,
      name: site.owner.name,
      givenName: "Daniela",
      familyName: "Franzen",
      jobTitle: isDe ? "SAP-Programm- und Projektmanagerin" : "SAP Programme & Project Manager",
      worksFor: { "@id": orgId },
      email: site.contact.email,
      telephone: site.contact.phoneHref,
      image: abs(site.images.portrait),
      url: home,
      sameAs: [site.contact.linkedin],
      address: {
        "@type": "PostalAddress",
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.countryCode,
      },
      knowsLanguage: ["de", "en"],
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", name: "Project Management Professional (PMP)", credentialCategory: "certification" },
        { "@type": "EducationalOccupationalCredential", name: "Professional Scrum Master I (PSM I)", credentialCategory: "certification" },
        { "@type": "EducationalOccupationalCredential", name: "SAP Certified – Materials Management (MM)", credentialCategory: "certification" },
      ],
    },
    breadcrumb,
    {
      "@type": "WebPage",
      "@id": `${abs(pagePath[page])}#webpage`,
      url: abs(pagePath[page]),
      name: page === "home" ? dict.meta.title : pageName[page],
      isPartOf: { "@id": websiteId },
      about: { "@id": orgId },
      inLanguage: dict.htmlLang,
      breadcrumb,
    },
  ];

  if (page === "home") {
    graph.push({
      "@type": "FAQPage",
      mainEntity: dict.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // JSON wird serverseitig erzeugt; "<" wird maskiert, um Script-Injection auszuschließen.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
