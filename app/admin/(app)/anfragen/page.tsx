import type { Metadata } from "next";
import { Inbox } from "lucide-react";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "Anfragen" };

/* Die Liste steht im Layout. Hier nur der Platzhalter für die rechte Spalte am großen Bildschirm. */
export default function InquiriesPage() {
  return (
    <div className={styles.mailEmpty}>
      <Inbox aria-hidden="true" strokeWidth={1.25} />
      <p>Wählen Sie links eine Anfrage aus.</p>
    </div>
  );
}
