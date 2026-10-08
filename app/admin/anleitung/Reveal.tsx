'use client';

import { useEffect } from 'react';

/*
 * Blendet Abschnitte beim Scrollen weich ein und lässt die Filme nur laufen,
 * solange sie zu sehen sind — das schont Akku und Prozessor.
 */
export function Reveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.reveal = 'on';

    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = 'true';
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    const play = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).dataset.play = entry.isIntersecting ? 'true' : 'false';
        }
      },
      { threshold: 0.25 },
    );

    document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element));
    document.querySelectorAll('[data-play]').forEach((element) => play.observe(element));
    return () => {
      reveal.disconnect();
      play.disconnect();
      delete root.dataset.reveal;
    };
  }, []);

  return null;
}
