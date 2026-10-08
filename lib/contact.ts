"use server";

import { createHash } from "node:crypto";
import { after } from "next/server";
import { createInquiry } from "@/lib/cms/inquiries";
import { getSettings } from "@/lib/cms/settings";
import type { InquirySource } from "@/lib/cms/types";
import {
  confirmationSender,
  isMailConfigured,
  sendConfirmationMail,
  sendContactMail,
  sendInquiryNotice,
  type ContactPayload,
} from "@/lib/mail";
import { sendInquiryPush } from "@/lib/push";
import { requestOrigin } from "@/lib/request-origin";
import { isStorageConfigured } from "@/lib/storage";

export type ContactField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "topic"
  | "timeframe"
  | "message"
  | "consent";
export type ContactErrorCode = "required" | "email" | "consent" | "short";

export type ContactValues = Partial<Record<Exclude<ContactField, "consent">, string>>;

export type ContactState = {
  status: "idle" | "success" | "invalid" | "error" | "unconfigured";
  errors?: Partial<Record<ContactField, ContactErrorCode>>;
  values?: ContactValues;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCES: InquirySource[] = ["dialog", "form", "contact-page", "popup"];

function clean(value: FormDataEntryValue | null, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/**
 * Anfrage aus dem Formular (Dialog, Kontaktseite, klassisches Formular).
 *
 * Mit eingerichtetem Speicher landet die Anfrage im Postfach der Admin-App —
 * das ist der eigentliche Eingang. E-Mail und Push danach sind nur
 * Benachrichtigung: Schlägt eins davon fehl, ist nichts verloren.
 *
 * Ohne Speicher bleibt es beim bisherigen Weg: Die E-Mail ist die Anfrage.
 * Ohne Speicher und ohne Mail-Dienst bietet das Formular den Versand per
 * E-Mail-Programm an („unconfigured“).
 *
 * Versteckte Felder (optional): `source` (dialog | form | contact-page | popup,
 * Standard „form“) und `locale` (de | en, Standard „de“).
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactValues = {
    firstName: clean(formData.get("firstName"), 120),
    lastName: clean(formData.get("lastName"), 120),
    email: clean(formData.get("email"), 200),
    phone: clean(formData.get("phone"), 60),
    company: clean(formData.get("company"), 160),
    topic: clean(formData.get("topic"), 120),
    timeframe: clean(formData.get("timeframe"), 120),
    message: clean(formData.get("message"), 5000),
  };
  const consent = formData.get("consent") === "on";
  const sourceRaw = clean(formData.get("source"), 20) as InquirySource;
  const source: InquirySource = SOURCES.includes(sourceRaw) ? sourceRaw : "form";
  const locale = clean(formData.get("locale"), 5) === "en" ? "en" : "de";

  // Spam-Schutz: unsichtbares Honeypot-Feld. Bots erhalten eine scheinbar erfolgreiche Antwort.
  const honeypot = clean(formData.get("website"));
  if (honeypot) {
    return { status: "success" };
  }

  const errors: ContactState["errors"] = {};
  if (!values.firstName) errors.firstName = "required";
  if (!values.lastName) errors.lastName = "required";
  if (!values.email) errors.email = "required";
  else if (!EMAIL_RE.test(values.email)) errors.email = "email";
  // Die Nachricht ist freiwillig – wer nur Kontaktdaten hinterlässt, wird trotzdem zurückgerufen.
  if (!consent) errors.consent = "consent";

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values };
  }

  const payload: ContactPayload = {
    firstName: values.firstName!,
    lastName: values.lastName!,
    email: values.email!,
    phone: values.phone,
    company: values.company,
    topic: values.topic,
    timeframe: values.timeframe,
    message: values.message!,
  };

  if (isStorageConfigured()) {
    let stored;
    try {
      stored = await createInquiry({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: values.phone ?? "",
        company: values.company ?? "",
        topic: values.topic ?? "",
        timeframe: values.timeframe ?? "",
        message: payload.message,
        source,
        locale,
      });
    } catch (error) {
      console.error("[Anfrage] Speichern in der App fehlgeschlagen:", error);
    }
    if (stored) {
      // Ohne personenbezogene Daten: nur, dass und woher sie kam.
      console.info(`[Anfrage] gespeichert ${stored.key} (${source}, ${locale})`);
      await notify(payload, stored.key);
      confirmLater(payload.email, locale);
      return { status: "success" };
    }
  }

  if (!isMailConfigured()) {
    // Weder Speicher noch Mail-Dienst: Formular bietet den Versand per E-Mail-Programm an.
    return { status: "unconfigured", values };
  }

  try {
    await sendContactMail(payload);
  } catch (err) {
    console.error("Kontaktformular: Versand fehlgeschlagen", err);
    return { status: "error", values };
  }
  confirmLater(payload.email, locale);
  return { status: "success" };
}

/** Dieselbe Adresse bekommt höchstens eine Bestätigung am Tag — gegen Missbrauch als Mailbombe. */
const confirmedAt = new Map<string, number>();
const CONFIRM_EVERY_MS = 24 * 60 * 60 * 1000;

function confirmLater(email: string, locale: "de" | "en"): void {
  if (!confirmationSender()) return;
  const now = Date.now();
  const key = createHash("sha256").update(email.toLowerCase()).digest("base64url");
  const last = confirmedAt.get(key);
  if (last !== undefined && now - last < CONFIRM_EVERY_MS) return;
  confirmedAt.set(key, now);
  if (confirmedAt.size > 5000) {
    for (const [entry, at] of confirmedAt) if (now - at >= CONFIRM_EVERY_MS) confirmedAt.delete(entry);
  }
  after(async () => {
    try {
      await sendConfirmationMail(email, locale);
    } catch (error) {
      console.error("[Anfrage] Eingangsbestätigung nicht verschickt:", error);
    }
  });
}

/** E-Mail und Push gleichzeitig — die anfragende Person wartet nur auf das langsamere. */
async function notify(payload: ContactPayload, key: string): Promise<void> {
  await Promise.all([notifyByMail(payload, key), notifyByPush(key)]);
}

async function notifyByMail(payload: ContactPayload, key: string): Promise<void> {
  if (!isMailConfigured()) return;
  try {
    const { notifications } = await getSettings();
    if (notifications === "off") return;
    const link = `${await requestOrigin()}/admin/anfragen/${key}`;
    if (notifications === "notice") await sendInquiryNotice(link);
    else await sendContactMail(payload, link);
  } catch (error) {
    console.error("[Anfrage] E-Mail-Benachrichtigung fehlgeschlagen:", error);
  }
}

async function notifyByPush(key: string): Promise<void> {
  try {
    const result = await sendInquiryPush(key);
    if (result.failed > 0) console.error(`[Push] ${result.failed} Geräte nicht erreicht.`);
  } catch (error) {
    console.error("[Anfrage] Push fehlgeschlagen:", error);
  }
}
