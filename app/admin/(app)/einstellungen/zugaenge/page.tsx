import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { removeAccountAction } from "@/app/admin/actions/auth";
import { SubmitButton } from "@/components/admin/Buttons";
import { AddAccountForm } from "@/components/admin/SettingsForms";
import ui from "@/components/admin/ui.module.css";
import { listAccounts } from "@/lib/auth/accounts";
import { requireOwner } from "@/lib/auth/server";
import { formatDate, relativeTime } from "@/lib/cms/format";
import styles from "../../pages.module.css";

export const metadata: Metadata = { title: "Zugänge" };

/** Nur die Inhaberin: weitere Zugänge anlegen und entfernen. */
export default async function AccountsPage() {
  const owner = await requireOwner();
  const accounts = await listAccounts();

  return (
    <div style={{ maxWidth: "40rem" }} className={ui.stackLg}>
      <div>
        <Link href="/admin/einstellungen" className={styles.back}>
          <ChevronLeft aria-hidden="true" /> Einstellungen
        </Link>
        <header className={styles.header}>
          <p className={ui.eyebrow}>Admin-App</p>
          <h1 className={ui.pageTitle}>Zugänge</h1>
          <p className={ui.lead}>
            Jeder Zugang meldet sich mit einer eigenen sechsstelligen PIN an, sieht Anfragen und Inhalte und kann seine
            PIN selbst ändern. Zugänge anlegen und entfernen können nur Sie.
          </p>
        </header>
      </div>

      <section className={ui.card} aria-labelledby="liste-titel">
        <h2 className={ui.sectionTitle} id="liste-titel" style={{ marginBottom: "0.75rem" }}>
          Wer hat Zugang
        </h2>
        <div className={styles.list}>
          {accounts.map((account) => (
            <div key={account.id} className={styles.listItem}>
              <span className={styles.listMain}>
                <span className={styles.listTitle}>
                  <span>{account.name}</span>
                  <span className={`${ui.chip} ${account.role === "owner" ? ui.chipAccent : ui.chipNeutral}`}>
                    {account.role === "owner" ? "Inhaberin" : "Mitarbeit"}
                  </span>
                </span>
                <span className={styles.listMeta} style={{ whiteSpace: "normal" }}>
                  {account.email} · angelegt {formatDate(account.createdAt)}
                  {account.lastLoginAt ? ` · zuletzt ${relativeTime(account.lastLoginAt)}` : " · noch nie angemeldet"}
                </span>
              </span>
              {account.id !== owner.id ? (
                <form action={removeAccountAction}>
                  <input type="hidden" name="id" value={account.id} />
                  <SubmitButton variant="ghost" confirm={`Zugang von ${account.name} entfernen? Die Person kann sich dann nicht mehr anmelden.`}>
                    <Trash2 aria-hidden="true" />
                  </SubmitButton>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className={ui.card} aria-labelledby="neu-titel">
        <div className={ui.stack}>
          <h2 className={ui.sectionTitle} id="neu-titel">
            Zugang anlegen
          </h2>
          <AddAccountForm />
        </div>
      </section>
    </div>
  );
}
