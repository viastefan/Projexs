import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Logo, XMark } from "./Logo";
import { ArrowUp, ArrowUpRight, LinkedIn, Mail, Phone } from "@/components/ui/Icons";

export function Footer({ dict }: { dict: Dictionary }) {
  const home = dict.routes.home;
  const roles = site.owner.roles[dict.locale as "de" | "en"];
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="mx-auto max-w-[88rem] px-5 pb-10 pt-20 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href={home} aria-label={dict.nav.homeAria} className="inline-block">
              <Logo className="text-[1.8rem]" />
            </Link>
            <p className="mt-6 max-w-sm font-serif text-[1.7rem] leading-[1.15] text-paper/90">{dict.footer.tagline}</p>
            <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-mist">
              {site.owner.name} · {roles.join(" · ")}
            </p>
          </div>

          <nav aria-label={dict.footer.navTitle} className="lg:col-span-2">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-mist">{dict.footer.navTitle}</h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {dict.nav.items.map((item) => (
                <li key={item.id}>
                  <Link href={`${home}#${item.id}`} className="text-paper/80 transition-colors hover:text-accent-2">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${home}#${dict.ids.contact}`} className="text-paper/80 transition-colors hover:text-accent-2">
                  {dict.nav.contactLabel}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-mist">{dict.footer.contactTitle}</h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2.5 text-paper/80 transition-colors hover:text-accent-2">
                  <Mail className="size-4 shrink-0 text-accent" />
                  <span className="break-all">{site.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phoneHref}`} className="inline-flex items-center gap-2.5 text-paper/80 transition-colors hover:text-accent-2">
                  <Phone className="size-4 shrink-0 text-accent" />
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-paper/80 transition-colors hover:text-accent-2"
                >
                  <LinkedIn className="size-4 shrink-0 text-accent" />
                  LinkedIn
                  <ArrowUpRight className="size-3.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label={dict.footer.legalTitle} className="lg:col-span-2">
            <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-mist">{dict.footer.legalTitle}</h2>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <Link href={dict.routes.imprint} className="text-paper/80 transition-colors hover:text-accent-2">
                  {dict.footer.imprint}
                </Link>
              </li>
              <li>
                <Link href={dict.routes.privacy} className="text-paper/80 transition-colors hover:text-accent-2">
                  {dict.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href={dict.routes.terms} hrefLang="de" className="text-paper/80 transition-colors hover:text-accent-2">
                  {dict.footer.terms}
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Großes Markenzeichen als Abschluss */}
        <div aria-hidden="true" className="pointer-events-none mt-20 select-none overflow-hidden">
          <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-8">
            <span className="font-sans text-[clamp(4.5rem,17vw,15.5rem)] font-semibold leading-[0.78] tracking-[-0.06em] text-white/[0.05]">
              Proje
              <XMark className="inline-block h-[0.66em] w-[0.66em] align-baseline text-white/[0.05] opacity-80" />
              s
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm text-mist sm:flex-row sm:items-center">
          <p>
            © {year} {site.brand} · {site.owner.name}. {dict.footer.rights}
          </p>
          <a href="#top" className="group inline-flex items-center gap-2 transition-colors hover:text-paper">
            {dict.footer.backToTop}
            <span className="grid size-8 place-items-center rounded-full ring-1 ring-inset ring-white/15 transition-transform duration-300 group-hover:-translate-y-0.5">
              <ArrowUp className="size-4" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
