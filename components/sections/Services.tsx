import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";
import { ArrowRight, Check } from "@/components/ui/Icons";

export function Services({ dict }: { dict: Dictionary }) {
  const s = dict.services;

  return (
    <section id={dict.ids.services} className="section bg-white">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{s.eyebrow}</Eyebrow>} title={s.title} intro={s.intro} />

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {s.roles.map((role, i) => (
            <li key={role.title} className="card flex flex-col p-6 sm:p-8" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <span className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-[1.3rem] font-semibold leading-snug">{role.title}</h3>
              <p className="mt-4 leading-relaxed text-stone">{role.text}</p>
              <ul className="mt-6 flex-1 space-y-2 border-t border-line pt-5 text-[0.98rem] text-ink">
                {role.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.2} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <InquiryTrigger href={dict.routes.contact} source="dialog" variant="plain" className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-navy hover:underline underline-offset-4">
                {dict.nav.cta}
                <ArrowRight className="size-4" />
              </InquiryTrigger>
            </li>
          ))}
        </ol>

        <div className="mt-16 sm:mt-20">
          <h3 className="text-[1.4rem] font-semibold" data-reveal>{s.situationsTitle}</h3>
          <dl className="mt-6 grid gap-x-12 md:grid-cols-2">
            {s.situations.map((item) => (
              <div key={item.title} className="border-t border-line py-6 sm:py-7" data-reveal>
                <dt className="text-[1.1rem] font-semibold text-navy">{item.title}</dt>
                <dd className="mt-2 leading-relaxed text-stone">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
