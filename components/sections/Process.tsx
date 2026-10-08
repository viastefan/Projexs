import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

export function Process({ dict }: { dict: Dictionary }) {
  const p = dict.process;

  return (
    <section className="border-y border-line bg-surface py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <SectionHeading eyebrow={<Eyebrow>{p.eyebrow}</Eyebrow>} title={p.title} intro={p.intro} />

        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[2.1rem] hidden h-px bg-line md:block" />
          {p.steps.map((s, i) => (
            <li key={s.title} className="relative rounded-lg border border-line bg-white p-7 sm:p-8">
              <span className="grid size-12 place-items-center rounded-md bg-navy text-[1.1rem] font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-6 text-[1.2rem] font-semibold">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <InquiryTrigger href={dict.routes.contact}>{p.cta}</InquiryTrigger>
        </div>
      </div>
    </section>
  );
}
