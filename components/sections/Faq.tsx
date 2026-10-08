import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

export function Faq({ dict }: { dict: Dictionary }) {
  const f = dict.faq;

  return (
    <section id={dict.ids.faq} className="section border-t border-line bg-white">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow={<Eyebrow>{f.eyebrow}</Eyebrow>} title={f.title} />
          <div className="mt-8 hidden lg:block" data-reveal>
            <InquiryTrigger href={dict.routes.contact} source="dialog" variant="secondary">
              {dict.nav.cta}
            </InquiryTrigger>
          </div>
        </div>

        <div className="lg:col-span-8" data-reveal>
          <ul className="border-t border-line">
            {f.items.map((item) => (
              <li key={item.q} className="border-b border-line">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 hover:text-navy sm:gap-6 sm:py-6">
                    <span className="text-[1.05rem] font-semibold leading-snug text-navy sm:text-[1.1rem]">{item.q}</span>
                    <span aria-hidden="true" className="shrink-0 text-2xl leading-none text-navy group-open:hidden">
                      +
                    </span>
                    <span aria-hidden="true" className="hidden shrink-0 text-2xl leading-none text-navy group-open:inline">
                      −
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-6 pr-6 leading-relaxed text-stone sm:pb-7 sm:pr-10">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
