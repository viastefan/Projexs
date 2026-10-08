import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions/auth";
import type { AppTheme } from "@/lib/cms/types";
import { AdminNav } from "./AdminNav";
import { AppInstallPrompt } from "./AppInstallPrompt";
import { PushSync } from "./PushSync";
import styles from "./shell.module.css";

type AdminShellProps = {
  name: string;
  unread: number;
  theme: AppTheme;
  children: React.ReactNode;
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "·";
}

function Brand({ sub }: { sub: string }) {
  return (
    <Link href="/admin" className={styles.brand}>
      {/* eslint-disable-next-line @next/next/no-img-element -- kleines statisches Symbol */}
      <img className={styles.brandMark} src="/app-icons/projexs-192.png" alt="" width={36} height={36} />
      <span className={styles.brandText}>
        <span className={styles.brandName}>ProjeXs Admin</span>
        <span className={styles.brandSub}>{sub}</span>
      </span>
    </Link>
  );
}

export function AdminShell({ name, unread, theme, children }: AdminShellProps) {
  return (
    <div className={styles.shell} data-theme={theme}>
      <aside className={styles.sidebar}>
        <Brand sub="Daniela Franzen" />
        <AdminNav variant="side" unread={unread} />
        <div className={styles.sideFoot}>
          <p className={styles.sideAccount}>
            <span className={styles.avatar} aria-hidden="true">
              {initials(name)}
            </span>
            <span>
              Angemeldet als
              <strong>{name}</strong>
            </span>
          </p>
          <a className={styles.sideSite} href="/" target="_blank" rel="noopener">
            <ExternalLink aria-hidden="true" /> Website öffnen
          </a>
          <form action={logoutAction}>
            <button type="submit" className={styles.logout}>
              <LogOut aria-hidden="true" />
              Abmelden
            </button>
          </form>
        </div>
      </aside>

      <header className={styles.topbar}>
        <Brand sub={name} />
        <Link href="/admin/einstellungen" className={styles.avatar} aria-label="Einstellungen und Abmelden">
          {initials(name)}
        </Link>
      </header>

      <main className={styles.main} id="inhalt">
        <div className={styles.content}>{children}</div>
      </main>

      <AdminNav variant="tabs" unread={unread} />
      <PushSync />
      <AppInstallPrompt />
    </div>
  );
}
