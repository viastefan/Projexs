"use client";

import Link from "next/link";
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import styles from "@/app/admin/(app)/pages.module.css";
import type { InquiryStatus } from "@/lib/cms/types";
import { InquiryChip } from "./Chips";
import ui from "./ui.module.css";

export type InquiryListItem = {
  key: string;
  name: string;
  preview: string;
  status: InquiryStatus;
  read: boolean;
  locale: "de" | "en";
  /** Schon auf dem Server formatiert — gleiche Zeitzone für alle */
  time: string;
};

const FILTERS = [
  { key: "offen", label: "Offen", match: (status: InquiryStatus) => status !== "erledigt" },
  { key: "erledigt", label: "Erledigt", match: (status: InquiryStatus) => status === "erledigt" },
  { key: "alle", label: "Alle", match: () => true },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/**
 * Postfach wie in Apple Mail: am großen Bildschirm links die Liste, rechts
 * die geöffnete Anfrage. Auf dem Handy: erst die Liste, dann die Anfrage.
 */
export function InquiryMail({
  items,
  retentionMonths,
  children,
}: {
  items: InquiryListItem[];
  retentionMonths: number;
  children: React.ReactNode;
}) {
  const openKey = useSelectedLayoutSegment();
  const params = useSearchParams();
  const [filter, setFilter] = useState<FilterKey>(
    () => FILTERS.find((item) => item.key === params.get("filter"))?.key ?? "offen",
  );
  const active = FILTERS.find((item) => item.key === filter) ?? FILTERS[0];
  const shown = items.filter((item) => active.match(item.status));

  return (
    <div className={styles.mail} data-view={openKey ? "detail" : "list"}>
      <div className={styles.mailList}>
        <header className={styles.header}>
          <p className={ui.eyebrow}>Postfach</p>
          <h1 className={ui.pageTitle}>Anfragen</h1>
          <p className={ui.lead}>
            Alles, was über die Website hereinkommt. Erledigte Anfragen werden nach {retentionMonths} Monaten
            automatisch gelöscht.
          </p>
        </header>

        {!openKey && params.get("geloescht") ? (
          <div className={`${ui.notice} ${ui.noticeOk}`} role="status">
            <CheckCircle2 aria-hidden="true" />
            <span>Die Anfrage ist endgültig gelöscht.</span>
          </div>
        ) : null}

        <div className={styles.filters} role="group" aria-label="Filter">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={styles.filter}
              aria-pressed={item.key === filter}
              onClick={() => setFilter(item.key)}
            >
              {item.label} <span className={ui.tabularNums}>{items.filter((entry) => item.match(entry.status)).length}</span>
            </button>
          ))}
        </div>

        <section className={`${ui.card} ${styles.mailCard}`} aria-label={`Anfragen: ${active.label}`}>
          {shown.length === 0 ? (
            <p className={ui.empty}>
              {active.key === "offen" ? "Keine offenen Anfragen. Alles erledigt." : "Hier ist gerade nichts."}
            </p>
          ) : (
            <div className={styles.list}>
              {shown.map((item) => (
                <Link
                  key={item.key}
                  href={`/admin/anfragen/${item.key}`}
                  className={styles.listItem}
                  aria-current={item.key === openKey ? "page" : undefined}
                >
                  <span className={styles.listMain}>
                    <span className={styles.listTitle}>
                      {!item.read ? <i className={styles.unreadDot} aria-label="ungelesen" /> : null}
                      <span>{item.name}</span>
                      {item.locale === "en" ? <span className={`${ui.chip} ${ui.chipNeutral}`}>EN</span> : null}
                    </span>
                    <span className={styles.listMeta}>{item.preview}</span>
                  </span>
                  <span className={styles.listAside}>
                    <span>{item.time}</span>
                    <InquiryChip status={item.status} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className={styles.mailDetail}>{children}</div>
    </div>
  );
}
