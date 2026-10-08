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

        <ol className="relative mt-12 grid gap-5 md:grid-cols-3">
          {p.steps.map((s, i) => (
            <li key={s.title} className="card relative p-6 sm:p-8" data-reveal style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}>
              <span className="grid size-12 place-items-center rounded-md bg-navy text-[1.1rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(8,32,120,0.7)]">
                {i + 1}
              </span>
              <h3 className="mt-6 text-[1.2rem] font-semibold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{s.text}</p>
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
