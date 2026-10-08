"use client";

import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { ArrowUpRight, MapPin } from "@/components/ui/Icons";
import { useConsent, writeConsent } from "@/components/consent/consent";

const query = encodeURIComponent(`${site.address.street}, ${site.address.zip} ${site.address.city}`);
const embedUrl = `https://www.google.com/maps?q=${query}&output=embed`;
export const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

/**
 * Google-Maps-Standort als Zwei-Klick-Lösung: Die Karte wird erst geladen,
 * wenn die Besucherin zustimmt (Klick auf „Karte laden“ oder Consent-Banner).
 * Die Zustimmung wird über den Consent-Speicher gemerkt.
 */
export function ContactMap({ dict }: { dict: Dictionary }) {
  const c = dict.contactPage;
  const allowed = useConsent()?.external ?? false;

  const a = site.address;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface sm:aspect-[16/10]">
        {allowed ? (
          <iframe
            src={embedUrl}
            title={c.mapIframeTitle}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-line)_1px,transparent_1px),linear-gradient(90deg,var(--color-line)_1px,transparent_1px)] [background-size:2.5rem_2.5rem]"
            />
            <span className="relative grid size-12 place-items-center rounded-full bg-white text-navy shadow-[var(--shadow-card)]">
              <MapPin className="size-6" />
            </span>
            <p className="relative mt-4 font-semibold text-navy">
              {a.street}, {a.zip} {a.city}
            </p>
            <button
              type="button"
              onClick={() => writeConsent(true)}
              className="relative mt-4 inline-flex h-11 items-center justify-center rounded-md bg-navy px-5 text-[0.95rem] font-semibold text-white hover:bg-navy-deep"
            >
              {c.mapLoad}
            </button>
            <p className="relative mt-3 max-w-xs text-[0.82rem] leading-snug text-stone">
              {c.mapHint}{" "}
              <Link href={dict.routes.privacy} className="font-semibold text-navy underline underline-offset-4">
                {dict.consent.privacyLink}
              </Link>
            </p>
          </div>
        )}
      </div>
      <a
        href={routeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-navy underline underline-offset-4"
      >
        {c.mapRoute}
        <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}
