import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

export function Process({ dict }: { dict: Dictionary }) {
  const p = dict.process;

  return (
    <section id="ablauf" className="section border-y border-line bg-surface">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{p.eyebrow}</Eyebrow>} title={p.title} intro={p.intro} />

        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
          {p.steps.map((s, i) => (
            <li key={s.title} className="relative pt-5" data-reveal style={{ "--reveal-delay": `${i * 140}ms` } as React.CSSProperties}>
              <span aria-hidden="true" className="draw-line absolute inset-x-0 top-0 h-0.5 bg-navy" />
              <span className="text-[0.85rem] font-semibold text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-[1.2rem] font-semibold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-stone">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5" data-reveal>
          <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full sm:w-auto">
            {p.cta}
          </InquiryTrigger>
          <p className="text-[0.92rem] text-stone">{dict.why.ctaHint}</p>
        </div>
      </div>
    </section>
  );
}
