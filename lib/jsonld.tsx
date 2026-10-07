import { site } from "@/content/site";
import type { Dictionary } from "@/lib/i18n";

/** Strukturierte Daten (schema.org) für Suchmaschinen und KI-Assistenten. */
export function buildJsonLd(dict: Dictionary) {
  const url = new URL(dict.routes.home, site.url).toString();
  const personId = `${site.url}/#daniela-franzen`;
  const orgId = `${site.url}/#projexs`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": orgId,
        name: site.brand,
        url,
        description: dict.meta.description,
        email: site.contact.email,
        telephone: site.contact.phoneHref,
        image: new URL(site.images.hero, site.url).toString(),
        logo: new URL("/icon.svg", site.url).toString(),
        founder: { "@id": personId },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.zip,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.countryCode,
        },
        areaServed: ["DE", "AT", "CH", "EU"],
        knowsAbout: [
          "SAP S/4HANA",
          "SAP Projektmanagement",
          "SAP Programmmanagement",
          "SAP Template Rollout",
          "Interim Management",
          "IT-Krisenmanagement",
        ],
        sameAs: [site.contact.linkedin],
        inLanguage: dict.htmlLang,
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.owner.name,
        jobTitle: dict.locale === "de" ? "SAP-Programm- und Projektmanagerin" : "SAP Programme & Project Manager",
        worksFor: { "@id": orgId },
        email: site.contact.email,
        image: new URL(site.images.portrait, site.url).toString(),
        sameAs: [site.contact.linkedin],
        hasCredential: [
          { "@type": "EducationalOccupationalCredential", name: "Project Management Professional (PMP)" },
          { "@type": "EducationalOccupationalCredential", name: "Professional Scrum Master I (PSM I)" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
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
