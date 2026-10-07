import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Faq({ dict }: { dict: Dictionary }) {
  const f = dict.faq;

  return (
    <section id={dict.ids.faq} className="border-t border-line bg-surface py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[80rem] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={<Eyebrow>{f.eyebrow}</Eyebrow>} title={f.title} />
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {f.items.map((item) => (
              <li key={item.q} className="border-b border-line">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 hover:text-navy">
                    <span className="text-[1.1rem] font-semibold leading-snug text-navy">{item.q}</span>
                    <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-navy group-open:hidden">
                      +
                    </span>
                    <span aria-hidden="true" className="hidden shrink-0 text-2xl leading-none text-navy group-open:inline">
                      −
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-7 pr-10 leading-relaxed text-stone">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
