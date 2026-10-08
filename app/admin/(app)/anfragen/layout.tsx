import { InquiryMail, type InquiryListItem } from "@/components/admin/InquiryMail";
import { requireAccount } from "@/lib/auth/server";
import { formatShortDate } from "@/lib/cms/format";
import { inquiryName, listInquiries, purgeExpiredInquiries } from "@/lib/cms/inquiries";
import { getSettings } from "@/lib/cms/settings";

/*
 * Die Liste gehört ins Layout, nicht in die Seite: So bleibt sie am großen
 * Bildschirm stehen, während rechts eine Anfrage nach der anderen aufgeht.
 */
export default async function InquiriesLayout({ children }: { children: React.ReactNode }) {
  await requireAccount();
  const settings = await getSettings();
  // Speicherbegrenzung: abgelaufene erledigte Anfragen verschwinden hier von selbst.
  await purgeExpiredInquiries(settings.retentionMonths).catch((error) =>
    console.error("[Anfragen] Aufräumen fehlgeschlagen:", error),
  );
  const items: InquiryListItem[] = (await listInquiries(500)).map((inquiry) => ({
    key: inquiry.key,
    name: inquiryName(inquiry) + (inquiry.company ? ` · ${inquiry.company}` : ""),
    preview: `${inquiry.topic ? `${inquiry.topic} · ` : ""}${inquiry.message || inquiry.email}`.slice(0, 180),
    status: inquiry.status,
    read: inquiry.read,
    locale: inquiry.locale,
    time: formatShortDate(inquiry.createdAt),
  }));

  return (
    <InquiryMail items={items} retentionMonths={settings.retentionMonths}>
      {children}
    </InquiryMail>
  );
}
