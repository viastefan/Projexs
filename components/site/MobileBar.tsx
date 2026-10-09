"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { Phone } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

/** Sichtbare Resthöhe, wenn die Leiste eingeklappt ist (nur der Griff). */
const PEEK = 26;
/** Bewegung unter diesem Wert gilt als Tippen, nicht als Ziehen. */
const TAP_SLOP = 6;

/**
 * Feste Aktionsleiste am unteren Rand auf Mobilgeräten.
 * Am Griff nach unten ziehen klappt sie ein, nach oben ziehen oder tippen
 * klappt sie wieder aus. Eingeklappt sind die Schaltflächen nicht erreichbar.
 */
export function MobileBar({ dict }: { dict: Dictionary }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ startY: number; startCollapsed: boolean; maxOffset: number; moved: number } | null>(null);
  const [maxOffset, setMaxOffset] = useState(80 - PEEK);

  // Höhe der Leiste messen, damit eingeklappt genau der Griff sichtbar bleibt
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const measure = () => setMaxOffset(Math.max(0, el.offsetHeight - PEEK));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const restOffset = (c: boolean, max: number) => (c ? max : 0);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    gesture.current = { startY: e.clientY, startCollapsed: collapsed, maxOffset, moved: 0 };
    setDragOffset(restOffset(collapsed, maxOffset));
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dy = e.clientY - g.startY;
    g.moved = Math.max(g.moved, Math.abs(dy));
    const base = restOffset(g.startCollapsed, g.maxOffset);
    setDragOffset(Math.min(g.maxOffset, Math.max(0, base + dy)));
  };

  const onPointerUp = () => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (g.moved < TAP_SLOP) {
      // Antippen: Zustand umschalten
      setCollapsed(!g.startCollapsed);
    } else {
      const offset = dragOffset ?? restOffset(g.startCollapsed, g.maxOffset);
      setCollapsed(offset > g.maxOffset / 2);
    }
    setDragOffset(null);
  };

  const offset = dragOffset ?? restOffset(collapsed, maxOffset);
  const dragging = dragOffset !== null;

  return (
    <div
      ref={barRef}
      style={{ transform: `translateY(${offset}px)`, transition: dragging ? "none" : "transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 shadow-[0_-10px_30px_-18px_rgba(8,32,120,0.35)] backdrop-blur lg:hidden"
    >
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-expanded={!collapsed}
        aria-label={collapsed ? dict.mobileBar.expand : dict.mobileBar.collapse}
        className="flex h-[26px] w-full touch-none select-none items-center justify-center"
      >
        <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-navy/25" />
      </button>

      <div inert={collapsed} className="grid grid-cols-2 gap-2 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <a
          href={`tel:${site.contact.phoneHref}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-navy text-[0.95rem] font-semibold text-navy"
        >
          <Phone className="size-4" />
          {dict.mobileBar.call}
        </a>
        <InquiryTrigger href={dict.routes.contact} source="dialog" className="h-12 text-[0.95rem]">
          {dict.mobileBar.inquire}
        </InquiryTrigger>
      </div>
    </div>
  );
}
