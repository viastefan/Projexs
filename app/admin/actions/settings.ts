"use server";

import { revalidatePath } from "next/cache";
import { requireAccount } from "@/lib/auth/server";
import { purgeExpiredInquiries } from "@/lib/cms/inquiries";
import { getSettings, updateSettings } from "@/lib/cms/settings";
import type { AppTheme, NotificationMode } from "@/lib/cms/types";
import { isMailConfigured, sendTestMail } from "@/lib/mail";
import { withinLimit } from "@/lib/rate-limit";
import { text, type ActionState } from "./state";

const MODES: NotificationMode[] = ["full", "notice", "off"];
const RETENTION = [3, 6, 12, 24];
const THEMES: AppTheme[] = ["system", "light", "dark"];

export async function saveInboxSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAccount();
  const mode = text(formData, "notifications") as NotificationMode;
  const months = Number(text(formData, "retentionMonths"));
  await updateSettings((current) => ({
    ...current,
    notifications: MODES.includes(mode) ? mode : current.notifications,
    retentionMonths: RETENTION.includes(months) ? months : current.retentionMonths,
  }));
  const settings = await getSettings();
  const purged = await purgeExpiredInquiries(settings.retentionMonths);
  revalidatePath("/admin/einstellungen");
  return {
    status: "ok",
    message: purged > 0 ? `Gespeichert. ${purged} abgelaufene Anfragen wurden gelöscht.` : "Gespeichert.",
  };
}

/** Darstellung der Admin-App — gilt für alle Geräte dieses Zugangs. */
export async function saveAppThemeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAccount();
  const theme = text(formData, "appTheme") as AppTheme;
  if (!THEMES.includes(theme)) return { status: "error", message: "Bitte eine Darstellung wählen." };
  await updateSettings((current) => ({ ...current, appTheme: theme }));
  revalidatePath("/admin", "layout");
  return { status: "ok", message: "Gespeichert." };
}

export async function sendTestMailAction(): Promise<ActionState> {
  const account = await requireAccount();
  if (!isMailConfigured()) {
    return { status: "error", message: "Der E-Mail-Versand ist noch nicht eingerichtet (SMTP oder Resend in Vercel)." };
  }
  // Ein Postfach, das in kurzer Zeit viele Mails verschickt, sperrt der Anbieter gern vorsorglich.
  if (!(await withinLimit("testmail", 5, 60 * 60 * 1000))) {
    return { status: "error", message: "Es wurden gerade schon mehrere Testmails verschickt. Bitte später noch einmal." };
  }
  try {
    await sendTestMail(account.email);
  } catch (error) {
    console.error("[E-Mail] Testmail fehlgeschlagen:", error);
    return {
      status: "error",
      message: `Die Testmail konnte nicht verschickt werden: ${error instanceof Error ? error.message : "unbekannter Fehler"}`,
    };
  }
  return { status: "ok", message: `Testmail an ${account.email} verschickt. Falls sie fehlt: auch im Spam-Ordner nachsehen.` };
}
