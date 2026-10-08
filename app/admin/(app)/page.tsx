import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Inbox, PenLine, Settings } from "lucide-react";
import { InquiryChip } from "@/components/admin/Chips";
import { PushNudge } from "@/components/admin/PushNudge";
import { SiteReleaseCard } from "@/components/admin/SiteReleaseCard";
import ui from "@/components/admin/ui.module.css";
import { requireAccount } from "@/lib/auth/server";
import { formatShortDate, greeting, relativeTime, todayLabel } from "@/lib/cms/format";
import { inquiryName, listInquiries, unreadCount } from "@/lib/cms/inquiries";
import { getSettings } from "@/lib/cms/settings";
import styles from "./pages.module.css";

export const metadata: Metadata = { title: "Übersicht" };

export default async function DashboardPage() {
  const account = await requireAccount();
  const [latest, unread, settings] = await Promise.all([
    listInquiries(5).catch(() => []),
    unreadCount().catch(() => 0),
    getSettings(),
  ]);
  const open = latest.filter((inquiry) => inquiry.status !== "erledigt").length;
  const firstName = account.name.split(" ")[0];

  return (
    <div className={ui.stackLg}>
      <header className={styles.header}>
        <p className={ui.eyebrow}>{todayLabel()}</p>
        <h1 className={ui.pageTitle}>
          {greeting()}, {firstName}
        </h1>
      </header>

      {/* Website ein/aus — immer ganz oben. */}
      <SiteReleaseCard publishedAt={settings.publishedAt} />

      <PushNudge />

      <div className={styles.grid}>
        <section className={ui.card} aria-labelledby="anfragen-titel">
          <p className={ui.eyebrow} id="anfragen-titel">
            Anfragen
          </p>
          <p className={styles.stat}>
            <span className={styles.statNumber}>{unread}</span>
            <span className={ui.muted}>{unread === 1 ? "neue Anfrage" : "neue Anfragen"}</span>
          </p>
          <Link href="/admin/anfragen" className={`${ui.button} ${unread > 0 ? ui.primary : ui.secondary}`}>
            <Inbox aria-hidden="true" /> Zum Postfach
          </Link>
        </section>

        <section className={ui.card} aria-labelledby="inhalte-titel">
          <p className={ui.eyebrow} id="inhalte-titel">
            Website-Texte
          </p>
          <p className={styles.monthTitle}>Deutsch und Englisch</p>
          <p className={ui.muted} style={{ margin: 0 }}>
            Überschriften, Leistungen, Projekte, FAQ und Stammdaten direkt bearbeiten — die Website ist sofort
            aktuell.
          </p>
          <div className={ui.row}>
            <Link href="/admin/inhalte" className={`${ui.button} ${ui.secondary}`}>
              <PenLine aria-hidden="true" /> Inhalte bearbeiten
            </Link>
          </div>
        </section>

        <section className={ui.card} aria-labelledby="schnell-titel">
          <p className={ui.eyebrow} id="schnell-titel">
            Schnellzugriff
          </p>
          <div className={styles.list}>
            <Link href="/admin/anfragen?filter=offen" className={styles.listItem}>
              <span className={styles.listMain}>
                <span className={styles.listTitle}>
                  <span>Offene Anfragen</span>
                </span>
                <span className={styles.listMeta}>
                  {open === 0 ? "Nichts offen" : `${open} ${open === 1 ? "wartet" : "warten"} auf Antwort`}
                </span>
              </span>
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="/admin/einstellungen#push" className={styles.listItem}>
              <span className={styles.listMain}>
                <span className={styles.listTitle}>
                  <span>Benachrichtigungen</span>
                </span>
                <span className={styles.listMeta}>Push aufs Handy und E-Mail bei neuen Anfragen</span>
              </span>
              <Settings aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      <section className={ui.card} aria-labelledby="neueste-titel">
        <div className={ui.cardHead}>
          <h2 className={ui.sectionTitle} id="neueste-titel">
            Neueste Anfragen
          </h2>
          <Link href="/admin/anfragen" className={`${ui.button} ${ui.ghost}`}>
            Alle <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className={ui.empty}>Noch keine Anfragen über die Website.</p>
        ) : (
          <div className={styles.list}>
            {latest.map((inquiry) => (
              <Link key={inquiry.key} href={`/admin/anfragen/${inquiry.key}`} className={styles.listItem}>
                <span className={styles.listMain}>
                  <span className={styles.listTitle}>
                    {!inquiry.read ? <i className={styles.unreadDot} aria-label="ungelesen" /> : null}
                    <span>{inquiryName(inquiry)}</span>
                    {inquiry.company ? <span className={ui.muted}>· {inquiry.company}</span> : null}
                  </span>
                  <span className={styles.listMeta}>{inquiry.topic || inquiry.message || inquiry.email}</span>
                </span>
                <span className={styles.listAside}>
                  <span title={relativeTime(inquiry.createdAt)}>{formatShortDate(inquiry.createdAt)}</span>
                  <InquiryChip status={inquiry.status} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
