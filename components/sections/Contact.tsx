import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LinkedIn, Mail, MapPin, Phone } from "@/components/ui/Icons";
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
    <section id={dict.ids.contact} className="border-t border-line bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto grid max-w-[80rem] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-[1.15]">{c.title}</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-stone">{c.intro}</p>
          <p className="mt-4 font-semibold text-navy">{c.personal}</p>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {channels.map(({ icon: Icon, label, value, href, external }) => {
              const content = (
                <>
                  <Icon className="mt-1 size-5 shrink-0 text-navy" />
                  <span className="min-w-0">
                    <span className="block text-[0.9rem] text-stone">{label}</span>
                    <span className="mt-0.5 block break-words text-[1.02rem] font-semibold text-ink">{value}</span>
                  </span>
                </>
              );
              return (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex items-start gap-4 py-4 hover:text-navy"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 py-4">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <ContactForm dict={dict} />
        </div>
      </div>
    </section>
  );
}
