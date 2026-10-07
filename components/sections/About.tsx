import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { XMark } from "@/components/site/Logo";

export function About({ dict }: { dict: Dictionary }) {
  const a = dict.about;

  return (
    <section id={dict.ids.about} className="relative bg-paper py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Porträt */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div data-reveal="scale" className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-paper-2">
                <Image
                  src={site.images.portrait}
                  alt={a.portraitAlt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-[50%_18%]"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 rounded-2xl bg-ink/80 p-5 text-paper backdrop-blur-md sm:inset-x-5 sm:bottom-5">
                  <div>
                    <p className="text-lg font-semibold tracking-[-0.02em]">{a.name}</p>
                    <p className="mt-1 text-[0.8rem] leading-snug text-mist">{a.roles}</p>
                  </div>
                  <XMark className="size-7 shrink-0 text-paper" />
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="lg:col-span-7">
            <div data-reveal>
              <Eyebrow index="05">{a.eyebrow}</Eyebrow>
            </div>
            <h2
              data-reveal
              className="mt-6 text-[clamp(2rem,3.8vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.04em]"
            >
              {a.title}
            </h2>
            <div className="mt-8 space-y-5 text-[1.08rem] leading-relaxed text-stone">
              {a.paragraphs.map((p, i) => (
                <p key={i} data-reveal style={{ "--reveal-delay": 80 + i * 80 } as React.CSSProperties}>
                  {p}
                </p>
              ))}
            </div>

            {/* Werte */}
            <h3 data-reveal className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-stone">
              {a.valuesTitle}
            </h3>
            <ul className="mt-6 border-t border-ink/10">
              {a.values.map((v, i) => (
                <li
                  key={v.title}
                  data-reveal
                  style={{ "--reveal-delay": i * 90 } as React.CSSProperties}
                  className="grid grid-cols-1 gap-2 border-b border-ink/10 py-6 sm:grid-cols-[3.5rem_minmax(0,15rem)_minmax(0,1fr)] sm:gap-6"
                >
                  <span className="font-serif text-3xl leading-none text-accent-deep">{String(i + 1).padStart(2, "0")}</span>
                  <h4 className="text-lg font-semibold leading-snug tracking-[-0.02em]">{v.title}</h4>
                  <p className="text-[0.95rem] leading-relaxed text-stone">{v.text}</p>
                </li>
              ))}
            </ul>

            {/* Zertifizierungen */}
            <h3 data-reveal className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-stone">
              {a.certsTitle}
            </h3>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {a.certs.map((c, i) => (
                <li
                  key={c.detail}
                  data-reveal
                  style={{ "--reveal-delay": i * 70 } as React.CSSProperties}
                  className="group flex flex-col justify-between gap-6 rounded-2xl bg-ink p-5 text-paper transition-transform duration-500 ease-out-expo last:col-span-2 hover:-translate-y-1"
                >
                  <span className="font-mono text-[1.15rem] font-medium tracking-tight text-accent-2">{c.name}</span>
                  <span className="text-[0.82rem] leading-snug text-mist">{c.detail}</span>
                </li>
              ))}
            </ul>

            {/* Werdegang */}
            <h3 data-reveal className="mt-16 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-stone">
              {a.timelineTitle}
            </h3>
            <ol className="relative mt-8 space-y-0 border-l border-ink/15 pl-8">
              {a.timeline.map((t, i) => (
                <li
                  key={t.year}
                  data-reveal
                  style={{ "--reveal-delay": i * 100 } as React.CSSProperties}
                  className="relative pb-9 last:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className={
                      i === a.timeline.length - 1
                        ? "absolute -left-[2.37rem] top-1 size-3 rounded-full bg-accent ring-4 ring-accent/20"
                        : "absolute -left-[2.37rem] top-1 size-3 rounded-full border-2 border-ink/30 bg-paper"
                    }
                  />
                  <p className="font-mono text-[0.75rem] text-stone">{t.year}</p>
                  <p className="mt-1 text-lg font-semibold tracking-[-0.02em]">{t.title}</p>
                  <p className="mt-1 text-[0.95rem] text-stone">{t.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
