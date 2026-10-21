import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { site } from "@/content/site";
import { Logo } from "./Logo";
import { LocaleSwitch } from "./LocaleSwitch";
import { ArrowUp, LinkedIn, Mail, MapPin, Phone } from "@/components/ui/Icons";
import { ConsentSettingsButton } from "@/components/consent/ConsentSettingsButton";

const linkClass = "inline-flex min-h-10 items-center text-[0.95rem] text-mist transition-colors hover:text-white";
const headingClass = "text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-white";

export function Footer({ dict }: { dict: Dictionary }) {
  const f = dict.footer;
  const home = dict.routes.home;
  const locale = dict.locale as Locale;
  const year = new Date().getFullYear();
  const a = site.address;

  return (
    <footer className="bg-navy-night text-white">
      {/* Spalten */}
      <div className="container-site grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="col-span-2 lg:col-span-4">
          <Link href={home} aria-label={dict.nav.homeAria} className="inline-block">
            <Logo tone="light" />
          </Link>
          <p className="mt-4 text-[1.05rem] font-semibold text-white">{f.tagline}</p>
          <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-mist">{f.description}</p>
          <a
            href={site.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.95rem] font-semibold text-white hover:underline underline-offset-4"
          >
            <LinkedIn className="size-5 text-accent-light" />
            LinkedIn
          </a>
        </div>

        <nav aria-label={f.servicesTitle} className="lg:col-span-2">
          <h2 className={headingClass}>{f.servicesTitle}</h2>
          <ul className="mt-3 flex flex-col">
            {f.services.map((s) => (
              <li key={s.label}>
                <Link href={`${home}#${s.id}`} className={linkClass}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={f.navTitle} className="lg:col-span-2">
          <h2 className={headingClass}>{f.navTitle}</h2>
          <ul className="mt-3 flex flex-col">
            {dict.nav.items.map((item) => (
              <li key={item.id}>
                <Link href={`${home}#${item.id}`} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={dict.routes.contact} className={linkClass}>
                {dict.nav.contactLabel}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="col-span-2 sm:col-span-1 lg:col-span-2">
          <h2 className={headingClass}>{f.contactTitle}</h2>
          <ul className="mt-3 flex flex-col gap-1 text-[0.95rem] text-mist">
            <li className="flex gap-2.5 py-1.5">
              <MapPin className="mt-1 size-4 shrink-0 text-accent-light" />
              <address className="not-italic leading-snug">
                {site.brand} · {site.owner.name}
                <br />
                {a.street}
                <br />
                {a.zip} {a.city}
              </address>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className={`${linkClass} gap-2.5 break-all`}>
                <Mail className="size-4 shrink-0 text-accent-light" />
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.contact.phoneHref}`} className={`${linkClass} gap-2.5`}>
                <Phone className="size-4 shrink-0 text-accent-light" />
                {site.contact.phone}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label={f.legalTitle} className="lg:col-span-2">
          <h2 className={headingClass}>{f.legalTitle}</h2>
          <ul className="mt-3 flex flex-col">
            <li>
              <Link href={dict.routes.imprint} className={linkClass}>
                {f.imprint}
              </Link>
            </li>
            <li>
              <Link href={dict.routes.privacy} className={linkClass}>
                {f.privacy}
              </Link>
            </li>
            <li>
              <Link href={dict.routes.terms} hrefLang="de" className={linkClass}>
                {f.terms}
              </Link>
            </li>
            <li>
              <ConsentSettingsButton label={dict.consent.reopen} className={`${linkClass} text-left`} />
            </li>
          </ul>
        </nav>
      </div>

      {/* Copyright · Sprache · Nach oben */}
      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.85rem] text-mist/80">
            © {year} {site.brand} · {site.owner.name} · {a.city}. {f.rights}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <LocaleSwitch locale={locale} label={f.languageLabel} />
            <a href="#main" className="inline-flex min-h-11 items-center gap-1.5 text-[0.95rem] font-semibold text-white hover:underline underline-offset-4">
              {f.backToTop}
              <ArrowUp className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
