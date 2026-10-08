import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Clock } from "@/components/ui/Icons";
import { ContactChannels } from "./ContactChannels";
import { ContactTabs } from "./ContactTabs";
import { ContactMap } from "./ContactMap";

/** Eigenständige Kontaktseite: Anfrage (Schritte oder klassisch), direkte Kontaktwege, Erreichbarkeit und Standort. */
export function ContactPage({ dict }: { dict: Dictionary }) {
  const c = dict.contactPage;

  return (
    <>
      <section className="border-b border-line bg-surface pb-10 pt-10 sm:pb-12 sm:pt-16">
        <div className="container-site">
          <Link href={dict.routes.home} className="inline-flex min-h-11 items-center text-[0.95rem] font-semibold text-navy underline underline-offset-4">
            ← {c.backHome}
          </Link>
          <div className="mt-4 max-w-3xl">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2rem,6vw,3.2rem)] font-semibold leading-[1.1]">{c.title}</h1>
            <p className="mt-5 text-[1.08rem] leading-relaxed text-stone">{c.intro}</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-20">
        <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="mb-5 text-[1.35rem] font-semibold">{c.formTitle}</h2>
            <ContactTabs dict={dict} />
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-surface ring-2 ring-line">
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

              <div className="mt-6 flex gap-3 rounded-lg bg-surface p-4">
                <Clock className="mt-0.5 size-5 shrink-0 text-navy" />
                <div>
                  <p className="font-semibold text-navy">{c.availabilityTitle}</p>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-stone">{c.availabilityText}</p>
                </div>
              </div>

              <h2 className="mt-8 text-[1.35rem] font-semibold">{c.mapTitle}</h2>
              <p className="mt-1 text-[0.95rem] text-stone">
                {site.address.street}, {site.address.zip} {site.address.city}
              </p>
              <div className="mt-4">
                <ContactMap dict={dict} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
