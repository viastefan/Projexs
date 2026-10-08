"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AccountError,
  addEditor,
  changePin,
  loginWithPin,
  removeAccount,
  updateProfile,
} from "@/lib/auth/accounts";
import { endSession, requireAccount, requireOwner, startSession } from "@/lib/auth/server";
import { withinLimit } from "@/lib/rate-limit";
import { text, type ActionState } from "./state";

function safeNext(value: string): string {
  // Nur Ziele innerhalb der App — sonst ließe sich die Anmeldung als
  // Sprungbrett auf fremde Seiten missbrauchen.
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";
}

function clock(iso?: string): string {
  return iso
    ? new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })
    : "später";
}

export type PinState = ActionState;

export async function pinLoginAction(_prev: PinState, formData: FormData): Promise<PinState> {
  // Zusätzlich zur Sperre im Speicher: Ein Anschluss probiert nicht beliebig schnell.
  if (!(await withinLimit("pin", 10, 15 * 60 * 1000))) {
    return { status: "error", message: "Zu viele Versuche. Bitte in einer Viertelstunde noch einmal versuchen." };
  }

  const result = await loginWithPin(text(formData, "pin"));
  if (!result.ok) {
    if (result.reason === "locked") {
      return {
        status: "error",
        message: `Zu viele falsche Eingaben. Aus Sicherheitsgründen gesperrt bis ${clock(result.lockedUntil)} Uhr.`,
      };
    }
    if (result.reason === "unconfigured") {
      return { status: "error", message: "Noch keine PIN hinterlegt. Bitte ADMIN_PIN in Vercel setzen." };
    }
    return { status: "error", message: "Die PIN stimmt nicht." };
  }

  await startSession(result.account);
  redirect(safeNext(text(formData, "next")));
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/anmelden");
}

export async function changePinAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const account = await requireAccount();
  const next = text(formData, "next");
  if (next !== text(formData, "nextRepeat")) {
    return { status: "error", message: "Die beiden neuen PINs stimmen nicht überein." };
  }
  let updated;
  try {
    updated = await changePin(account.id, { current: text(formData, "current"), next });
  } catch (error) {
    if (error instanceof AccountError) return { status: "error", message: error.message };
    throw error;
  }
  // Neue PIN = neue Sitzung; die anderen Geräte dieses Zugangs sind damit abgemeldet.
  await startSession(updated);
  revalidatePath("/admin", "layout");
  return { status: "ok", message: "Die PIN ist geändert. Andere Geräte sind jetzt abgemeldet." };
}

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const account = await requireAccount();
  try {
    await updateProfile(account.id, { name: text(formData, "name"), email: text(formData, "email") });
  } catch (error) {
    if (error instanceof AccountError) return { status: "error", message: error.message };
    throw error;
  }
  revalidatePath("/admin", "layout");
  return { status: "ok", message: "Gespeichert." };
}

/** Weiteren Zugang anlegen — nur die Inhaberin. */
export async function addAccountAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireOwner();
  const pin = text(formData, "pin");
  if (pin !== text(formData, "pinRepeat")) return { status: "error", message: "Die beiden PINs stimmen nicht überein." };
  let created;
  try {
    created = await addEditor({ name: text(formData, "name"), email: text(formData, "email"), pin });
  } catch (error) {
    if (error instanceof AccountError) return { status: "error", message: error.message };
    throw error;
  }
  revalidatePath("/admin/einstellungen");
  return { status: "ok", message: `Zugang für ${created.name} angelegt. Die PIN bitte persönlich weitergeben.`, id: created.id };
}

export async function removeAccountAction(formData: FormData): Promise<void> {
  const owner = await requireOwner();
  const id = text(formData, "id");
  if (id && id !== owner.id) await removeAccount(id);
  revalidatePath("/admin/einstellungen");
}
