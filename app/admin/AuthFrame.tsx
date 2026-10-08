import Link from "next/link";
import { AppInstallPrompt } from "@/components/admin/AppInstallPrompt";
import ui from "@/components/admin/ui.module.css";
import { de } from "@/content/de";
import { site } from "@/content/site";
import styles from "./auth.module.css";

/**
 * Rahmen für die Anmeldung: ruhig, markenpassend, mit dem App-Symbol.
 * `layout="pin"` ist die schlanke Fassung für die PIN-Eingabe.
 */
export function AuthFrame({
  title,
  lead,
  children,
  foot,
  installPrompt = false,
  layout = "default",
}: {
  title: React.ReactNode;
  lead?: React.ReactNode;
  children: React.ReactNode;
  foot?: React.ReactNode;
  /** Beim ersten Besuch anbieten, die App zu installieren. */
  installPrompt?: boolean;
  layout?: "default" | "pin";
}) {
  if (layout === "pin") {
    return (
      <main className={`${styles.page} ${styles.pagePin}`} id="inhalt" data-auth="pin">
        <div className={styles.pinShell}>
          <header className={styles.pinHead}>
            <div className={styles.pinBrand}>
              {/* eslint-disable-next-line @next/next/no-img-element -- kleines App-Icon */}
              <img className={styles.pinMark} src="/app-icons/projexs-192.png" alt="" width={40} height={40} />
              <div className={styles.pinBrandText}>
                <p className={styles.pinApp}>{site.brand}</p>
                <p className={styles.pinRole}>Admin-App</p>
              </div>
            </div>
            <h1 className={styles.pinTitle}>{title}</h1>
            {lead ? <p className={styles.pinLead}>{lead}</p> : null}
          </header>

          <div className={styles.pinBody}>{children}</div>

          {foot ? <div className={styles.pinFoot}>{foot}</div> : null}

          <p className={styles.pinLegal}>
            <Link href={de.routes.privacy}>Datenschutz</Link>
            <span aria-hidden="true"> · </span>
            <Link href={de.routes.imprint}>Impressum</Link>
          </p>
        </div>
        {installPrompt ? <AppInstallPrompt /> : null}
      </main>
    );
  }

  return (
    <main className={styles.page} id="inhalt">
      <div className={styles.aurora} aria-hidden="true">
        <span className={styles.blobA} />
        <span className={styles.blobB} />
        <span className={styles.blobC} />
      </div>

      <div className={styles.panel}>
        <div className={styles.emblem} aria-hidden="true">
          <span className={styles.halo} />
          {/* eslint-disable-next-line @next/next/no-img-element -- kleines statisches Symbol */}
          <img className={styles.mark} src="/app-icons/projexs-192.png" alt="" width={88} height={88} />
        </div>

        <div className={styles.head}>
          <p className={styles.app}>Admin-App · {site.owner.name}</p>
          <h1 className={ui.pageTitle}>{title}</h1>
          {lead ? <p className={ui.lead}>{lead}</p> : null}
        </div>

        <div className={`${ui.card} ${styles.card}`}>{children}</div>
        {foot ? <div className={styles.foot}>{foot}</div> : null}
      </div>
      {installPrompt ? <AppInstallPrompt /> : null}
    </main>
  );
}
