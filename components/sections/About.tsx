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
              <div className="relative mx-auto aspect-[4/4.2] w-full max-w-[15rem] sm:max-w-[26rem] overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] sm:aspect-[4/5] lg:max-w-none">
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

            <div className="mt-10">
              <h3 className="text-[1.15rem] font-semibold">{a.certsTitle}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {a.certs.map((c) => (
                  <li key={c.detail} title={c.detail} className="rounded-md border border-line bg-white px-3 py-1.5 text-[0.92rem]">
                    <span className="font-semibold text-navy">{c.name}</span>
                    <span className="text-stone"> · {c.detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <h3 className="text-[1.15rem] font-semibold">{a.timelineTitle}</h3>
              <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {a.timeline.map((t) => (
                  <li key={t.year + t.title} className="rounded-lg border border-line bg-white p-4">
                    <p className="text-[0.85rem] font-semibold text-accent">{t.year}</p>
                    <p className="mt-1 font-semibold text-navy">{t.title}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
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
