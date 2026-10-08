import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { ContentEditor } from "@/components/admin/ContentEditor";
import ui from "@/components/admin/ui.module.css";
import { de } from "@/content/de";
import { en } from "@/content/en";
import { site } from "@/content/site";
import { requireAccount } from "@/lib/auth/server";
import {
  CONTENT_SECTIONS,
  getContentOverridesFresh,
  getPath,
  getSiteOverridesFresh,
  SITE_FIELDS,
  type Locale,
} from "@/lib/cms/content";
import type { FieldDef } from "@/lib/cms/content-schema";
import { formatDate } from "@/lib/cms/format";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "Inhalte" };

type Tab = "de" | "en" | "stammdaten";
const TABS: { key: Tab; label: string }[] = [
  { key: "de", label: "Deutsch" },
  { key: "en", label: "Englisch" },
  { key: "stammdaten", label: "Stammdaten" },
];

function defaultsFor(source: unknown, fields: FieldDef[]): Record<string, unknown> {
  return Object.fromEntries(fields.map((field) => [field.path, getPath(source, field.path)]));
}

function changedCount(fields: FieldDef[], overrides: Record<string, unknown>): number {
  return fields.filter((field) => overrides[field.path] !== undefined).length;
}

/**
 * Inhalts-Editor: Website-Texte je Sprache und die Stammdaten. Jeder Abschnitt
 * speichert für sich; gespeichert wird nur, was vom Standardtext abweicht.
 */
export default async function ContentPage({ searchParams }: { searchParams: Promise<{ bereich?: string }> }) {
  await requireAccount();
  const { bereich } = await searchParams;
  const tab: Tab = TABS.some((item) => item.key === bereich) ? (bereich as Tab) : "de";

  return (
    <div className={ui.stackLg}>
      <header className={styles.header}>
        <p className={ui.eyebrow}>Website</p>
        <h1 className={ui.pageTitle}>Inhalte</h1>
        <p className={ui.lead}>
          Texte der Website direkt bearbeiten. Nach „Speichern“ ist die Website sofort aktuell — jedes Feld lässt sich
          einzeln auf den Standardtext zurücksetzen.
        </p>
      </header>

      <div className={styles.filters} role="tablist" aria-label="Bereich">
        {TABS.map((item) => (
          <Link
            key={item.key}
            href={item.key === "de" ? "/admin/inhalte" : `/admin/inhalte?bereich=${item.key}`}
            className={styles.filter}
            role="tab"
            aria-selected={item.key === tab}
          >
            {item.label}
          </Link>
        ))}
        <a
          href={tab === "en" ? "/en" : "/"}
          target="_blank"
          rel="noopener"
          className={`${ui.button} ${ui.ghost}`}
          style={{ marginLeft: "auto" }}
        >
          <ExternalLink aria-hidden="true" /> Website ansehen
        </a>
      </div>

      {tab === "stammdaten" ? <SiteDataEditor /> : <LocaleEditor locale={tab} />}
    </div>
  );
}

async function LocaleEditor({ locale }: { locale: Locale }) {
  const { values: overrides, updatedAt } = await getContentOverridesFresh(locale);
  const dictionary = locale === "en" ? en : de;
  const total = CONTENT_SECTIONS.reduce((sum, section) => sum + changedCount(section.fields, overrides), 0);

  return (
    <div className={ui.stack}>
      <p className={ui.hint} style={{ margin: 0 }}>
        {total === 0
          ? `Alle ${locale === "en" ? "englischen" : "deutschen"} Texte zeigen den Standard aus dem Code.`
          : `${total} ${total === 1 ? "Feld weicht" : "Felder weichen"} vom Standard ab${updatedAt ? ` · zuletzt gespeichert ${formatDate(updatedAt, true)} Uhr` : ""}.`}
      </p>
      {CONTENT_SECTIONS.map((section, index) => {
        const changed = changedCount(section.fields, overrides);
        return (
          <details key={section.id} className={`${ui.card} ${styles.section}`} open={index === 0}>
            <summary className={styles.sectionSummary}>
              <span className={styles.sectionText}>
                <span className={ui.sectionTitle}>{section.title}</span>
                {section.description ? <span className={ui.hint}>{section.description}</span> : null}
              </span>
              {changed > 0 ? <span className={`${ui.chip} ${ui.chipAccent}`}>{changed} geändert</span> : null}
              <ChevronDown aria-hidden="true" className={styles.sectionChevron} />
            </summary>
            <div className={styles.sectionBody}>
              <ContentEditor
                target={{ kind: "content", locale }}
                fields={section.fields}
                defaults={defaultsFor(dictionary, section.fields)}
                overrides={overrides}
              />
            </div>
          </details>
        );
      })}
    </div>
  );
}

async function SiteDataEditor() {
  const { values: overrides, updatedAt } = await getSiteOverridesFresh();
  const changed = changedCount(SITE_FIELDS, overrides);
  return (
    <section className={ui.card} aria-labelledby="stammdaten-titel">
      <div className={ui.stack}>
        <div>
          <h2 className={ui.sectionTitle} id="stammdaten-titel">
            Stammdaten
          </h2>
          <p className={ui.lead}>
            E-Mail, Telefon, LinkedIn, Anschrift und USt-IdNr. — gelten für Impressum, Datenschutz, Kontaktbereich und
            die strukturierten Daten für Suchmaschinen, in beiden Sprachen.
            {changed > 0 && updatedAt ? ` Zuletzt gespeichert ${formatDate(updatedAt, true)} Uhr.` : ""}
          </p>
        </div>
        <ContentEditor target={{ kind: "site" }} fields={SITE_FIELDS} defaults={defaultsFor(site, SITE_FIELDS)} overrides={overrides} />
      </div>
    </section>
  );
}
