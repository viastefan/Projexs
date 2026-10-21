import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

/**
 * Heller Hero ohne Labels: frischer Türkis-Verlauf, Navy-Typo, Foto mit
 * kleiner Referenzkarte.
 * Zertifikate, Standort und Referenzkunden stehen als ruhige Textzeilen
 * statt als Chips. Liegt unter der transparenten Kopfzeile.
 */
export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section className="hero-light relative isolate overflow-hidden">
      <div aria-hidden="true" className="hero-orb hero-orb-a" />
      <div aria-hidden="true" className="hero-orb hero-orb-b" />
      <div aria-hidden="true" className="hero-orb hero-orb-c" />
      <div aria-hidden="true" className="hero-dots" />
      <div className="container-site grid items-center gap-12 pb-14 pt-[6.5rem] sm:pt-[7.5rem] lg:grid-cols-12 lg:gap-16 lg:pb-20 lg:pt-[9rem]">
        {/* Text */}
        <div className="lg:col-span-7">
          <h1 className="hero-rise text-[clamp(2.35rem,7.5vw,3.9rem)] font-semibold leading-[1.06] tracking-[-0.015em] text-navy">
            {h.titleLead}{" "}
            <span className="relative inline-block whitespace-nowrap text-accent">
              {h.titleAccent}
              <span aria-hidden="true" className="hero-underline absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-accent/50 sm:-bottom-1.5 sm:h-1" />
            </span>{" "}
            {h.titleTail}
          </h1>
          <p className="hero-rise hero-rise-3 mt-6 max-w-[36rem] text-[1.08rem] leading-relaxed text-stone sm:text-[1.2rem]">{h.lead}</p>

          <div className="hero-rise hero-rise-4 mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full sm:w-auto">
              {h.primary}
            </InquiryTrigger>
            <Button href={`#${dict.ids.projects}`} variant="secondary" className="w-full sm:w-auto">
              {h.secondary}
            </Button>
          </div>

          <dl className="hero-rise hero-rise-5 mt-10 grid gap-2 border-t border-line pt-6 text-[0.95rem] sm:mt-12">
            <div>
              <dt className="sr-only">{h.credentialsLabel}</dt>
              <dd className="font-semibold text-navy">{h.credentials.join(" · ")}</dd>
              <dd className="text-stone">{h.location}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="sr-only">{h.trustLabel}</dt>
              <dd className="font-semibold text-navy">{h.trust.join(" · ")}</dd>
            </div>
          </dl>
        </div>

        {/* Foto mit Referenzkarte */}
        <div className="relative mx-auto w-full max-w-[20rem] sm:max-w-[24rem] lg:col-span-5 lg:max-w-none">
          <div className="hero-photo-in relative aspect-[4/4.6] overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-card)] lg:aspect-[4/5]">
            <Image
              src={site.images.hero}
              alt={h.photoAlt}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 36vw, (min-width: 640px) 24rem, 90vw"
              className="object-cover object-[50%_12%]"
            />
          </div>
          <div className="hero-card-in relative -mt-12 mx-4 rounded-xl border border-line bg-white p-4 shadow-[var(--shadow-card)] sm:mx-6 lg:absolute lg:-left-10 lg:bottom-8 lg:m-0 lg:max-w-[19rem]">
            <p className="font-semibold leading-snug text-navy">{h.card.title}</p>
            <p className="text-[0.9rem] text-stone">{h.card.client}</p>
            <p className="mt-2.5 flex gap-2 text-[0.92rem] leading-relaxed text-ink">
              <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.2} />
              {h.card.result}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
