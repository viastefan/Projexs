"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { Close } from "@/components/ui/Icons";
import { INQUIRY_EVENT, type InquirySource } from "./InquiryTrigger";
import { InquiryForm } from "./InquiryForm";

/** Wird ausgelöst, wenn sich der Anfrage-Dialog öffnet/schließt (z. B. für das Lead-Popup). */
export const INQUIRY_STATE_EVENT = "projexs:inquiry-state";

/**
 * Anfrage-Dialog im Overlay. Nutzt das native <dialog>-Element:
 * Fokus bleibt im Dialog, Escape schließt, der Hintergrund ist gesperrt.
 * Öffnet sich über das Ereignis aus InquiryTrigger oder den Hash #anfrage.
 */
export function InquiryModal({ dict }: { dict: Dictionary }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<InquirySource>("dialog");
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ source?: InquirySource }>).detail;
      returnFocus.current = document.activeElement as HTMLElement | null;
      setSource(detail?.source ?? "dialog");
      setOpen(true);
    };
    window.addEventListener(INQUIRY_EVENT, onOpen);
    // Deep-Link: #anfrage bzw. #inquiry öffnet den Dialog über denselben Weg wie ein Klick
    if (window.location.hash === "#anfrage" || window.location.hash === "#inquiry") {
      window.dispatchEvent(new CustomEvent(INQUIRY_EVENT, { detail: { source: "dialog" } }));
    }
    return () => window.removeEventListener(INQUIRY_EVENT, onOpen);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    window.dispatchEvent(new CustomEvent(INQUIRY_STATE_EVENT, { detail: { open } }));
  }, [open]);

  const close = () => {
    setOpen(false);
    document.body.style.overflow = "";
    returnFocus.current?.focus();
  };

  return (
    <dialog
      ref={ref}
      onClose={close}
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
      aria-label={dict.inquiry.title}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-navy-night/70 backdrop:backdrop-blur-[3px] sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:w-[min(46rem,calc(100%-2rem))]"
    >
      {open && (
        <div className="animate-sheet flex h-full flex-col overflow-y-auto bg-white sm:h-auto sm:max-h-[92dvh] sm:rounded-xl sm:shadow-[0_30px_80px_-20px_rgba(4,15,58,0.6)]">
          <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-5 sm:px-8">
            <div>
              <h2 className="text-[1.25rem] font-semibold leading-snug">{dict.inquiry.title}</h2>
              <p className="mt-1 text-[0.95rem] text-stone">{dict.inquiry.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={dict.inquiry.close}
              className="grid size-11 shrink-0 place-items-center rounded-md border border-line text-navy hover:border-navy"
            >
              <Close className="size-5" />
            </button>
          </div>
          <InquiryForm dict={dict} variant="modal" source={source} />
          <p className="border-t border-line px-5 py-4 text-[0.9rem] text-stone sm:px-8">
            {dict.inquiry.pageLink}{" "}
            <Link href={dict.routes.contact} onClick={close} className="font-semibold text-navy underline underline-offset-4">
              {dict.contactPage.eyebrow}
            </Link>
          </p>
        </div>
      )}
    </dialog>
  );
}
