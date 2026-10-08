import Link from "next/link";
import { sessionSecret } from "@/lib/auth/session";
import { site } from "@/content/site";
import { isStorageConfigured } from "@/lib/storage";
import styles from "./soon.module.css";

/*
 * Solange die App noch nicht eingerichtet ist (kein Speicher, kein
 * Sitzungsschlüssel), sehen Besucher nur einen ruhigen Hinweis. Was fehlt,
 * steht ausschließlich im Server-Log — nie Werte.
 */
export function SetupNeeded() {
  const missing: string[] = [];
  if (!isStorageConfigured()) missing.push("BLOB_READ_WRITE_TOKEN (oder STORAGE_DRIVER=local)");
  if (!sessionSecret()) missing.push("ADMIN_SESSION_SECRET (mind. 32 Zeichen)");
  if (missing.length) console.warn("[Admin-App] Noch nicht eingerichtet, es fehlt:", missing.join(", "));

  const words = ["Bald", "für", "Sie", "da."];

  return (
    <main className={styles.page} id="inhalt">
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
        <span className={styles.blobC} />
      </div>

      <div className={styles.stage}>
        <div className={styles.emblem} aria-hidden="true">
          <span className={styles.ripple} />
          <span className={styles.ripple} />
          <span className={styles.ripple} />
          <span className={styles.ring} />
          <span className={styles.halo} />
          {/* eslint-disable-next-line @next/next/no-img-element -- kleines statisches Symbol */}
          <img className={styles.mark} src="/app-icons/projexs-192.png" alt="" width={104} height={104} />
        </div>

        <p className={styles.eyebrow}>Admin-App · {site.owner.name}</p>

        <h1 className={styles.title}>
          {words.map((word, index) => (
            <span key={word} className={styles.word} style={{ "--i": index } as React.CSSProperties}>
              {word}
            </span>
          ))}
        </h1>

        <p className={styles.lead}>Die Admin-App ist in Kürze erreichbar. Schauen Sie gern bald wieder vorbei.</p>

        <p className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Demnächst verfügbar
        </p>

        <Link href="/" className={styles.back}>
          Zur Website <span aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  );
}
