import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowUpRight, LinkedIn, Mail, MapPin, Phone } from "@/components/ui/Icons";
import { ContactForm } from "./ContactForm";

export function Contact({ dict }: { dict: Dictionary }) {
  const c = dict.contact;

  const channels = [
    { icon: Mail, label: c.emailLabel, value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Phone, label: c.phoneLabel, value: site.contact.phone, href: `tel:${site.contact.phoneHref}` },
    { icon: LinkedIn, label: c.linkedinLabel, value: c.linkedinText, href: site.contact.linkedin, external: true },
    { icon: MapPin, label: c.locationLabel, value: c.location },
  ];

  return (
    <section id={dict.ids.contact} className="grain relative isolate overflow-hidden bg-ink py-24 text-paper sm:py-32 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[10%] top-0 h-[70vh] w-[70vh] rounded-full bg-navy/50 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[5%] h-[60vh] w-[60vh] rounded-full bg-accent/[0.12] blur-[150px]" />
        <div className="bg-grid-ink absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_20%_30%,#000,transparent_65%)]" />
      </div>

      <div className="mx-auto grid max-w-[88rem] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <div className="lg:col-span-5">
          <div data-reveal>
            <Eyebrow index="07" tone="light">
              {c.eyebrow}
            </Eyebrow>
          </div>
          <h2
            data-reveal
            className="mt-6 text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[1] tracking-[-0.045em]"
          >
            {c.title}
          </h2>
          <p data-reveal className="mt-7 max-w-md text-[1.08rem] leading-relaxed text-mist">
            {c.intro}
          </p>

          <div data-reveal className="mt-10 flex items-center gap-4">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-accent/60 ring-offset-4 ring-offset-ink">
              <Image src={site.images.avatar} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <div>
              <p className="font-semibold">{site.owner.name}</p>
              <p className="text-sm text-mist">{c.personal}</p>
            </div>
          </div>

          <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {channels.map(({ icon: Icon, label, value, href, external }) => {
              const content = (
                <>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-accent-2 ring-1 ring-inset ring-white/10 transition-colors group-hover:bg-accent group-hover:text-ink">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-mist">{label}</span>
                    <span className="mt-0.5 block break-words text-[1.02rem] text-paper">{value}</span>
                  </span>
                  {href && (
                    <ArrowUpRight className="size-4 shrink-0 text-mist transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                  )}
                </>
              );
              return (
                <li key={label} data-reveal="fade">
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 py-4"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="group flex items-center gap-4 py-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div data-reveal style={{ "--reveal-delay": 150 } as React.CSSProperties} className="lg:col-span-7">
          <ContactForm dict={dict} />
        </div>
      </div>
    </section>
  );
}
