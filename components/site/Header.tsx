"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { alternatePath } from "@/lib/i18n";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Menu, Close, Phone } from "@/components/ui/Icons";

export function Header({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const locale = dict.locale as Locale;
  const home = dict.routes.home;
  const sectionHref = (id: string) => `${home === "/" ? "" : home}#${id}`;
  const switchHref = alternatePath(pathname, locale === "de" ? "en" : "de");
  const [open, setOpen] = useState(false);

  // Mobiles Menü mit Escape schließen
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [...dict.nav.items, { label: dict.nav.contactLabel, id: dict.ids.contact }];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:bg-navy focus:px-5 focus:py-3 focus:text-white"
      >
        {dict.nav.skip}
      </a>

      <header className="sticky top-0 z-50 border-b border-line bg-white">
        <div className="mx-auto flex h-[4.5rem] max-w-[80rem] items-center justify-between gap-6 px-5 sm:px-8">
          <Link href={home} aria-label={dict.nav.homeAria} className="text-navy" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav aria-label={dict.nav.menuTitle} className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {links.map((item) => (
                <li key={item.id}>
                  <Link href={sectionHref(item.id)} className="text-[0.98rem] text-ink hover:text-navy hover:underline underline-offset-4">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${site.contact.phoneHref}`}
              className="hidden items-center gap-2 text-[0.98rem] font-semibold text-navy xl:inline-flex"
            >
              <Phone className="size-4" />
              {site.contact.phone}
            </a>
            <Link
              href={switchHref}
              hrefLang={locale === "de" ? "en" : "de"}
              aria-label={dict.nav.switchAria}
              className="grid h-10 min-w-10 place-items-center rounded-[3px] border border-line px-3 text-sm font-semibold text-navy hover:border-navy"
            >
              {dict.nav.switchLabel}
            </Link>
            <Link
              href={sectionHref(dict.ids.contact)}
              className="hidden h-10 items-center rounded-[3px] bg-navy px-5 text-[0.95rem] font-semibold text-white hover:bg-navy-deep md:inline-flex"
            >
              {dict.nav.cta}
            </Link>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-[3px] border border-line text-navy lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <nav
          id="mobile-menu"
          aria-label={dict.nav.menuTitle}
          className={cn("border-t border-line bg-white lg:hidden", !open && "hidden")}
        >
          <ul className="mx-auto flex max-w-[80rem] flex-col px-5 py-2 sm:px-8">
            {links.map((item) => (
              <li key={item.id} className="border-b border-line last:border-b-0">
                <Link
                  href={sectionHref(item.id)}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-[1.05rem] font-semibold text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="py-5">
              <Link
                href={sectionHref(dict.ids.contact)}
                onClick={() => setOpen(false)}
                className="inline-flex h-12 w-full items-center justify-center rounded-[3px] bg-navy text-base font-semibold text-white"
              >
                {dict.nav.cta}
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
