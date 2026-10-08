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
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

/**
 * Kopfzeile. Auf der Startseite liegt sie transparent über dem dunklen Hero
 * (weiße Typo) und wird beim Scrollen weiß mit Schatten; auf Unterseiten
 * ist sie von Anfang an weiß.
 */
export function Header({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const locale = dict.locale as Locale;
  const home = dict.routes.home;
  const isHome = pathname === home || pathname === `${home}/`;
  const sectionHref = (id: string) => `${home}#${id}`;
  const switchHref = alternatePath(pathname, locale === "de" ? "en" : "de");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Beim Scrollen von transparent zu weiß wechseln (nur Startseite relevant)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobiles Menü mit Escape schließen (Links schließen es beim Klick)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = isHome && !scrolled && !open;

  const links = [
    ...dict.nav.items.map((item) => ({ label: item.label, href: sectionHref(item.id) })),
    { label: dict.nav.contactLabel, href: dict.routes.contact },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-5 focus:py-3 focus:text-white"
      >
        {dict.nav.skip}
      </a>

      <header
        data-tone={dark ? "dark" : "light"}
        className={cn(
          "inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          isHome ? "fixed" : "sticky",
          dark
            ? "border-b border-transparent bg-transparent"
            : "border-b border-line/80 bg-white/92 shadow-[0_8px_30px_-18px_rgba(8,32,120,0.35)] backdrop-blur-md",
        )}
      >
        <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
          <Link href={home} aria-label={dict.nav.homeAria} onClick={() => setOpen(false)}>
            <Logo tone={dark ? "light" : "dark"} />
          </Link>

          <nav aria-label={dict.nav.menuTitle} className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "text-[0.98rem] underline-offset-[6px] transition-colors hover:underline aria-[current=page]:font-semibold",
                      dark ? "text-white/85 hover:text-white aria-[current=page]:text-white" : "text-ink hover:text-navy aria-[current=page]:text-navy",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`tel:${site.contact.phoneHref}`}
              className={cn(
                "hidden items-center gap-2 text-[0.98rem] font-semibold xl:inline-flex",
                dark ? "text-white" : "text-navy",
              )}
            >
              <Phone className="size-4" />
              {site.contact.phone}
            </a>
            <Link
              href={switchHref}
              hrefLang={locale === "de" ? "en" : "de"}
              aria-label={dict.nav.switchAria}
              className={cn(
                "grid h-11 min-w-11 place-items-center rounded-md border px-3 text-sm font-semibold transition-colors",
                dark ? "border-white/35 text-white hover:border-white" : "border-line text-navy hover:border-navy",
              )}
            >
              {dict.nav.switchLabel}
            </Link>
            <InquiryTrigger
              href={dict.routes.contact}
              source="dialog"
              variant={dark ? "light" : "primary"}
              display="hidden md:inline-flex"
              className="h-11 px-5 text-[0.95rem]"
            >
              {dict.nav.cta}
            </InquiryTrigger>
            <button
              type="button"
              className={cn(
                "grid size-11 place-items-center rounded-md border transition-colors lg:hidden",
                dark ? "border-white/35 text-white" : "border-line text-navy",
              )}
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
          <ul className="container-site flex max-h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto py-2">
            {links.map((item) => (
              <li key={item.href} className="border-b border-line last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 text-[1.05rem] font-semibold text-navy"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-3 py-5">
              <InquiryTrigger href={dict.routes.contact} source="dialog" className="w-full">
                {dict.nav.cta}
              </InquiryTrigger>
              <a
                href={`tel:${site.contact.phoneHref}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-navy font-semibold text-navy"
              >
                <Phone className="size-4" />
                {site.contact.phone}
              </a>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
