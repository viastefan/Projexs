import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { fontVariables } from "@/lib/fonts";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Gemeinsames HTML-Gerüst für die deutschen und englischen Seiten. */
export function SiteShell({ dict, children }: { dict: Dictionary; children: ReactNode }) {
  return (
    <html lang={dict.htmlLang} className={fontVariables}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <Header dict={dict} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
