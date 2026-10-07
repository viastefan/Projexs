import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import { Logo } from "@/components/site/Logo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Seite nicht gefunden | ProjeXs",
  description: "Die angeforderte Seite existiert nicht.",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="de" className={fontVariables}>
      <body className="bg-white text-ink antialiased">
        <header className="border-b border-line">
          <div className="mx-auto flex h-[4.5rem] max-w-[80rem] items-center px-5 sm:px-8">
            <Link href="/" aria-label="ProjeXs – zur Startseite" className="text-navy">
              <Logo />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[80rem] px-5 py-24 sm:px-8 sm:py-32">
          <p className="text-[0.95rem] font-semibold text-navy">404</p>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight text-navy">
            Diese Seite konnten wir nicht finden.
          </h1>
          <p className="mt-5 max-w-xl text-[1.1rem] leading-relaxed text-stone">
            Die Adresse ist möglicherweise verschoben oder nicht mehr vorhanden. · This page could not be found.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex h-12 items-center rounded-[3px] bg-navy px-6 font-semibold text-white hover:bg-navy-deep">
              Zur Startseite
            </Link>
            <Link href="/en" className="inline-flex h-12 items-center rounded-[3px] border border-navy px-6 font-semibold text-navy hover:bg-navy hover:text-white">
              English homepage
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
