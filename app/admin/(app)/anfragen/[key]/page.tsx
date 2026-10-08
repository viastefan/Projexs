import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MailOpen, Phone, Trash2 } from "lucide-react";
import { deleteInquiryAction, markUnreadAction, setInquiryStatusAction } from "@/app/admin/actions/inquiries";
import { SubmitButton } from "@/components/admin/Buttons";
import { InquiryChip, SOURCE_LABELS } from "@/components/admin/Chips";
import { NoteForm } from "@/components/admin/NoteForm";
import { RefreshOnMount } from "@/components/admin/RefreshOnMount";
import { ReplyComposer } from "@/components/admin/ReplyComposer";
import ui from "@/components/admin/ui.module.css";
import { site } from "@/content/site";
import { requireAccount } from "@/lib/auth/server";
import { formatDate } from "@/lib/cms/format";
import { getInquiry, inquiryName, markInquiryRead } from "@/lib/cms/inquiries";
import { followUpDraft, quotedOriginal, replyDraft } from "@/lib/cms/reply-draft";
import type { InquiryStatus } from "@/lib/cms/types";
import { replySender } from "@/lib/mail";
import styles from "../../pages.module.css";

export const metadata: Metadata = { title: "Anfrage" };

const STATUS_OPTIONS: { value: InquiryStatus; label: string }[] = [
  { value: "neu", label: "Neu" },
  { value: "in Bearbeitung", label: "In Bearbeitung" },
  { value: "erledigt", label: "Erledigt" },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return letters.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

export default async function InquiryPage({ params }: { params: Promise<{ key: string }> }) {
  const account = await requireAccount();
  const { key } = await params;
  const before = await getInquiry(key);
  if (!before) notFound();
  // Beim ersten Öffnen gilt die Anfrage als gelesen; danach Liste und Zähler auffrischen.
  const justRead = !before.read;
  const inquiry = justRead ? ((await markInquiryRead(key)) ?? before) : before;

  const from = replySender();
  const name = inquiryName(inquiry);
  const replies = inquiry.replies ?? [];
  const phoneHref = inquiry.phone ? `tel:${inquiry.phone.replace(/[^\d+]/g, "")}` : null;
  const source = SOURCE_LABELS[inquiry.source] ?? "über die Website";

  return (
    <div>
      {justRead ? <RefreshOnMount /> : null}
      <Link href="/admin/anfragen" className={`${styles.back} ${styles.backMobile}`}>
        <ChevronLeft aria-hidden="true" /> Alle Anfragen
      </Link>

      <header className={styles.inquiryHead}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(name)}
        </span>
        <div className={styles.inquiryHeadText}>
          <h1 className={ui.pageTitle}>{name}</h1>
          <p className={styles.inquiryMeta}>
            {formatDate(inquiry.createdAt, true)} Uhr · {source}
            {inquiry.locale === "en" ? " · auf Englisch" : ""}
          </p>
        </div>
        <InquiryChip status={inquiry.status} />
      </header>

      <div className={styles.detailGrid}>
        <div className={ui.stack}>
          <section className={ui.card} aria-labelledby="nachricht-titel">
            <div className={styles.messageHead}>
              <h2 className={ui.sectionTitle} id="nachricht-titel">
                Nachricht
              </h2>
              {inquiry.topic ? <span className={styles.topic}>{inquiry.topic}</span> : null}
            </div>
            {inquiry.message ? (
              <p className={styles.message}>{inquiry.message}</p>
            ) : (
              <p className={ui.empty}>Keine Nachricht — nur Kontaktdaten hinterlassen. Bitte zurückrufen.</p>
            )}
            {inquiry.timeframe ? (
              <p className={ui.small} style={{ marginTop: "0.75rem" }}>
                Gewünschter Zeitrahmen: <strong>{inquiry.timeframe}</strong>
              </p>
            ) : null}
          </section>

          <section className={ui.card} aria-labelledby="antwort-titel">
            <h2 className={ui.sectionTitle} id="antwort-titel" style={{ marginBottom: "0.75rem" }}>
              Antworten
            </h2>
            <ReplyComposer
              inquiryKey={inquiry.key}
              to={{ name, email: inquiry.email }}
              from={from}
              senderName={site.owner.name}
              draft={replyDraft(inquiry)}
              followUp={followUpDraft(inquiry)}
              quote={quotedOriginal(inquiry)}
              replied={replies.length > 0}
              techHint={
                account.role === "owner" && !from
                  ? "Senden direkt aus der App braucht in Vercel einen SMTP-Zugang und REPLY_FROM (z. B. Daniela.Franzen@projexs.de)."
                  : undefined
              }
            />
          </section>

          {replies.length > 0 ? (
            <section className={ui.card} aria-labelledby="gesendet-titel">
              <h2 className={ui.sectionTitle} id="gesendet-titel" style={{ marginBottom: "0.5rem" }}>
                Gesendet
              </h2>
              <ol className={styles.replies}>
                {[...replies].reverse().map((reply) => (
                  <li key={reply.at} className={styles.reply}>
                    <details>
                      <summary>
                        <span className={styles.replySubject}>{reply.subject}</span>
                        <span className={styles.replyTime}>{formatDate(reply.at, true)} Uhr</span>
                      </summary>
                      <p className={styles.message}>{reply.text}</p>
                      <p className={ui.small}>Gesendet von {reply.from}</p>
                    </details>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <div className={ui.stack}>
          <section className={ui.card} aria-labelledby="kontakt-titel">
            <h2 className={ui.sectionTitle} id="kontakt-titel" style={{ marginBottom: "0.5rem" }}>
              Kontakt
            </h2>
            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>E-Mail</dt>
                <dd>
                  <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>Telefon</dt>
                <dd>{phoneHref ? <a href={phoneHref}>{inquiry.phone}</a> : "Nicht angegeben"}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Firma</dt>
                <dd>{inquiry.company || "Nicht angegeben"}</dd>
              </div>
            </dl>
            {phoneHref ? (
              <a href={phoneHref} className={`${ui.button} ${ui.secondary}`} style={{ marginTop: "0.75rem" }}>
                <Phone aria-hidden="true" /> Anrufen
              </a>
            ) : null}
          </section>

          <section className={ui.card} aria-labelledby="status-titel">
            <h2 className={ui.sectionTitle} id="status-titel" style={{ marginBottom: "0.75rem" }}>
              Status
            </h2>
            <div className={styles.segmented} role="group" aria-labelledby="status-titel">
              {STATUS_OPTIONS.map((option) => (
                <form key={option.value} action={setInquiryStatusAction}>
                  <input type="hidden" name="key" value={inquiry.key} />
                  <input type="hidden" name="status" value={option.value} />
                  <button
                    type="submit"
                    className={styles.segment}
                    aria-pressed={inquiry.status === option.value}
                    disabled={inquiry.status === option.value}
                  >
                    {option.label}
                  </button>
                </form>
              ))}
            </div>
            <form action={markUnreadAction} style={{ marginTop: "0.75rem" }}>
              <input type="hidden" name="key" value={inquiry.key} />
              <SubmitButton variant="ghost" pendingLabel="Wird markiert …">
                <MailOpen aria-hidden="true" /> Als ungelesen markieren
              </SubmitButton>
            </form>
          </section>

          <section className={ui.card}>
            <NoteForm inquiryKey={inquiry.key} note={inquiry.note} />
          </section>

          <section className={`${ui.card} ${styles.dangerZone}`}>
            <div className={ui.stack}>
              <p className={ui.small}>Einwilligung zur Datenverarbeitung erteilt am {formatDate(inquiry.consent.at, true)} Uhr.</p>
              <form action={deleteInquiryAction}>
                <input type="hidden" name="key" value={inquiry.key} />
                <SubmitButton
                  variant="danger"
                  pendingLabel="Wird gelöscht …"
                  confirm="Diese Anfrage endgültig löschen? Das lässt sich nicht rückgängig machen."
                >
                  <Trash2 aria-hidden="true" /> Endgültig löschen
                </SubmitButton>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
