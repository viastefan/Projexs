import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

export function About({ dict }: { dict: Dictionary }) {
  const a = dict.about;

  return (
    <section id={dict.ids.about} className="section border-t border-line bg-surface">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28" data-reveal>
              <div className="relative mx-auto aspect-[4/4.2] w-full max-w-[26rem] overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] sm:aspect-[4/5] lg:max-w-none">
                <Image
                  src={site.images.portrait}
                  alt={a.portraitAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 38vw, (min-width: 640px) 26rem, 90vw"
                  className="object-cover object-[50%_18%]"
                />
              </div>
              <p className="mt-5 text-[1.1rem] font-semibold text-navy">{a.name}</p>
              <p className="text-[0.98rem] text-stone">{a.roles}</p>
            </div>
          </div>

          <div className="lg:col-span-7" data-reveal>
            <Eyebrow>{a.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-[1.12]">{a.title}</h2>
            <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-stone">
              {a.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-12">
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

            <div className="mt-12">
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

            <div className="mt-12">
              <h3 className="text-[1.25rem] font-semibold">{a.timelineTitle}</h3>
              <dl className="mt-5 divide-y divide-line border-y border-line">
                {a.timeline.map((t) => (
                  <div key={t.year + t.title} className="grid gap-0.5 py-4 sm:grid-cols-[6rem_12rem_1fr] sm:gap-6">
                    <dt className="font-semibold text-navy">{t.year}</dt>
                    <dd className="font-semibold">{t.title}</dd>
                    <dd className="text-stone">{t.text}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full sm:w-auto">
                {dict.nav.cta}
              </InquiryTrigger>
              <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-navy underline underline-offset-4">
                {dict.contact.linkedinLabel}: {dict.contact.linkedinText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
