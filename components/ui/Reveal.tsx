"use client";

import { useEffect } from "react";

/**
 * Dezente Scroll-Reveal-Animation ohne Abhängigkeiten.
 * Markiert <html data-reveal-ready>, damit CSS die Elemente mit [data-reveal]
 * erst ausblendet, wenn JavaScript aktiv ist (kein unsichtbarer Inhalt ohne JS).
 * Beachtet prefers-reduced-motion (dann sofort sichtbar).
 */
export function RevealObserver() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const items = () => Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce || !("IntersectionObserver" in window)) {
      items().forEach((el) => el.setAttribute("data-reveal", "in"));
      return;
    }

    root.setAttribute("data-reveal-ready", "");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observe = () => items().forEach((el) => el.getAttribute("data-reveal") !== "in" && io.observe(el));
    observe();

    // Elemente, die bereits sichtbar sind (z. B. nach Hash-Navigation), sofort zeigen
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
