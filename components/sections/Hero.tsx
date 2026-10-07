import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";

export function Hero({ dict }: { dict: Dictionary }) {
  const h = dict.hero;

  return (
    <section id="top" className="relative isolate overflow-hidden bg-ink text-paper">
      {/* Atmosphäre: Marken-Navy-Glow, feines Raster, Korn */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[20%] -top-[30%] h-[80vh] w-[80vh] rounded-full bg-navy/50 blur-[140px]" />
        <div className="absolute bottom-[-30%] left-[30%] h-[60vh] w-[60vh] rounded-full bg-accent/10 blur-[160px]" />
        <div className="bg-grid-ink absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_30%_40%,#000_10%,transparent_70%)]" />
      </div>

      {/* Porträt – auf Mobile oben, auf Desktop rechts randabfallend */}
      <div className="relative h-[64svh] min-h-[440px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[54%] xl:w-[52%]">
        <div className="hero-photo-fade absolute inset-0">
          <Image
            src={site.images.hero}
            alt={h.photoAlt}
            fill
            priority
            sizes="(min-width: 1024px) 54vw, 100vw"
            className="animate-fade object-cover object-[52%_12%] [animation-duration:1.8s]"
          />
        </div>

        {/* Go-live-Badge */}
        <div
          className="absolute bottom-[20%] left-[4%] hidden animate-rise [animation-delay:900ms] sm:block lg:bottom-[22%] lg:left-[2%]"
          aria-label={`${h.badge.label}: ${h.badge.title} – ${h.badge.lines.join(", ")}. ${h.badge.foot}`}
        >
          <div className="animate-float rounded-2xl border border-white/10 bg-ink-2/70 p-5 pr-7 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.8)] backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-ok" />
              </span>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ok">{h.badge.label}</span>
            </div>
            <p className="mt-3 text-lg font-medium tracking-tight text-paper">{h.badge.title}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-mist">
              {h.badge.lines.map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <Check className="size-4 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/70">
              {h.badge.foot}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-28 max-w-[88rem] px-5 pb-16 sm:-mt-36 sm:px-8 lg:mt-0 lg:flex lg:min-h-[100svh] lg:items-center lg:px-12 lg:pb-24 lg:pt-32">
        <div className="max-w-[44rem] lg:max-w-[46%] xl:max-w-[44rem]">
          <p className="flex animate-rise items-center gap-3 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-mist [animation-delay:100ms] sm:text-[0.7rem] sm:tracking-[0.2em]">
            <span className="hidden h-px w-8 bg-accent sm:block" aria-hidden="true" />
            {h.eyebrow}
          </p>

          <h1 className="mt-6 font-sans text-[clamp(2.7rem,6.4vw,6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            <span className="block animate-rise [animation-delay:180ms]">{h.titleLead}</span>
            <span className="block animate-rise [animation-delay:300ms]">
              <em className="pr-[0.08em] font-serif text-[1.08em] font-normal italic tracking-[-0.02em] text-accent">
                {h.titleAccent}
              </em>{" "}
              {h.titleTail}
            </span>
          </h1>

          <p className="mt-7 max-w-[36rem] animate-rise text-[1.08rem] leading-relaxed text-mist [animation-delay:440ms] sm:text-lg">
            {h.lead}
          </p>

          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:560ms] sm:flex-row">
            <Button href={`#${dict.ids.contact}`}>{h.primary}</Button>
            <Button href={`#${dict.ids.projects}`} variant="ghost-light" arrow={false}>
              {h.secondary}
            </Button>
          </div>

          <ul className="mt-10 flex animate-rise flex-wrap gap-2 [animation-delay:680ms]" aria-label={h.credentialsLabel}>
            {h.credentials.map((c) => (
              <li
                key={c}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.72rem] tracking-[0.06em] text-paper/85"
              >
                <Check className="size-3.5 text-accent" />
                {c}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex animate-rise flex-col gap-3 border-t border-white/10 pt-6 [animation-delay:800ms] sm:flex-row sm:items-center sm:gap-6">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-mist/80">{h.trustLabel}</p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {h.trust.map((t) => (
                <li key={t} className="text-[1.05rem] font-semibold tracking-[-0.02em] text-paper/75">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
