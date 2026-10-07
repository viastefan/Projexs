import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check } from "@/components/ui/Icons";

export function GoLive({ dict }: { dict: Dictionary }) {
  const g = dict.golive;

  return (
    <section
      id={dict.ids.golive}
      aria-labelledby="golive-title"
      className="grain relative isolate overflow-hidden bg-ink py-24 text-paper sm:py-32 lg:py-40"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[20%] h-[60vh] w-[60vh] rounded-full bg-accent/[0.12] blur-[150px]" />
        <div className="absolute -right-[10%] bottom-0 h-[50vh] w-[50vh] rounded-full bg-navy/50 blur-[140px]" />
      </div>

      <div className="mx-auto grid max-w-[88rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12">
        {/* Foto mit schwebender Checkliste */}
        <div className="relative lg:col-span-5">
          <div
            data-reveal="scale"
            className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/10"
          >
            <Image
              src={site.images.golive}
              alt={g.photoAlt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-[50%_20%]"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": 250 } as React.CSSProperties}
            className="relative -mt-28 ml-auto w-[88%] max-w-sm rounded-2xl border border-white/10 bg-ink-2/85 p-6 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] backdrop-blur-xl sm:-mr-6 lg:-mr-12"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-mist">{g.checklistTitle}</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-ok/15 px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ok">
                <span className="size-1.5 animate-pulse-soft rounded-full bg-ok" />
                {g.status}
              </span>
            </div>
            <ul className="mt-5 space-y-3">
              {g.checklist.map((item, i) => (
                <li
                  key={item}
                  data-reveal="fade"
                  style={{ "--reveal-delay": 400 + i * 160 } as React.CSSProperties}
                  className="flex items-center gap-3 text-[0.95rem] text-paper/90"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent text-ink">
                    <Check className="size-3" strokeWidth={2.4} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Zitat */}
        <div className="lg:col-span-7">
          <div data-reveal>
            <Eyebrow index="04" tone="light">
              {g.eyebrow}
            </Eyebrow>
          </div>
          <h2
            id="golive-title"
            data-reveal
            className="mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
          >
            {g.title}
          </h2>
          <figure data-reveal style={{ "--reveal-delay": 120 } as React.CSSProperties} className="mt-10">
            <svg aria-hidden="true" viewBox="0 0 48 36" className="h-8 w-10 text-accent" fill="currentColor">
              <path d="M0 36V22C0 9.6 6.4 2.2 19 0l2 5.2C13.4 7 10.2 11 9.8 17H19v19H0Zm27 0V22C27 9.6 33.4 2.2 46 0l2 5.2C40.4 7 37.2 11 36.8 17H46v19H27Z" />
            </svg>
            <blockquote className="mt-6 font-serif text-[clamp(1.6rem,2.8vw,2.45rem)] leading-[1.22] text-paper">
              <p>{g.quote}</p>
              <p className="mt-6 text-accent-2">{g.quoteTail}</p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-white/30" />
              <span className="font-mono text-[0.75rem] uppercase tracking-[0.18em] text-mist">{g.author}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
