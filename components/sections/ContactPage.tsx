import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { ContactChannels } from "./ContactChannels";

/** Eigenständige Kontaktseite: mehrstufige Anfrage plus direkte Kontaktwege. */
export function ContactPage({ dict }: { dict: Dictionary }) {
  const c = dict.contactPage;

  return (
    <>
      <section className="border-b border-line bg-surface pb-12 pt-14 sm:pt-20">
        <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
          <Link href={dict.routes.home} className="text-[0.95rem] font-semibold text-navy underline underline-offset-4">
            ← {c.backHome}
          </Link>
          <div className="mt-6 max-w-3xl">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.1rem,4vw,3.2rem)] font-semibold leading-[1.1]">{c.title}</h1>
            <p className="mt-5 text-[1.1rem] leading-relaxed text-stone">{c.intro}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-[80rem] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="mb-6 text-[1.35rem] font-semibold">{c.formTitle}</h2>
            <InquiryForm dict={dict} variant="inline" />
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-surface">
                  <Image src={site.images.portrait} alt="" fill sizes="64px" className="object-cover object-[50%_15%]" />
                </span>
                <div>
                  <p className="font-semibold text-navy">{site.owner.name}</p>
                  <p className="text-[0.95rem] text-stone">{dict.about.roles}</p>
                </div>
              </div>
              <h2 className="mt-8 text-[1.35rem] font-semibold">{c.directTitle}</h2>
              <div className="mt-4">
                <ContactChannels dict={dict} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
