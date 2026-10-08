import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PinForm } from "@/components/admin/SettingsForms";
import ui from "@/components/admin/ui.module.css";
import { requireAccount } from "@/lib/auth/server";
import styles from "../../pages.module.css";

export const metadata: Metadata = { title: "PIN ändern" };

export default async function PinPage() {
  const account = await requireAccount();

  return (
    <div style={{ maxWidth: "32rem" }}>
      <Link href="/admin/einstellungen" className={styles.back}>
        <ChevronLeft aria-hidden="true" /> Einstellungen
      </Link>
      <header className={styles.header}>
        <p className={ui.eyebrow}>Mein Zugang</p>
        <h1 className={ui.pageTitle}>PIN ändern</h1>
        <p className={ui.lead}>
          Mit der neuen PIN öffnet sich die App ab sofort; andere Geräte werden abgemeldet.
          {account.role === "owner" ? " Die PIN aus Vercel (ADMIN_PIN) bleibt als Notzugang zusätzlich gültig." : ""}
        </p>
      </header>
      <section className={ui.card}>
        <PinForm />
      </section>
    </div>
  );
}
