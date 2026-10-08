import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";
import { ContactChannels } from "./ContactChannels";
import { ContactForm } from "./ContactForm";

export function Contact({ dict }: { dict: Dictionary }) {
  const c = dict.contact;

  return (
    <section id={dict.ids.contact} className="section border-t border-line bg-surface">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5" data-reveal>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-[1.12]">{c.title}</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-stone">{c.intro}</p>
          <p className="mt-4 font-semibold text-navy">{c.personal}</p>

          <div className="mt-8 rounded-xl border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
            <p className="font-semibold text-navy">{c.stepperTeaser}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full sm:w-auto">
                {c.stepperCta}
              </InquiryTrigger>
              <Link href={dict.routes.contact} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-navy underline underline-offset-4">
                {c.pageCta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <ContactChannels dict={dict} />
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal>
          <ContactForm dict={dict} source="form" />
        </div>
      </div>
    </section>
  );
}
