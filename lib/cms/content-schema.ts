/**
 * Was sich in der Admin-App an den Website-Texten bearbeiten lässt.
 *
 * Das Schema beschreibt Abschnitte und Felder; die Pfade zeigen in das
 * Wörterbuch (`content/de.ts` / `content/en.ts`). Der Editor in der App ist
 * generisch und rendert sich aus diesem Schema — neue Felder brauchen also nur
 * einen Eintrag hier. Die Standardtexte bleiben im Code; gespeichert wird nur,
 * was davon abweicht (siehe `content.ts`).
 */

export type FieldKind = "text" | "textarea" | "number" | "strings" | "items";

export interface FieldDef {
  /** Pfad im Wörterbuch (Abschnitt) bzw. im Listeneintrag (Unterfeld). */
  path: string;
  label: string;
  kind: FieldKind;
  hint?: string;
  /** Für `items`: die Felder eines Eintrags. */
  item?: FieldDef[];
  /** Für `items`: welches Unterfeld in der zusammengeklappten Liste als Titel dient. */
  itemTitle?: string;
  /** Für `items`/`strings`: Bezeichnung eines Eintrags, z. B. „Frage“. */
  itemLabel?: string;
}

export interface SectionDef {
  id: string;
  title: string;
  description?: string;
  fields: FieldDef[];
}

const text = (path: string, label: string, hint?: string): FieldDef => ({ path, label, kind: "text", hint });
const area = (path: string, label: string, hint?: string): FieldDef => ({ path, label, kind: "textarea", hint });
const strings = (path: string, label: string, itemLabel: string, hint?: string): FieldDef => ({
  path,
  label,
  kind: "strings",
  itemLabel,
  hint,
});
const items = (path: string, label: string, itemLabel: string, itemTitle: string, item: FieldDef[], hint?: string): FieldDef => ({
  path,
  label,
  kind: "items",
  itemLabel,
  itemTitle,
  item,
  hint,
});

const titleText = (titleLabel = "Titel", textLabel = "Text"): FieldDef[] => [text("title", titleLabel), area("text", textLabel)];

export const CONTENT_SECTIONS: SectionDef[] = [
  {
    id: "hero",
    title: "Hero",
    description: "Der erste Eindruck ganz oben auf der Startseite.",
    fields: [
      text("hero.eyebrow", "Überzeile"),
      text("hero.titleLead", "Überschrift – Anfang"),
      text("hero.titleAccent", "Überschrift – betontes Wort", "Wird in Türkis hervorgehoben."),
      text("hero.titleTail", "Überschrift – Ende"),
      area("hero.lead", "Einleitung"),
      text("hero.primary", "Hauptbutton"),
      text("hero.secondary", "Zweiter Button"),
      text("hero.credentialsLabel", "Beschriftung Zertifizierungen"),
      strings("hero.credentials", "Zertifizierungen", "Zertifizierung"),
      text("hero.trustLabel", "Beschriftung Referenzen"),
      strings("hero.trust", "Referenzen", "Referenz"),
      text("hero.callLabel", "Text vor der Telefonnummer"),
      text("hero.card.label", "Karte – Beschriftung"),
      text("hero.card.title", "Karte – Titel"),
      text("hero.card.client", "Karte – Kunde / Zeitraum"),
      area("hero.card.result", "Karte – Ergebnis"),
    ],
  },
  {
    id: "stats",
    title: "Kennzahlen",
    description: "Die vier Zahlen unter dem Hero.",
    fields: [
      items("stats", "Kennzahlen", "Kennzahl", "label", [
        { path: "value", label: "Zahl", kind: "number" },
        text("suffix", "Zusatz", "z. B. „+“ – leer lassen, wenn nichts folgen soll."),
        text("label", "Beschriftung"),
      ]),
    ],
  },
  {
    id: "services",
    title: "Leistungen",
    fields: [
      text("services.eyebrow", "Überzeile"),
      text("services.title", "Überschrift"),
      area("services.intro", "Einleitung"),
      items("services.roles", "Rollen", "Rolle", "title", [
        ...titleText(),
        strings("points", "Stichpunkte", "Stichpunkt"),
      ]),
      text("services.situationsTitle", "Überschrift Situationen"),
      items("services.situations", "Typische Situationen", "Situation", "title", titleText()),
    ],
  },
  {
    id: "expertise",
    title: "Expertise",
    fields: [
      text("expertise.eyebrow", "Überzeile"),
      text("expertise.title", "Überschrift"),
      area("expertise.intro", "Einleitung"),
      items("expertise.pillars", "Schwerpunkte", "Schwerpunkt", "title", titleText()),
      text("expertise.highlightsTitle", "Überschrift Highlights"),
      items("expertise.highlights", "Highlights", "Highlight", "title", titleText()),
      text("expertise.modulesTitle", "Überschrift SAP-Module"),
      items("expertise.modules", "SAP-Module", "Modul", "code", [text("code", "Kürzel"), text("name", "Name")]),
    ],
  },
  {
    id: "projects",
    title: "Projekte",
    description: "Die Referenzprojekte – je Kunde mit Kennzahlen und einzelnen Einsätzen.",
    fields: [
      text("projects.eyebrow", "Überzeile"),
      text("projects.title", "Überschrift"),
      area("projects.intro", "Einleitung"),
      area("projects.note", "Hinweis unter den Projekten"),
      text("projects.cta", "Button"),
      items("projects.clients", "Kunden", "Kunde", "client", [
        text("client", "Kunde"),
        text("period", "Zeitraum"),
        text("industry", "Branche"),
        text("headline", "Projekt-Überschrift"),
        text("release", "Release"),
        strings("modules", "Module", "Modul"),
        text("team", "Projektgröße"),
        items("kpis", "Kennzahlen", "Kennzahl", "label", [text("value", "Wert"), text("label", "Beschriftung")]),
        items("engagements", "Einsätze", "Einsatz", "role", [
          text("role", "Rolle"),
          text("period", "Zeitraum"),
          strings("points", "Aufgaben", "Aufgabe"),
          area("result", "Ergebnis"),
        ]),
        strings("more", "Weitere Projekte", "Projekt"),
      ]),
    ],
  },
  {
    id: "process",
    title: "Zusammenarbeit",
    description: "Die drei Schritte von der Anfrage bis zum Start.",
    fields: [
      text("process.eyebrow", "Überzeile"),
      text("process.title", "Überschrift"),
      area("process.intro", "Einleitung"),
      items("process.steps", "Schritte", "Schritt", "title", titleText()),
      text("process.cta", "Button"),
    ],
  },
  {
    id: "golive",
    title: "Go-live",
    fields: [
      text("golive.eyebrow", "Überzeile"),
      text("golive.title", "Überschrift"),
      area("golive.quote", "Zitat"),
      area("golive.quoteTail", "Zitat – Schluss"),
      text("golive.author", "Zitat – Autorin"),
      text("golive.checklistTitle", "Überschrift Checkliste"),
      strings("golive.checklist", "Checkliste", "Punkt"),
      text("golive.status", "Status-Badge"),
    ],
  },
  {
    id: "about",
    title: "Über mich",
    fields: [
      text("about.eyebrow", "Überzeile"),
      text("about.name", "Name"),
      text("about.roles", "Rollen"),
      area("about.title", "Überschrift"),
      strings("about.paragraphs", "Absätze", "Absatz"),
      text("about.valuesTitle", "Überschrift Werte"),
      items("about.values", "Werte", "Wert", "title", titleText()),
      text("about.certsTitle", "Überschrift Zertifizierungen"),
      items("about.certs", "Zertifizierungen", "Zertifizierung", "name", [text("name", "Kurzname"), text("detail", "Beschreibung")]),
      text("about.timelineTitle", "Überschrift Stationen"),
      items("about.timeline", "Stationen", "Station", "title", [text("year", "Jahr"), text("title", "Station"), text("text", "Beschreibung")]),
    ],
  },
  {
    id: "faq",
    title: "FAQ",
    fields: [
      text("faq.eyebrow", "Überzeile"),
      text("faq.title", "Überschrift"),
      items("faq.items", "Fragen", "Frage", "q", [text("q", "Frage"), area("a", "Antwort")]),
    ],
  },
  {
    id: "contact",
    title: "Kontakt",
    description: "Texte rund um Kontaktbereich, Kontaktseite und Anfrage-Dialog.",
    fields: [
      text("contact.eyebrow", "Überzeile"),
      text("contact.title", "Überschrift"),
      area("contact.intro", "Einleitung"),
      text("contact.personal", "Persönlicher Satz"),
      text("contact.location", "Standort-Text"),
      text("contact.stepperTeaser", "Hinweis auf den Dialog"),
      text("contact.stepperCta", "Button Dialog"),
      strings("contact.form.topics", "Anliegen (Auswahl)", "Anliegen"),
      text("contact.form.messagePlaceholder", "Platzhalter Nachricht"),
      text("contact.form.successTitle", "Erfolg – Titel"),
      area("contact.form.successText", "Erfolg – Text"),
      text("contactPage.eyebrow", "Kontaktseite – Überzeile"),
      text("contactPage.title", "Kontaktseite – Überschrift"),
      area("contactPage.intro", "Kontaktseite – Einleitung"),
      text("contactPage.metaTitle", "Kontaktseite – Seitentitel (SEO)"),
      area("contactPage.metaDescription", "Kontaktseite – Beschreibung (SEO)"),
      text("inquiry.title", "Dialog – Titel"),
      text("inquiry.subtitle", "Dialog – Untertitel"),
      strings("inquiry.steps.timeframe.options", "Dialog – Zeitrahmen-Optionen", "Option"),
    ],
  },
  {
    id: "footer",
    title: "Fußzeile & Navigation",
    fields: [
      text("footer.tagline", "Slogan in der Fußzeile"),
      text("nav.cta", "Button im Kopfbereich"),
      text("mobileBar.inquire", "Mobile Leiste – Anfrage"),
      text("mobileBar.call", "Mobile Leiste – Anrufen"),
    ],
  },
  {
    id: "seo",
    title: "SEO",
    description: "Was Suchmaschinen und soziale Netzwerke von der Startseite sehen.",
    fields: [
      text("meta.title", "Seitentitel", "Erscheint im Browser-Tab und bei Google. Ideal bis 60 Zeichen."),
      area("meta.description", "Beschreibung", "Der Text unter dem Titel bei Google. Ideal 120–160 Zeichen."),
      strings("meta.keywords", "Schlüsselwörter", "Schlüsselwort"),
      text("meta.ogTitle", "Titel im Vorschaubild (Social Media)"),
      text("meta.ogSubtitle", "Untertitel im Vorschaubild"),
    ],
  },
];

/** Stammdaten aus `content/site.ts`, die in der App gepflegt werden können. */
export const SITE_FIELDS: FieldDef[] = [
  text("contact.email", "E-Mail-Adresse"),
  text("contact.phone", "Telefon (Anzeige)", "So, wie die Nummer auf der Website stehen soll."),
  text("contact.phoneHref", "Telefon (für Anruf-Links)", "Ohne Leerzeichen, z. B. +491724020639."),
  text("contact.linkedin", "LinkedIn-Profil (URL)"),
  text("address.street", "Straße und Hausnummer"),
  text("address.zip", "PLZ"),
  text("address.city", "Ort"),
  text("address.region", "Bundesland"),
  text("legal.vatId", "USt-IdNr.", "Leer lassen, wenn keine vorhanden – dann erscheint sie nicht im Impressum."),
];

export function sectionById(id: string): SectionDef | undefined {
  return CONTENT_SECTIONS.find((section) => section.id === id);
}
