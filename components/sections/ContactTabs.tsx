"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { ContactForm } from "./ContactForm";

/** Umschalter auf der Kontaktseite: Schritt-für-Schritt-Anfrage oder klassisches Formular. */
export function ContactTabs({ dict }: { dict: Dictionary }) {
  const c = dict.contactPage;
  const [tab, setTab] = useState<"stepper" | "classic">("stepper");
  const id = useId();
  const tabs = [
    { key: "stepper" as const, label: c.tabStepper },
    { key: "classic" as const, label: c.tabClassic },
  ];

  return (
    <div>
      <div role="tablist" aria-label={c.formTitle} className="inline-grid w-full grid-cols-2 gap-1 rounded-lg bg-surface p-1 sm:w-auto sm:min-w-[22rem]">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            id={`${id}-tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`${id}-panel-${t.key}`}
            onClick={() => setTab(t.key)}
            className={cn(
              "h-11 rounded-md px-4 text-[0.95rem] font-semibold transition-colors",
              tab === t.key ? "bg-white text-navy shadow-[var(--shadow-card)]" : "text-stone hover:text-navy",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`${id}-panel-${t.key}`}
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={tab !== t.key}
          className="mt-6"
        >
          {t.key === "stepper" ? (
            <InquiryForm dict={dict} variant="inline" source="contact-page" />
          ) : (
            <ContactForm dict={dict} source="contact-page" />
          )}
        </div>
      ))}
    </div>
  );
}
