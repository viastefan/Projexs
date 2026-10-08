"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import ui from "@/components/admin/ui.module.css";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Admin-App]", error);
  }, [error]);

  return (
    <div className={ui.stackLg}>
      <header>
        <p className={ui.eyebrow}>Admin-App</p>
        <h1 className={ui.pageTitle}>Hier ist etwas schiefgelaufen</h1>
      </header>
      <section className={ui.card} role="alert">
        <div className={ui.stack}>
          <p className={ui.lead}>Oft hilft es, es gleich noch einmal zu versuchen. Bleibt der Fehler, bitte kurz bei der technischen Betreuung melden.</p>
          <div className={ui.row}>
            <button type="button" className={`${ui.button} ${ui.primary}`} onClick={() => reset()}>
              <RotateCcw aria-hidden="true" /> Noch einmal versuchen
            </button>
            <Link href="/admin" className={`${ui.button} ${ui.ghost}`}>
              Zur Übersicht
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
