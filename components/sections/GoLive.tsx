import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function GoLive({ dict }: { dict: Dictionary }) {
  const g = dict.golive;

  return (
    <section id={dict.ids.golive} aria-labelledby="golive-title" className="section bg-white">
      <div className="container-site grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="relative mx-auto aspect-[4/4.2] w-full max-w-[26rem] overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-card)] sm:aspect-[4/5] lg:col-span-5 lg:max-w-none" data-reveal>
          <Image
            src={site.images.golive}
            alt={g.photoAlt}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 38vw, (min-width: 640px) 26rem, 90vw"
            className="object-cover object-[50%_20%]"
          />
        </div>

        <div className="lg:col-span-7" data-reveal>
          <Eyebrow>{g.eyebrow}</Eyebrow>
          <h2 id="golive-title" className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-[1.15]">
            {g.title}
          </h2>

          <blockquote className="mt-8 border-l-[3px] border-accent pl-6">
            <p className="text-[1.2rem] leading-relaxed text-ink">{g.quote}</p>
            <p className="mt-4 text-[1.2rem] font-semibold leading-relaxed text-navy">{g.quoteTail}</p>
            <footer className="mt-5 text-[0.95rem] text-stone">— {g.author}</footer>
          </blockquote>

          <div className="mt-10 border-t border-line pt-8">
            <h3 className="text-[1.1rem] font-semibold">{g.checklistTitle}</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {g.checklist.map((item) => (
                <li key={item} className="flex gap-3 text-ink">
                  <span aria-hidden="true" className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
