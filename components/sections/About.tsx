import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function About({ dict }: { dict: Dictionary }) {
  const a = dict.about;

  return (
    <section id={dict.ids.about} className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-surface">
                <Image
                  src={site.images.portrait}
                  alt={a.portraitAlt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-[50%_18%]"
                />
              </div>
              <p className="mt-5 text-[1.1rem] font-semibold text-navy">{a.name}</p>
              <p className="text-[0.98rem] text-stone">{a.roles}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Eyebrow>{a.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-[1.15]">{a.title}</h2>
            <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-stone">
              {a.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-14">
              <h3 className="text-[1.25rem] font-semibold">{a.valuesTitle}</h3>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {a.values.map((v) => (
                  <div key={v.title} className="grid gap-2 py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="font-semibold text-navy">{v.title}</dt>
                    <dd className="leading-relaxed text-stone">{v.text}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-14">
              <h3 className="text-[1.25rem] font-semibold">{a.certsTitle}</h3>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {a.certs.map((c) => (
                  <li key={c.detail} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <span className="font-semibold text-navy">{c.name}</span>
                    <span className="text-stone">{c.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-14">
              <h3 className="text-[1.25rem] font-semibold">{a.timelineTitle}</h3>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {a.timeline.map((t) => (
                  <div key={t.year + t.title} className="grid gap-1 py-4 sm:grid-cols-[6rem_12rem_1fr] sm:gap-6">
                    <dt className="font-semibold text-navy">{t.year}</dt>
                    <dd className="font-semibold">{t.title}</dd>
                    <dd className="text-stone">{t.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
