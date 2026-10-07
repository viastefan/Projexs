"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Blendet Elemente mit [data-reveal] beim Hineinscrollen ein.
 * Elemente, die beim Laden bereits sichtbar sind, werden sofort gezeigt –
 * so entsteht kein Flackern und ohne JavaScript bleibt alles sichtbar.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const viewport = window.innerHeight;

    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewport * 0.98 && rect.bottom > 0) el.classList.add("is-in");
    }
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.filter((el) => !el.classList.contains("is-in")).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
