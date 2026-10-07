"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { alternatePath } from "@/lib/i18n";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ArrowRight, Close, Mail, Menu } from "@/components/ui/Icons";

export function Header({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const locale = dict.locale as Locale;
  const home = dict.routes.home;
  const isHome = pathname === home;
  const sectionHref = (id: string) => (isHome ? `#${id}` : `${home}#${id}`);
  const switchHref = alternatePath(pathname, locale === "de" ? "en" : "de");

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hintergrund des Headers nach dem ersten Scrollen
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Aktiven Abschnitt in der Navigation markieren
  useEffect(() => {
    if (!isHome) return;
    const ids = dict.nav.items.map((i) => i.id).concat(dict.ids.contact);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome, dict]);

  const close = useCallback(() => {
    setOpen(false);
    burgerRef.current?.focus();
  }, []);

  // Mobile-Menü: Scroll sperren, Escape schließt, Fokus im Dialog halten
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel) {
        const focusables = Array.from(panel.querySelectorAll<HTMLElement>("a, button"));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Menü bei Breakpoint-Wechsel auf Desktop schließen
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-accent px-5 py-3 font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {dict.nav.skip}
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-white/[0.08] bg-ink/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[88rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Link href={home} aria-label={dict.nav.homeAria} className="relative z-10 text-paper" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <nav aria-label={dict.nav.menuTitle} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {dict.nav.items.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={sectionHref(item.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-300",
                        isActive ? "text-paper" : "text-mist hover:text-paper",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-500 ease-out-expo",
                          isActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <Link
              href={switchHref}
              hrefLang={locale === "de" ? "en" : "de"}
              aria-label={dict.nav.switchAria}
              className="grid h-10 min-w-10 place-items-center rounded-full px-3 font-mono text-xs font-medium tracking-[0.12em] text-mist ring-1 ring-inset ring-white/15 transition-colors hover:text-paper hover:ring-white/40"
            >
              {dict.nav.switchLabel}
            </Link>
            <Link
              href={sectionHref(dict.ids.contact)}
              className="group hidden h-10 items-center gap-2 rounded-full bg-accent pl-5 pr-4 text-[0.9rem] font-medium text-ink transition-colors hover:bg-accent-2 sm:inline-flex"
            >
              {dict.nav.cta}
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <button
              ref={burgerRef}
              type="button"
              className="grid size-10 place-items-center rounded-full text-paper ring-1 ring-inset ring-white/15 transition-colors hover:ring-white/40 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.nav.menuClose : dict.nav.menuOpen}
              onClick={() => (open ? close() : setOpen(true))}
            >
              {open ? <Close className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-Menü */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.nav.menuTitle}
        className={cn(
          "fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-[4.5rem] text-paper transition-[opacity,visibility,clip-path] duration-700 ease-out-expo lg:hidden",
          open
            ? "visible opacity-100 [clip-path:inset(0_0_0_0)]"
            : "invisible opacity-0 [clip-path:inset(0_0_100%_0)]",
        )}
      >
        <div className="bg-grid-ink pointer-events-none absolute inset-0 opacity-60 mask-fade-b" aria-hidden="true" />
        <nav aria-label={dict.nav.menuTitle} className="relative flex flex-1 flex-col px-5 pb-10 pt-8 sm:px-8">
          <ul className="flex flex-col">
            {[...dict.nav.items, { id: dict.ids.contact, label: dict.nav.contactLabel }].map((item, i) => (
              <li
                key={item.id}
                className={cn(
                  "border-b border-white/10 transition-all duration-700 ease-out-expo",
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
              >
                <Link
                  href={sectionHref(item.id)}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className="group flex items-baseline justify-between gap-4 py-4"
                >
                  <span className="font-serif text-[2.6rem] leading-none tracking-[-0.01em] transition-colors group-hover:text-accent">
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-mist">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <Link
              href={sectionHref(dict.ids.contact)}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-accent text-base font-medium text-ink"
            >
              {dict.nav.cta}
              <ArrowRight className="size-5" />
            </Link>
            <a
              href={`mailto:${site.contact.email}`}
              tabIndex={open ? 0 : -1}
              className="inline-flex items-center justify-center gap-2 py-2 text-sm text-mist hover:text-paper"
            >
              <Mail className="size-4" />
              {site.contact.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
