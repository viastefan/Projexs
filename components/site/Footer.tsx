import Link from "next/link";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Logo } from "./Logo";

export function Footer({ dict }: { dict: Dictionary }) {
  const home = dict.routes.home;
  const roles = site.owner.roles[dict.locale as "de" | "en"];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto grid max-w-[80rem] gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Link href={home} aria-label={dict.nav.homeAria} className="inline-block text-white">
            <Logo markClassName="text-accent-light" />
          </Link>
          <p className="mt-5 max-w-xs text-[0.98rem] text-mist">{dict.footer.tagline}</p>
          <p className="mt-3 text-[0.9rem] text-mist">{roles.join(" · ")}</p>
        </div>

        <nav aria-label={dict.footer.navTitle}>
          <h2 className="text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-mist">{dict.footer.navTitle}</h2>
          <ul className="mt-3 space-y-1">
            {dict.nav.items.map((item) => (
              <li key={item.id}>
                <Link href={`${home}#${item.id}`} className="inline-block py-1 hover:underline underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={`${home}#${dict.ids.contact}`} className="inline-block py-1 hover:underline underline-offset-4">
                {dict.nav.contactLabel}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-mist">{dict.footer.contactTitle}</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <a href={`mailto:${site.contact.email}`} className="inline-block break-all py-1 hover:underline underline-offset-4">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.contact.phoneHref}`} className="inline-block py-1 hover:underline underline-offset-4">
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:underline underline-offset-4">
                LinkedIn
              </a>
            </li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-x-5 text-[0.95rem]">
            <li>
              <Link href={dict.routes.imprint} className="inline-block py-1.5 hover:underline underline-offset-4">
                {dict.footer.imprint}
              </Link>
            </li>
            <li>
              <Link href={dict.routes.privacy} className="inline-block py-1.5 hover:underline underline-offset-4">
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={dict.routes.terms} hrefLang="de" className="inline-block py-1.5 hover:underline underline-offset-4">
                {dict.footer.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <p className="mx-auto max-w-[80rem] px-5 py-6 text-[0.9rem] text-mist sm:px-8">
          © {year} {site.brand} · {site.owner.name}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
