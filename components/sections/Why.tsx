import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Award, Clock, Target, Users } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

const icons = [Clock, Target, Users, Award];

/** Nutzenversprechen „Warum ProjeXs“ – nur belegbare Aussagen aus dem Lebenslauf. */
export function Why({ dict }: { dict: Dictionary }) {
  const w = dict.why;

  return (
    <section id="warum" className="section border-y border-line bg-surface">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{w.eyebrow}</Eyebrow>} title={w.title} intro={w.intro} />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {w.points.map((p, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={p.title} className="card flex flex-col p-6 sm:p-7" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
                <span className="grid size-11 place-items-center rounded-md bg-navy/[0.06] text-navy">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-[1.12rem] font-semibold leading-snug">{p.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-stone">{p.text}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5" data-reveal>
          <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full sm:w-auto">
            {w.cta}
          </InquiryTrigger>
          <p className="text-[0.92rem] text-stone">{w.ctaHint}</p>
        </div>
      </div>
    </section>
  );
}
