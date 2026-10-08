"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Close, Phone } from "@/components/ui/Icons";
import { INQUIRY_STATE_EVENT } from "@/components/inquiry/InquiryModal";
import { openInquiry } from "@/components/inquiry/InquiryTrigger";

const SESSION_KEY = "projexs:lead-shown";
const DELAY_MS = 25_000;
const SCROLL_RATIO = 0.6;

/**
 * Lead-Popup: einmal pro Sitzung, nach ca. 25 s, bei Exit-Intent (Desktop)
 * oder nach 60 % Scrolltiefe (mobil). Nicht auf Rechts-/Kontaktseiten und
 * nicht, solange der Anfrage-Dialog oder der Consent-Banner offen ist.
 * Mobil als Bottom-Sheet, schließbar per X, Escape und Klick außerhalb.
 */
export function LeadPopup({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const l = dict.lead;
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const inquiryOpen = useRef(false);

  const excluded = [dict.routes.contact, dict.routes.imprint, dict.routes.privacy, dict.routes.terms].some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  useEffect(() => {
    if (excluded) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ohne Speicher trotzdem einmal zeigen */
    }

    let done = false;
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    const cleanups: Array<() => void> = [];

    const show = () => {
      if (done) return;
      // Nicht über den Anfrage-Dialog oder den Consent-Banner legen – später erneut versuchen
      if (inquiryOpen.current || document.querySelector("[data-consent-banner]") || document.querySelector("dialog[open]")) {
        const t = window.setTimeout(show, 8_000);
        cleanups.push(() => window.clearTimeout(t));
        return;
      }
      done = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignorieren */
      }
      setOpen(true);
      cleanups.forEach((fn) => fn());
    };

    const onInquiry = (e: Event) => {
      inquiryOpen.current = Boolean((e as CustomEvent<{ open: boolean }>).detail?.open);
    };
    window.addEventListener(INQUIRY_STATE_EVENT, onInquiry);
    cleanups.push(() => window.removeEventListener(INQUIRY_STATE_EVENT, onInquiry));

    const timer = window.setTimeout(show, DELAY_MS);
    cleanups.push(() => window.clearTimeout(timer));

    if (mobile) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max > 0 && window.scrollY / max >= SCROLL_RATIO) show();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
    } else {
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && e.relatedTarget === null) show();
      };
      document.addEventListener("mouseout", onLeave);
      cleanups.push(() => document.removeEventListener("mouseout", onLeave));
    }

    return () => cleanups.forEach((fn) => fn());
  }, [excluded]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const close = () => setOpen(false);

  if (excluded) return null;

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-labelledby="lead-title"
      className="fixed inset-x-0 bottom-0 top-auto m-0 mx-auto w-full max-w-none bg-transparent p-0 backdrop:bg-navy-night/55 backdrop:backdrop-blur-[2px] sm:inset-0 sm:m-auto sm:w-[min(30rem,calc(100%-2rem))]"
    >
      {open && (
        <div className="animate-sheet relative overflow-hidden rounded-t-2xl bg-white p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(4,15,58,0.5)] sm:rounded-2xl sm:p-8 sm:pb-8">
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy via-accent to-accent-light" />
          <button
            type="button"
            onClick={close}
            aria-label={l.close}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-md text-stone hover:bg-surface hover:text-navy"
          >
            <Close className="size-5" />
          </button>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-accent">{site.brand} · {site.owner.name}</p>
          <h2 id="lead-title" className="mt-2 pr-10 text-[1.5rem] font-semibold leading-tight">
            {l.title}
          </h2>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-stone">{l.text}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                close();
                openInquiry("popup");
              }}
              className="inline-flex h-12 items-center justify-center rounded-md bg-navy px-5 font-semibold text-white hover:bg-navy-deep"
            >
              {l.primary}
            </button>
            <a
              href={`tel:${site.contact.phoneHref}`}
              onClick={close}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-navy px-5 font-semibold text-navy hover:bg-navy hover:text-white"
            >
              <Phone className="size-4" />
              {l.call}
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
