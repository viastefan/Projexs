import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Check, MapPin, Phone } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

/**
 * Dunkler Hero: Navy-Verlauf mit feinem Raster und Akzent-Glow,
 * weiße Typo, Foto weich eingebettet, Referenz als Glas-Karte,
 * Vertrauensleiste darunter. Liegt unter der transparenten Kopfzeile.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section className="hero-dark relative isolate overflow-hidden text-white">
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-glow-top absolute inset-0 -z-10" />

      <div className="container-site grid items-center gap-10 pb-12 pt-[6.5rem] sm:pt-[7.5rem] lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-[9.5rem]">
        {/* Text */}
        <div className="lg:col-span-7">
          <p className="hero-rise inline-flex items-center gap-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-accent-light sm:text-[0.88rem]">
            <span aria-hidden="true" className="h-px w-6 bg-accent-light" />
            {h.eyebrow}
          </p>
          <h1 className="hero-rise hero-rise-2 mt-5 text-[clamp(2.35rem,7.5vw,3.9rem)] font-semibold leading-[1.06] tracking-[-0.015em] text-white">
            {h.titleLead}{" "}
            <span className="relative inline-block whitespace-nowrap text-accent-light">
              {h.titleAccent}
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-accent-light/60 sm:-bottom-1.5 sm:h-1" />
            </span>{" "}
            {h.titleTail}
          </h1>
          <p className="hero-rise hero-rise-3 mt-6 max-w-[36rem] text-[1.08rem] leading-relaxed text-white/80 sm:text-[1.2rem]">{h.lead}</p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <InquiryTrigger href={dict.routes.contact} source="dialog" variant="light" className="w-full sm:w-auto">
              {h.primary}
            </InquiryTrigger>
            <Button href={`#${dict.ids.projects}`} variant="ghost-light" className="w-full sm:w-auto">
              {h.secondary}
            </Button>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.95rem] text-white/75">
            <Phone className="size-4 text-accent-light" />
            {h.callLabel}:{" "}
            <a href={`tel:${site.contact.phoneHref}`} className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
              {site.contact.phone}
            </a>
          </p>

          <ul aria-label={h.credentialsLabel} className="mt-8 flex flex-wrap gap-2 sm:mt-10">
            {h.credentials.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[0.88rem] font-semibold text-white/90"
              >
                <Check className="size-4 text-accent-light" strokeWidth={2.2} />
                {c}
              </li>
            ))}
            <li className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[0.88rem] text-white/80">
              <MapPin className="size-4 text-accent-light" />
              {h.location}
            </li>
          </ul>
        </div>

        {/* Foto mit Glas-Karte */}
        <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[26rem] lg:col-span-5 lg:max-w-none" data-reveal>
          <div
            aria-hidden="true"
            className="absolute -inset-x-8 -top-8 bottom-10 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(78,200,224,0.28),transparent)] blur-2xl"
          />
          <div className="hero-photo relative aspect-[4/4.4] ring-1 ring-white/10 overflow-hidden rounded-2xl sm:aspect-[4/4.6] lg:aspect-[4/5]">
            <Image
              src={site.images.hero}
              alt={h.photoAlt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 36vw, (min-width: 640px) 26rem, 90vw"
              className="object-cover object-[50%_12%]"
            />
          </div>
          <div className="glass relative -mt-16 ml-3 mr-3 rounded-xl p-5 sm:-mt-20 sm:ml-5 sm:mr-5 lg:absolute lg:-left-12 lg:bottom-8 lg:m-0 lg:max-w-[21rem]">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-accent-light">{h.card.label}</p>
            <p className="mt-2 text-[1.08rem] font-semibold leading-snug text-white">{h.card.title}</p>
            <p className="text-[0.92rem] text-white/70">{h.card.client}</p>
            <p className="mt-3 flex gap-2.5 text-[0.93rem] leading-relaxed text-white/90">
              <Check className="mt-1 size-4 shrink-0 text-accent-light" strokeWidth={2.2} />
              {h.card.result}
            </p>
          </div>
        </div>
      </div>

      {/* Vertrauensleiste */}
      <div className="hero-fade border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
          <p className="text-[0.85rem] uppercase tracking-[0.08em] text-white/55">{h.trustLabel}</p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {h.trust.map((t) => (
              <li key={t} className="text-[1.05rem] font-semibold tracking-[0.02em] text-white/85 sm:text-[1.15rem]">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
