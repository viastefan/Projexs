import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, KeyRound, LogOut, Users } from "lucide-react";
import { logoutAction } from "@/app/admin/actions/auth";
import { InstallAppRow } from "@/components/admin/InstallAppRow";
import { OFFER_APP_INSTALL } from "@/components/admin/installOffer";
import { MailTestButton } from "@/components/admin/MailTestButton";
import { PushSettings } from "@/components/admin/PushSettings";
import { AppThemeForm, InboxSettingsForm, ProfileForm } from "@/components/admin/SettingsForms";
import { SiteReleaseCard } from "@/components/admin/SiteReleaseCard";
import ui from "@/components/admin/ui.module.css";
import { listAccounts, ownerAccess } from "@/lib/auth/accounts";
import { requireAccount } from "@/lib/auth/server";
import { formatDate, relativeTime } from "@/lib/cms/format";
import { getSettings } from "@/lib/cms/settings";
import { configuredTransport, confirmationSender, isMailConfigured, recipient, replySender } from "@/lib/mail";
import { listSubscriptions, vapidPublicKey } from "@/lib/push";
import { storageDriver } from "@/lib/storage";
import styles from "../pages.module.css";

export const metadata: Metadata = { title: "Einstellungen" };

function StatusRow({ label, ok, text }: { label: string; ok: boolean | "warn"; text: string }) {
  const tone = ok === true ? ui.chipOk : ok === "warn" ? ui.chipWarn : ui.chipBad;
  return (
    <div className={styles.listItem}>
      <span className={styles.listMain}>
        <span className={styles.listTitle}>
          <span style={{ whiteSpace: "normal" }}>{label}</span>
        </span>
        <span className={styles.listMeta} style={{ whiteSpace: "normal" }}>
          {text}
        </span>
      </span>
      <span className={`${ui.chip} ${tone}`}>{ok === true ? "bereit" : ok === "warn" ? "eingeschränkt" : "fehlt"}</span>
    </div>
  );
}

export default async function SettingsPage() {
  const account = await requireAccount();
  const [settings, subscriptions, pushKey, accounts, access] = await Promise.all([
    getSettings(),
    listSubscriptions().catch(() => []),
    vapidPublicKey().catch((error) => {
      console.error("[Push] Schlüssel nicht verfügbar:", error);
      return null;
    }),
    listAccounts().catch(() => []),
    ownerAccess().catch(() => null),
  ]);
  const myDevices = subscriptions
    .filter((subscription) => subscription.accountId === account.id)
    .map(({ id, device, createdAt, endpoint }) => ({ id, device, since: formatDate(createdAt), endpoint }));
  const mailReady = isMailConfigured();
  const transport = configuredTransport();
  const driver = storageDriver();
  const isOwner = account.role === "owner";

  return (
    <div className={ui.stackLg}>
      <header className={styles.header}>
        <p className={ui.eyebrow}>Admin-App</p>
        <h1 className={ui.pageTitle}>Einstellungen</h1>
      </header>

      <div className={styles.settingsCols}>
        <div className={ui.stackLg}>
          <SiteReleaseCard publishedAt={settings.publishedAt} />

          <section className={ui.card} id="push" aria-labelledby="push-titel">
            <div className={ui.stack}>
              <div>
                <h2 className={ui.sectionTitle} id="push-titel">
                  Push-Benachrichtigung
                </h2>
                <p className={ui.lead}>
                  Bei jeder neuen Anfrage eine Nachricht aufs Handy — nur der Hinweis, ohne Namen oder Inhalt. Wird pro
                  Gerät eingeschaltet.
                </p>
              </div>
              <PushSettings publicKey={pushKey} devices={myDevices} />
            </div>
          </section>

          <section className={ui.card} id="anfragen" aria-labelledby="postfach-titel">
            <div className={ui.stack}>
              <div>
                <h2 className={ui.sectionTitle} id="postfach-titel">
                  Anfragen
                </h2>
                <p className={ui.lead}>E-Mail-Benachrichtigung und Aufbewahrung erledigter Anfragen.</p>
              </div>
              <InboxSettingsForm
                notifications={settings.notifications}
                retentionMonths={settings.retentionMonths}
                mailReady={mailReady}
              />
            </div>
          </section>

          <section className={ui.card} id="darstellung" aria-labelledby="darstellung-titel">
            <div className={ui.stack}>
              <div>
                <h2 className={ui.sectionTitle} id="darstellung-titel">
                  Darstellung
                </h2>
                <p className={ui.lead}>Hell oder dunkel — gilt für die Admin-App auf allen Geräten.</p>
              </div>
              <AppThemeForm appTheme={settings.appTheme ?? "system"} />
            </div>
          </section>
        </div>

        <div className={ui.stackLg}>
          <section className={ui.card} id="zugang" aria-labelledby="zugang-titel">
            <div className={ui.stack}>
              <div className={ui.cardHead} style={{ marginBottom: 0 }}>
                <h2 className={ui.sectionTitle} id="zugang-titel">
                  Mein Zugang
                </h2>
                <Link href="/admin/einstellungen/passwort" className={`${ui.button} ${ui.ghost}`}>
                  <KeyRound aria-hidden="true" /> PIN ändern
                </Link>
              </div>
              <div className={styles.list}>
                <div className={styles.listItem}>
                  <span className={styles.listMain}>
                    <span className={styles.listTitle}>
                      <span>{account.name}</span>
                      <span className={`${ui.chip} ${ui.chipNeutral}`}>{isOwner ? "Inhaberin" : "Mitarbeit"}</span>
                    </span>
                    <span className={styles.listMeta} style={{ whiteSpace: "normal" }}>
                      Anmeldung mit PIN
                      {isOwner && access
                        ? access.ownPin
                          ? ` · eigene PIN seit ${formatDate(access.pinSetAt ?? account.createdAt)}`
                          : access.vercelPin
                            ? " · PIN aus Vercel (ADMIN_PIN)"
                            : ""
                        : ""}
                      {account.lastLoginAt ? ` · zuletzt ${relativeTime(account.lastLoginAt)}` : ""}
                    </span>
                  </span>
                </div>
              </div>
              <ProfileForm name={account.name} email={account.email} />
            </div>
          </section>

          {isOwner ? (
            <section className={ui.card} id="zugaenge" aria-labelledby="zugaenge-titel">
              <div className={ui.stack}>
                <div className={ui.cardHead} style={{ marginBottom: 0 }}>
                  <h2 className={ui.sectionTitle} id="zugaenge-titel">
                    Weitere Zugänge
                  </h2>
                  <Link href="/admin/einstellungen/zugaenge" className={`${ui.button} ${ui.ghost}`}>
                    <Users aria-hidden="true" /> Verwalten
                  </Link>
                </div>
                <p className={ui.lead}>
                  {accounts.length <= 1
                    ? "Bisher nur Ihr eigener Zugang. Eine Assistenz oder die technische Betreuung bekommt bei Bedarf eine eigene PIN."
                    : `${accounts.length - 1} ${accounts.length === 2 ? "weiterer Zugang" : "weitere Zugänge"}: ${accounts
                        .filter((item) => item.role !== "owner")
                        .map((item) => item.name)
                        .join(", ")}.`}
                </p>
              </div>
            </section>
          ) : null}

          <section className={ui.card} id="app" aria-labelledby="app-titel">
            <div className={ui.stack}>
              <div>
                <h2 className={ui.sectionTitle} id="app-titel">
                  {OFFER_APP_INSTALL ? "App installieren" : "Anleitung"}
                </h2>
                <p className={ui.lead}>
                  {OFFER_APP_INSTALL
                    ? "Auf iPhone, Android, Mac und Windows wie eine richtige App — ohne App Store."
                    : "Anmelden, Anfragen beantworten, Inhalte pflegen — Schritt für Schritt erklärt."}
                </p>
              </div>
              {OFFER_APP_INSTALL ? <InstallAppRow /> : null}
              <Link href="/admin/anleitung" className={`${ui.button} ${ui.ghost}`} style={{ justifySelf: "start" }}>
                <BookOpen aria-hidden="true" /> Anleitung ansehen
              </Link>
            </div>
          </section>

          <section className={ui.card} id="technik" aria-labelledby="technik-titel">
            <h2 className={ui.sectionTitle} id="technik-titel" style={{ marginBottom: "0.75rem" }}>
              Technik
            </h2>
            <div className={styles.list}>
              <StatusRow
                label="Speicher"
                ok={driver === "blob" ? true : "warn"}
                text={driver === "blob" ? "Vercel Blob · Rechenzentrum Frankfurt" : "Lokaler Entwicklungsspeicher (.data/)"}
              />
              <StatusRow
                label="E-Mail-Versand"
                ok={mailReady ? true : "warn"}
                text={
                  mailReady
                    ? `${transport === "smtp" ? `SMTP (${process.env.SMTP_HOST})` : "Resend"} · Anfragen gehen an ${recipient()}`
                    : "Nicht eingerichtet — Anfragen kommen nur hier in der App und per Push an."
                }
              />
              <StatusRow
                label="Antworten aus der App"
                ok={replySender() ? true : "warn"}
                text={replySender() ? `Gesendet als ${replySender()}` : "Aus — Antworten öffnen das Mailprogramm."}
              />
              <StatusRow
                label="Eingangsbestätigung"
                ok={confirmationSender() ? true : "warn"}
                text={
                  confirmationSender()
                    ? `Anfragende bekommen eine Bestätigung von ${confirmationSender()}.`
                    : "Aus — Anfragende bekommen keine automatische Bestätigung (CONFIRMATION_FROM)."
                }
              />
              <StatusRow
                label="Push-Benachrichtigungen"
                ok={pushKey ? (subscriptions.length > 0 ? true : "warn") : false}
                text={
                  pushKey
                    ? subscriptions.length > 0
                      ? `Auf ${subscriptions.length} ${subscriptions.length === 1 ? "Gerät" : "Geräten"} eingeschaltet`
                      : "Bereit, aber noch auf keinem Gerät eingeschaltet."
                    : "Schlüssel nicht verfügbar — Speicher prüfen."
                }
              />
              <StatusRow
                label="Automatische Löschung"
                ok={process.env.CRON_SECRET ? true : "warn"}
                text={
                  process.env.CRON_SECRET
                    ? `Täglich nachts — erledigte Anfragen nach ${settings.retentionMonths} Monaten.`
                    : "CRON_SECRET fehlt — gelöscht wird nur beim Öffnen des Postfachs."
                }
              />
            </div>
            {mailReady ? (
              <div style={{ marginTop: "1rem" }}>
                <MailTestButton />
              </div>
            ) : null}
          </section>
        </div>
      </div>

      <form action={logoutAction} className={styles.settingsFoot}>
        <button type="submit" className={`${ui.button} ${ui.danger} ${ui.block}`}>
          <LogOut aria-hidden="true" /> Abmelden
        </button>
        <span>Angemeldet als {account.name}</span>
      </form>
    </div>
  );
}
