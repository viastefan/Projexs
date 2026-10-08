import { PreviewPublish } from './PreviewPublish';
import styles from './PreviewBar.module.css';

/*
 * Hinweis in der Vorschau: Wer ihn sieht, schaut sich die Website über die
 * Praxis-App oder einen Vorschau-Link an. „Beenden“ ist ein Formular statt
 * eines Links — Links lädt Next vorab, das würde die Vorschau sofort beenden.
 */
export function PreviewBar({ live }: { live: boolean }) {
  return (
    <aside className={styles.bar} aria-label="Vorschau">
      <span className={styles.dot} aria-hidden="true" />
      <p className={styles.text}>
        <strong>Vorschau</strong>
        <span className={styles.detail}>{live ? 'Die Website ist online.' : 'Für Besucher noch pausiert.'}</span>
      </p>
      {live ? null : <PreviewPublish />}
      <form method="GET" action="/api/vorschau" className={styles.form}>
        <input type="hidden" name="ende" value="1" />
        <button type="submit" className={styles.end}>
          Beenden
        </button>
      </form>
    </aside>
  );
}
