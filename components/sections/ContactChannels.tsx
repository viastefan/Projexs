import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { LinkedIn, Mail, MapPin, Phone } from "@/components/ui/Icons";

/** Direkte Kontaktwege – auf der Startseite und der Kontaktseite. */
export function ContactChannels({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const channels = [
    { icon: Mail, label: c.emailLabel, value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: Phone, label: c.phoneLabel, value: site.contact.phone, href: `tel:${site.contact.phoneHref}` },
    { icon: LinkedIn, label: c.linkedinLabel, value: c.linkedinText, href: site.contact.linkedin, external: true },
    { icon: MapPin, label: c.locationLabel, value: c.location },
  ];

  return (
    <ul className="divide-y divide-line border-y border-line">
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
  );
}
