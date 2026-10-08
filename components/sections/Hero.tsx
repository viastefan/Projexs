import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Check, Phone } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[80rem] items-center gap-12 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-12 lg:gap-14 lg:pb-20 lg:pt-20">
        {/* Text */}
        <div className="lg:col-span-7">
          <p className="text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-navy">{h.eyebrow}</p>
          <h1 className="mt-5 text-[clamp(2.4rem,4.6vw,3.5rem)] font-semibold leading-[1.08] text-navy">
            {h.titleLead} <span className="whitespace-nowrap">{h.titleAccent}</span> {h.titleTail}
          </h1>
          <p className="mt-6 max-w-[36rem] text-[1.15rem] leading-relaxed text-stone sm:text-[1.2rem]">{h.lead}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <InquiryTrigger href={dict.routes.contact}>{h.primary}</InquiryTrigger>
            <Button href={`#${dict.ids.projects}`} variant="secondary">
              {h.secondary}
            </Button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-[0.98rem] text-stone">
            <Phone className="size-4 text-navy" />
            {h.callLabel}:{" "}
            <a href={`tel:${site.contact.phoneHref}`} className="font-semibold text-navy underline underline-offset-4">
              {site.contact.phone}
            </a>
          </p>

          <ul aria-label={h.credentialsLabel} className="mt-10 flex flex-wrap gap-2">
            {h.credentials.map((c) => (
              <li key={c} className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-[0.9rem] font-semibold text-ink">
                <Check className="size-4 text-accent" strokeWidth={2.2} />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Bild mit Referenzkarte */}
        <div className="relative lg:col-span-5">
          <div aria-hidden="true" className="absolute -right-5 -top-5 hidden h-full w-full rounded-lg bg-surface lg:block" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={site.images.hero}
              alt={h.photoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_18%]"
            />
          </div>
          <div className="relative -mt-12 ml-4 mr-4 rounded-lg border border-line bg-white p-5 shadow-[0_18px_40px_-20px_rgba(8,32,120,0.35)] sm:ml-6 sm:max-w-md lg:absolute lg:-left-10 lg:bottom-10 lg:m-0">
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-stone">{h.card.label}</p>
            <p className="mt-2 text-[1.1rem] font-semibold leading-snug text-navy">{h.card.title}</p>
            <p className="text-[0.95rem] text-stone">{h.card.client}</p>
            <p className="mt-3 flex gap-2.5 text-[0.95rem] leading-relaxed text-ink">
              <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.2} />
              {h.card.result}
            </p>
          </div>
        </div>
      </div>

      {/* Vertrauensleiste */}
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[80rem] flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-[0.9rem] text-stone">{h.trustLabel}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {h.trust.map((t) => (
              <li key={t} className="text-[1.1rem] font-semibold text-navy">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
