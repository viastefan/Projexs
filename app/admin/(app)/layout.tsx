import { AdminShell } from "@/components/admin/AdminShell";
import { requireAccount } from "@/lib/auth/server";
import { unreadCount } from "@/lib/cms/inquiries";
import { getSettings } from "@/lib/cms/settings";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const account = await requireAccount();
  const [unread, settings] = await Promise.all([
    unreadCount().catch(() => 0),
    getSettings().catch(() => null),
  ]);

  return (
    <AdminShell name={account.name} unread={unread} theme={settings?.appTheme ?? "system"}>
      {children}
    </AdminShell>
  );
}
