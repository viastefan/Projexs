import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import { Logo } from "@/components/site/Logo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "404 – Seite nicht gefunden | ProjeXs",
  description: "Die angeforderte Seite existiert nicht.",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="de" className={fontVariables}>
      <body className="bg-ink text-paper antialiased">
        <main className="relative isolate flex min-h-dvh flex-col overflow-hidden px-5 py-8 sm:px-8 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-[15%] -top-[25%] h-[80vh] w-[80vh] rounded-full bg-navy/50 blur-[140px]" />
            <div className="bg-grid-ink absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_30%_40%,#000,transparent_70%)]" />
          </div>
          <Link href="/" aria-label="ProjeXs – zur Startseite">
            <Logo />
          </Link>
          <div className="my-auto max-w-2xl py-20">
            <p className="font-mono text-sm tracking-[0.2em] text-accent">404</p>
            <h1 className="mt-6 text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
              Diese Seite ist <em className="font-serif font-normal italic text-accent">nicht live.</em>
            </h1>
            <p className="mt-6 text-lg text-mist">
              Die angeforderte Seite existiert nicht oder wurde verschoben. · This page doesn’t exist or has moved.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex h-12 items-center rounded-full bg-accent px-6 font-medium text-ink hover:bg-accent-2">
                Zur Startseite
              </Link>
              <Link href="/en" className="inline-flex h-12 items-center rounded-full px-6 font-medium text-paper ring-1 ring-inset ring-white/20 hover:ring-white/50">
                English homepage
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
