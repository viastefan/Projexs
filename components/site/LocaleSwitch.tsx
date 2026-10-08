"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { alternatePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Sprachumschalter im Footer – verlinkt immer auf die passende Seite der anderen Sprache. */
export function LocaleSwitch({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const items: Array<{ code: Locale; name: string }> = [
    { code: "de", name: "Deutsch" },
    { code: "en", name: "English" },
  ];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-[0.85rem] uppercase tracking-[0.06em] text-mist">{label}</span>
      <ul className="flex gap-1 rounded-md border border-white/15 p-1">
        {items.map((it) => (
          <li key={it.code}>
            {it.code === locale ? (
              <span aria-current="true" className="inline-flex h-9 items-center rounded bg-white/15 px-3 text-[0.9rem] font-semibold text-white">
                {it.name}
              </span>
            ) : (
              <Link
                href={alternatePath(pathname, it.code)}
                hrefLang={it.code}
                lang={it.code}
                className="inline-flex h-9 items-center rounded px-3 text-[0.9rem] text-mist hover:bg-white/10 hover:text-white"
              >
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
