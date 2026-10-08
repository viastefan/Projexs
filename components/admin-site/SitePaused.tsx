import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/content/site";
import { Logo } from "@/components/site/Logo";
import { fontVariables } from "@/lib/fonts";
import type { Dictionary } from "@/lib/i18n";

/*
 * Die pausierte Website: Daniela hat sie in der Admin-App ausgeschaltet.
 * Besucher sehen einen ruhigen Hinweis mit den Kontaktdaten; Impressum,
 * Datenschutz und AGB bleiben erreichbar und werden von `SitePausedShell`
 * gerahmt. Die Vorschau (Draft Mode) zeigt weiterhin die ganze Website.
 */

const TEXT = {
  de: {
    title: "Diese Website wird gerade überarbeitet.",
    text: "Bald ist sie wieder für Sie da.",
    reach: "Sie erreichen mich weiterhin unter",
    or: "oder",
    legal: "Rechtliches",
  },
  en: {
    title: "This website is currently being updated.",
    text: "It will be back shortly.",
    reach: "You can still reach me at",
    or: "or",
    legal: "Legal",
  },
} as const;

function texts(dict: Dictionary) {
  return dict.locale === "en" ? TEXT.en : TEXT.de;
}

/** Der Hinweis selbst — Startseite und Kontaktseite zeigen ihn statt ihrer Inhalte. */
export function PausedNotice({ dict }: { dict: Dictionary }) {
  const t = texts(dict);
  return (
    <section className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="max-w-2xl text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.1] text-navy">{t.title}</h1>
      <p className="mt-5 text-[1.1rem] text-stone">{t.text}</p>
      <div className="relative mt-9 h-[3px] w-40 overflow-hidden rounded-full bg-accent/20" aria-hidden="true">
        <span className="absolute inset-y-0 left-0 w-2/5 animate-[pauseSlide_1.6s_cubic-bezier(0.65,0,0.35,1)_infinite] rounded-full bg-accent motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-50" />
      </div>
      <p className="mt-10 text-[0.95rem] leading-relaxed text-stone">
        {t.reach}{" "}
        <a href={`tel:${site.contact.phoneHref}`} className="whitespace-nowrap font-semibold text-navy hover:underline underline-offset-4">
          {site.contact.phone}
        </a>{" "}
        {t.or}{" "}
        <a href={`mailto:${site.contact.email}`} className="whitespace-nowrap font-semibold text-navy hover:underline underline-offset-4">
          {site.contact.email}
        </a>
        .
      </p>
      <style>{`@keyframes pauseSlide { from { transform: translateX(-100%); } to { transform: translateX(265%); } }`}</style>
    </section>
  );
}

/** Schlanker Rahmen ohne Navigation, Dialoge und Pop-ups — nur Logo, Inhalt und Rechtliches. */
export function SitePausedShell({ dict, children }: { dict: Dictionary; children: ReactNode }) {
  const t = texts(dict);
  const f = dict.footer;
  return (
    <html lang={dict.htmlLang} className={fontVariables}>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <header className="border-b border-line bg-white/90 backdrop-blur">
          <div className="container-site flex h-[4.5rem] items-center">
            <Link href={dict.routes.home} aria-label={dict.nav.homeAria}>
              <Logo />
            </Link>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <footer className="border-t border-line">
          <div className="container-site flex flex-wrap items-center justify-between gap-3 py-6 text-[0.85rem] text-stone">
            <p>
              {site.brand} · {site.owner.name}
            </p>
            <nav aria-label={t.legal} className="flex gap-5">
              <Link href={dict.routes.imprint} className="hover:text-navy">
                {f.imprint}
              </Link>
              <Link href={dict.routes.privacy} className="hover:text-navy">
                {f.privacy}
              </Link>
              <Link href={dict.routes.terms} className="hover:text-navy">
                {f.terms}
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
