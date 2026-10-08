import nodemailer from "nodemailer";
import { site } from "@/content/site";

/**
 * E-Mail-Versand der Website und der Admin-App.
 *
 * Zwei Wege, der erste konfigurierte gewinnt:
 *
 *  1. SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) — z. B. das IONOS-Postfach
 *     von Daniela (smtp.ionos.de, Port 587). Normalfall.
 *  2. Resend (`RESEND_API_KEY`) — Versanddienst mit verifizierter Domain.
 *
 * Ist nichts gesetzt, bleibt das Kontaktformular trotzdem benutzbar: Mit
 * Speicher landen Anfragen in der App, ohne Speicher bietet das Formular den
 * Versand per E-Mail-Programm an (Status „unconfigured“).
 */

export type TransportKind = "smtp" | "resend" | "none";

export function configuredTransport(): TransportKind {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return "none";
}

export function isMailConfigured(): boolean {
  return configuredTransport() !== "none";
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * Zeilenumbrüche aus Besuchereingaben dürfen nicht in Kopfzeilen landen —
 * sonst ließen sich über ein Feld zusätzliche Header einschleusen.
 */
function headerSafe(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

/** Absender wie „ProjeXs Website <website@projexs.de>“ in Name und Adresse zerlegen. */
function parseAddress(value: string, fallbackName: string): { name: string; address: string } {
  const match = /^\s*(?:"?([^"<]*)"?\s*)?<([^>]+)>\s*$/.exec(value);
  if (match) return { name: headerSafe(match[1] || fallbackName), address: headerSafe(match[2]) };
  return { name: fallbackName, address: headerSafe(value) };
}

/* Absender muss zur eigenen Domain gehören, sonst greifen SPF und DKIM nicht
   und die Mail landet im Spam. Die Adresse der Anfragenden steht im Reply-To. */
function sender(): { name: string; address: string } {
  const configured = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER || `website@projexs.de`;
  return parseAddress(configured, `${site.brand} Website`);
}

export function recipient(): string {
  return process.env.CONTACT_TO_EMAIL || site.contact.email;
}

interface Mail {
  from: { name: string; address: string };
  to: { name?: string; address: string };
  replyTo?: { name?: string; address: string };
  subject: string;
  text: string;
  html?: string;
}

function smtpTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 spricht von Anfang an TLS, 587 steigt per STARTTLS um. requireTLS
    // bricht ab, statt unverschlüsselt weiterzusenden.
    secure,
    requireTLS: !secure,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
  });
}

function formatAddress(value: { name?: string; address: string }): string {
  return value.name ? `${value.name.replace(/[",<>]/g, "")} <${value.address}>` : value.address;
}

async function deliver(mail: Mail): Promise<void> {
  const transport = configuredTransport();
  if (transport === "smtp") {
    await smtpTransport().sendMail({
      from: mail.from,
      to: formatAddress(mail.to),
      replyTo: mail.replyTo ? formatAddress(mail.replyTo) : undefined,
      subject: headerSafe(mail.subject),
      text: mail.text,
      html: mail.html,
    });
    return;
  }
  if (transport === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: formatAddress(mail.from),
        to: [formatAddress(mail.to)],
        reply_to: mail.replyTo ? formatAddress(mail.replyTo) : undefined,
        subject: headerSafe(mail.subject),
        text: mail.text,
        html: mail.html,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Resend antwortete mit ${res.status}: ${await res.text().catch(() => "")}`);
    return;
  }
  throw new Error("Kein Versandweg konfiguriert");
}

/* ------------------------------------------------- Benachrichtigung -- */

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  timeframe?: string;
  message: string;
};

function rows(data: ContactPayload): Array<[string, string]> {
  const all: Array<[string, string | undefined]> = [
    ["Name", `${data.firstName} ${data.lastName}`],
    ["E-Mail", data.email],
    ["Mobil", data.phone],
    ["Firma", data.company],
    ["Anliegen", data.topic],
    ["Zeitrahmen", data.timeframe],
  ];
  return all.filter((row): row is [string, string] => Boolean(row[1]));
}

function plainBody(data: ContactPayload, appUrl?: string): string {
  return [
    `Neue Anfrage über ${site.url.replace(/^https?:\/\//, "")}`,
    "",
    ...rows(data).map(([k, v]) => `${k}: ${v}`),
    "",
    data.message,
    "",
    "—",
    appUrl ? `In der Admin-App ansehen: ${appUrl}` : `Gesendet über ${site.url}`,
  ].join("\n");
}

function htmlBody(data: ContactPayload, appUrl?: string): string {
  return `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#0a0f16">
      <h2 style="margin:0 0 16px;font-size:18px">Neue Anfrage über ${escapeHtml(site.url.replace(/^https?:\/\//, ""))}</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows(data)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#515b68">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #0097b2;padding:4px 0 4px 14px">${escapeHtml(data.message)}</div>
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #d5dce6;font-size:13px;color:#515b68">
        ${appUrl ? `<a href="${escapeHtml(appUrl)}" style="color:#082078">In der Admin-App ansehen</a>` : `Gesendet über ${escapeHtml(site.url)}`}
      </p>
    </div>`;
}

/** Die ganze Anfrage per E-Mail an Daniela — „Antworten“ geht an die anfragende Person. */
export async function sendContactMail(data: ContactPayload, appUrl?: string): Promise<void> {
  const name = headerSafe(`${data.firstName} ${data.lastName}`);
  await deliver({
    from: sender(),
    to: { address: recipient() },
    replyTo: { name, address: headerSafe(data.email) },
    subject: `Anfrage von ${name}${data.company ? ` (${headerSafe(data.company)})` : ""}${data.topic ? ` – ${headerSafe(data.topic)}` : ""}`,
    text: plainBody(data, appUrl),
    html: htmlBody(data, appUrl),
  });
}

/** Hinweis ohne Inhalt: nur, dass eine Anfrage da ist, und wo. */
export async function sendInquiryNotice(appUrl: string): Promise<void> {
  await deliver({
    from: sender(),
    to: { address: recipient() },
    subject: "Neue Anfrage über die Website",
    text: ["Über das Kontaktformular ist eine neue Anfrage eingegangen.", "", `Ansehen: ${appUrl}`].join("\n"),
  });
}

/* ------------------------------------------- Eingangsbestätigung -- */

/**
 * Absender der Eingangsbestätigung an Anfragende (`CONFIRMATION_FROM`), eine
 * Adresse auf der Domain projexs.de. Ohne sie geht keine Bestätigung raus.
 */
export function confirmationSender(): string | null {
  const from = process.env.CONFIRMATION_FROM?.trim();
  return from && isMailConfigured() ? headerSafe(from) : null;
}

function confirmationText(locale: "de" | "en"): { subject: string; text: string } {
  const domain = site.url.replace(/^https?:\/\//, "");
  if (locale === "en") {
    return {
      subject: `Your message to ${site.brand} – ${site.owner.name}`,
      text: [
        "Dear Sir or Madam,",
        "",
        "thank you for your message via my website. It has reached me safely, and I will get back to you personally shortly.",
        "",
        `If it is urgent, you can reach me by phone at ${site.contact.phone}.`,
        "",
        "Kind regards",
        site.owner.name,
        site.owner.roles.en.join(" · "),
        domain,
        "",
        "—",
        `This e-mail was sent automatically because a message was submitted with this address via the contact form on ${domain}. If that was not you, you can simply ignore it.`,
      ].join("\n"),
    };
  }
  return {
    subject: `Ihre Nachricht an ${site.brand} – ${site.owner.name}`,
    text: [
      "Guten Tag,",
      "",
      "vielen Dank für Ihre Nachricht über meine Website. Sie ist gut bei mir angekommen, und ich melde mich zeitnah persönlich bei Ihnen.",
      "",
      `Falls es eilt, erreichen Sie mich telefonisch unter ${site.contact.phone}.`,
      "",
      "Herzliche Grüße",
      site.owner.name,
      site.owner.roles.de.join(" · "),
      domain,
      "",
      "—",
      `Diese E-Mail wurde automatisch verschickt, weil über das Kontaktformular auf ${domain} eine Nachricht mit dieser Adresse gesendet wurde. Falls Sie das nicht waren, können Sie diese E-Mail einfach ignorieren.`,
    ].join("\n"),
  };
}

/**
 * Eingangsbestätigung an die Person, die das Formular ausgefüllt hat. Fester
 * Text ohne Angaben aus dem Formular: diskret, und das Formular lässt sich so
 * nicht missbrauchen, um fremden Adressen beliebigen Text zu schicken.
 */
export async function sendConfirmationMail(to: string, locale: "de" | "en" = "de"): Promise<void> {
  const from = confirmationSender();
  if (!from) return;
  const { subject, text } = confirmationText(locale);
  await deliver({
    from: { name: site.owner.name, address: from },
    to: { address: headerSafe(to) },
    replyTo: { address: recipient() },
    subject,
    text,
  });
}

/* --------------------------------------------- Antworten aus der App -- */

/**
 * Absender für Antworten aus der App (`REPLY_FROM`, sonst `CONFIRMATION_FROM`,
 * sonst bei SMTP das Postfach selbst). Ohne Adresse öffnet die App das
 * Mailprogramm statt selbst zu senden.
 */
export function replySender(): string | null {
  const explicit = (process.env.REPLY_FROM ?? process.env.CONFIRMATION_FROM)?.trim();
  if (explicit && isMailConfigured()) return headerSafe(explicit);
  if (configuredTransport() === "smtp" && process.env.SMTP_USER?.includes("@")) return headerSafe(process.env.SMTP_USER);
  return null;
}

/** Antwort an eine anfragende Person — Rückantworten landen bei Daniela. */
export async function sendReplyMail(input: { to: string; toName: string; subject: string; text: string }): Promise<string> {
  const from = replySender();
  if (!from) throw new Error("Kein Absender für Antworten (REPLY_FROM) eingerichtet.");
  await deliver({
    from: { name: site.owner.name, address: from },
    to: { name: headerSafe(input.toName), address: headerSafe(input.to) },
    replyTo: { address: recipient() },
    subject: input.subject,
    text: input.text,
  });
  return from;
}

/** Schlichte Textmail, z. B. Testmail. */
export async function sendPlainMail(to: string, subject: string, text: string): Promise<void> {
  await deliver({ from: sender(), to: { address: headerSafe(to) }, subject, text });
}

/** Prüft Zugangsdaten und Zustellung, ohne eine Anfrage vorzutäuschen. */
export function sendTestMail(to: string): Promise<void> {
  return sendPlainMail(
    to,
    "Test aus der ProjeXs Admin-App",
    [
      "Diese Nachricht kommt aus den Einstellungen der Admin-App.",
      "",
      `Neue Anfragen gehen an: ${recipient()}`,
      `Absender: ${sender().address}`,
      `Versandweg: ${configuredTransport() === "smtp" ? `SMTP (${process.env.SMTP_HOST})` : "Resend"}`,
      "",
      "Kommt diese Mail an, ist der E-Mail-Versand eingerichtet.",
    ].join("\n"),
  );
}
