import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowRight } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";
import { ContactChannels } from "./ContactChannels";

export function Contact({ dict }: { dict: Dictionary }) {
  const c = dict.contact;

  return (
    <section id={dict.ids.contact} className="section border-t border-line bg-surface">
      <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6" data-reveal>
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-[1.12]">{c.title}</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-stone">{c.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full sm:w-auto">
              {c.stepperCta}
            </InquiryTrigger>
            <Link
              href={dict.routes.contact}
              className="inline-flex h-12 items-center justify-center gap-1.5 rounded-md border border-navy px-6 font-semibold text-navy hover:bg-white"
            >
              {c.pageCta}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6" data-reveal>
          <ContactChannels dict={dict} />
        </div>
      </div>
    </section>
  );
}
