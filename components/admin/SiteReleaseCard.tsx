import { ExternalLink, Eye } from "lucide-react";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { SiteToggle } from "@/components/admin/SiteToggle";
import ui from "@/components/admin/ui.module.css";
import { formatDate } from "@/lib/cms/format";
import { releaseHistory, type ReleaseEvent } from "@/lib/cms/site-release";
import { requestOrigin } from "@/lib/request-origin";
import { sharePreviewLink } from "@/lib/site-status";
import styles from "./SiteRelease.module.css";

/** Verlauf: wann die Website veröffentlicht oder pausiert wurde, und von wem. */
function History({ events }: { events: ReleaseEvent[] }) {
  if (events.length === 0) return null;
  return (
    <div className={ui.stack} style={{ gap: "0.5rem" }}>
      <p className={ui.eyebrow} style={{ margin: 0 }}>
        Verlauf
      </p>
      <ul className={styles.history}>
        {events.slice(0, 5).map((event) => (
          <li key={event.at + event.action}>
            <span className={`${ui.chip} ${event.action === "published" ? ui.chipOk : ui.chipWarn}`}>
              {event.action === "published" ? "Veröffentlicht" : "Pausiert"}
            </span>
            <span>
              {formatDate(event.at, true)} Uhr · {event.by}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/*
 * Die Website ein- und ausschalten — oben auf der Übersicht und in den
 * Einstellungen. Ausgeschaltet sehen Besucher die Pausenseite; die Vorschau
 * zeigt trotzdem alles, als Link, der ohne Anmeldung funktioniert.
 */
export async function SiteReleaseCard({ publishedAt }: { publishedAt?: string | null }) {
  const live = Boolean(publishedAt);
  const [history, preview] = await Promise.all([
    releaseHistory().catch(() => []),
    live ? Promise.resolve(null) : requestOrigin().then(sharePreviewLink),
  ]);

  return (
    <section className={ui.card} id="website" aria-labelledby="website-titel">
      <div className={ui.stack}>
        <div className={styles.head}>
          <div className={styles.headText}>
            <h2 className={ui.sectionTitle} id="website-titel">
              Website
            </h2>
            <p className={styles.status} data-live={live ? "true" : "false"}>
              <span className={styles.dot} aria-hidden="true" />
              {publishedAt ? (
                <span>
                  <strong>Online</strong> · seit {formatDate(publishedAt)}
                </span>
              ) : (
                <span>
                  <strong>Pausiert</strong> · Besucher sehen die Pausenseite
                </span>
              )}
            </p>
          </div>
          {/* Neu aufbauen, wenn der Stand vom Server wechselt. */}
          <SiteToggle key={live ? "an" : "aus"} live={live} />
        </div>

        <p className={ui.hint} style={{ margin: 0 }}>
          {live
            ? "Schalter aus: Besucher sehen „Diese Website wird gerade überarbeitet“ mit den Kontaktdaten, bis die Website wieder eingeschaltet wird. Impressum und Datenschutz bleiben erreichbar."
            : "Schalter an: Die Website ist sofort wieder für alle sichtbar. Vorher alles in der Vorschau ansehen."}
        </p>

        <div className={ui.row}>
          {preview ? (
            <a href={preview.url} target="_blank" rel="noopener" className={`${ui.button} ${ui.secondary}`}>
              <Eye aria-hidden="true" /> Vorschau ansehen
            </a>
          ) : (
            <a href="/" target="_blank" rel="noopener" className={`${ui.button} ${ui.secondary}`}>
              <ExternalLink aria-hidden="true" /> Website ansehen
            </a>
          )}
          {preview ? <CopyLinkButton url={preview.url} label="Vorschau-Link kopieren" /> : null}
        </div>
        {preview ? (
          <p className={ui.hint} style={{ margin: 0 }}>
            Der Vorschau-Link funktioniert ohne Anmeldung und gilt bis {formatDate(preview.until.toISOString())}.
          </p>
        ) : null}

        <History events={history} />
      </div>
    </section>
  );
}
