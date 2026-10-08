"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, LayoutGrid, PenLine, Settings } from "lucide-react";
import styles from "./shell.module.css";

const ITEMS = [
  { href: "/admin", label: "Übersicht", icon: LayoutGrid, exact: true },
  { href: "/admin/anfragen", label: "Anfragen", icon: Inbox, badge: true },
  { href: "/admin/inhalte", label: "Inhalte", icon: PenLine },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ variant, unread }: { variant: "tabs" | "side"; unread: number }) {
  const pathname = usePathname();

  if (variant === "tabs") {
    return (
      <nav className={styles.tabbar} aria-label="Bereiche">
        {ITEMS.map(({ href, label, icon: Icon, ...item }) => (
          <Link
            key={href}
            href={href}
            className={styles.tab}
            aria-current={isActive(pathname, href, "exact" in item) ? "page" : undefined}
          >
            <Icon aria-hidden="true" strokeWidth={1.75} />
            <span>{label}</span>
            {"badge" in item && unread > 0 ? (
              <span className={styles.badge} aria-label={`${unread} neu`}>
                {unread > 99 ? "99+" : unread}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={styles.sideNav} aria-label="Bereiche">
      {ITEMS.map(({ href, label, icon: Icon, ...item }) => (
        <Link
          key={href}
          href={href}
          className={styles.sideLink}
          aria-current={isActive(pathname, href, "exact" in item) ? "page" : undefined}
        >
          <Icon aria-hidden="true" strokeWidth={1.75} />
          <span>{label}</span>
          {"badge" in item && unread > 0 ? (
            <span className={styles.sideBadge} aria-label={`${unread} neu`}>
              {unread}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
