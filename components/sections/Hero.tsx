import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-[80rem] items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-navy">{h.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2.2rem,4.4vw,3.4rem)] font-semibold leading-[1.1] text-navy">
            {h.titleLead} <span className="whitespace-nowrap">{h.titleAccent}</span> {h.titleTail}
          </h1>
          <p className="mt-6 max-w-[38rem] text-[1.15rem] leading-relaxed text-stone">{h.lead}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={`#${dict.ids.contact}`}>{h.primary}</Button>
            <Button href={`#${dict.ids.projects}`} variant="secondary">
              {h.secondary}
            </Button>
          </div>

          <ul aria-label={h.credentialsLabel} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[0.98rem] text-ink">
            {h.credentials.map((c) => (
              <li key={c} className="font-semibold">
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-line pt-6">
            <p className="text-[0.9rem] text-stone">{h.trustLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
              {h.trust.map((t) => (
                <li key={t} className="text-[1.05rem] font-semibold text-navy">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-surface">
            <Image
              src={site.images.hero}
              alt={h.photoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-[50%_15%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
