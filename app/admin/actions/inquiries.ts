"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAccount } from "@/lib/auth/server";
import {
  addInquiryReply,
  deleteInquiry,
  getInquiry,
  inquiryName,
  markInquiryUnread,
  setInquiryNote,
  setInquiryStatus,
} from "@/lib/cms/inquiries";
import { quotedOriginal } from "@/lib/cms/reply-draft";
import type { InquiryStatus } from "@/lib/cms/types";
import { nowIso } from "@/lib/cms/util";
import { replySender, sendReplyMail } from "@/lib/mail";
import { text, type ActionState } from "./state";

const STATUSES: InquiryStatus[] = ["neu", "in Bearbeitung", "erledigt"];

function refresh(key: string) {
  revalidatePath("/admin/anfragen");
  revalidatePath(`/admin/anfragen/${key}`);
  revalidatePath("/admin");
}

export async function setInquiryStatusAction(formData: FormData): Promise<void> {
  await requireAccount();
  const key = text(formData, "key");
  const status = text(formData, "status") as InquiryStatus;
  if (!STATUSES.includes(status)) return;
  await setInquiryStatus(key, status);
  refresh(key);
}

export async function markUnreadAction(formData: FormData): Promise<void> {
  await requireAccount();
  const key = text(formData, "key");
  await markInquiryUnread(key);
  refresh(key);
  redirect("/admin/anfragen");
}

export async function saveInquiryNoteAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAccount();
  const key = text(formData, "key");
  await setInquiryNote(key, text(formData, "note"));
  revalidatePath(`/admin/anfragen/${key}`);
  return { status: "ok", message: "Notiz gespeichert." };
}

export async function deleteInquiryAction(formData: FormData): Promise<void> {
  await requireAccount();
  await deleteInquiry(text(formData, "key"));
  revalidatePath("/admin/anfragen");
  revalidatePath("/admin");
  redirect("/admin/anfragen?geloescht=1");
}

/**
 * Antwort direkt aus der App — unter Danielas Adresse, mit der ursprünglichen
 * Nachricht darunter.
 */
export async function sendInquiryReplyAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAccount();
  const key = text(formData, "key");
  const subject = text(formData, "subject").replace(/\s+/g, " ").trim().slice(0, 200);
  const body = text(formData, "text").replace(/\r\n/g, "\n").trim().slice(0, 20000);
  if (!subject || !body) return { status: "error", message: "Bitte Betreff und Text ausfüllen." };

  const inquiry = await getInquiry(key);
  if (!inquiry) return { status: "error", message: "Diese Anfrage gibt es nicht mehr." };
  if (!replySender()) {
    return { status: "error", message: "Senden aus der App ist noch nicht eingerichtet — bitte „Im Mailprogramm öffnen“ nutzen." };
  }

  let from: string;
  try {
    from = await sendReplyMail({
      to: inquiry.email,
      toName: inquiryName(inquiry),
      subject,
      text: `${body}${quotedOriginal(inquiry)}`,
    });
  } catch (error) {
    console.error("[Anfragen] Antwort nicht verschickt:", error);
    return {
      status: "error",
      message:
        "Die Antwort ließ sich gerade nicht senden. Der Text ist noch da — bitte gleich noch einmal versuchen oder „Im Mailprogramm öffnen“.",
    };
  }

  await addInquiryReply(key, { at: nowIso(), subject, text: body, from });
  refresh(key);
  return { status: "ok", message: `Gesendet an ${inquiry.email}.` };
}
