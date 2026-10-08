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
    <section id={dict.ids.contact} className="border-t border-line bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[80rem] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-[1.15]">{c.title}</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-stone">{c.intro}</p>
          <p className="mt-4 font-semibold text-navy">{c.personal}</p>

          <div className="mt-8 rounded-lg bg-surface p-6">
            <p className="font-semibold text-navy">{c.stepperTeaser}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <InquiryTrigger href={dict.routes.contact}>{c.stepperCta}</InquiryTrigger>
              <Link href={dict.routes.contact} className="inline-flex items-center gap-1.5 font-semibold text-navy underline underline-offset-4">
                {c.pageCta}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="mt-10">
            <ContactChannels dict={dict} />
          </div>
        </div>

        <div className="lg:col-span-7">
          <ContactForm dict={dict} />
        </div>
      </div>
    </section>
  );
}
