import { site } from "@/content/site";
import { formatDate } from "./format";
import { inquiryName } from "./inquiries";
import type { Inquiry } from "./types";

/** „Sonstiges“ ist kein Thema, das man in der Antwort nennen würde. */
function namedTopic(topic: string): string {
  const value = topic.trim();
  return value && !/^sonstig|^other/i.test(value) ? value : "";
}

type Draftable = Pick<Inquiry, "firstName" | "lastName" | "topic" | "locale">;

/**
 * Vorschlag für die erste Antwort: bestätigt den Eingang und kündigt die
 * persönliche Rückmeldung an. Daniela kann ihn vor dem Senden frei ändern.
 * Englische Anfragen bekommen einen englischen Vorschlag.
 */
export function replyDraft(inquiry: Draftable): { subject: string; text: string } {
  const topic = namedTopic(inquiry.topic);
  const name = inquiryName(inquiry);
  if (inquiry.locale === "en") {
    return {
      subject: topic ? `Your enquiry: ${topic}` : "Your enquiry",
      text: [
        `Dear ${name},`,
        "",
        `thank you for your message${topic ? ` regarding “${topic}”` : ""}. It has reached me safely.`,
        "",
        "I will get back to you personally within the next few days so we can discuss the details and arrange an initial call.",
        "",
        `If it is urgent, you can reach me by phone at ${site.contact.phone}.`,
        "",
        "Kind regards",
        site.owner.name,
        site.owner.roles.en.join(" · "),
        site.url.replace(/^https:\/\//, ""),
      ].join("\n"),
    };
  }
  return {
    subject: topic ? `Ihre Anfrage: ${topic}` : "Ihre Anfrage",
    text: [
      `Guten Tag ${name},`,
      "",
      `vielen Dank für Ihre Nachricht${topic ? ` zum Thema „${topic}“` : ""}. Ihre Anfrage ist gut bei mir angekommen.`,
      "",
      "Ich melde mich in den nächsten Tagen persönlich bei Ihnen, damit wir alles Weitere besprechen und einen Termin für ein Erstgespräch finden.",
      "",
      `Falls es eilt, erreichen Sie mich telefonisch unter ${site.contact.phone}.`,
      "",
      "Herzliche Grüße",
      site.owner.name,
      site.owner.roles.de.join(" · "),
      site.url.replace(/^https:\/\//, ""),
    ].join("\n"),
  };
}

/** Kurzer Rahmen für jede weitere Nachricht an dieselbe Person. */
export function followUpDraft(inquiry: Draftable): string {
  const name = inquiryName(inquiry);
  return inquiry.locale === "en"
    ? [`Dear ${name},`, "", "", "", "Kind regards", site.owner.name].join("\n")
    : [`Guten Tag ${name},`, "", "", "", "Herzliche Grüße", site.owner.name].join("\n");
}

/** Unter jede Antwort: die ursprüngliche Nachricht, zitiert — wie in jedem Mailprogramm. */
export function quotedOriginal(inquiry: Pick<Inquiry, "message" | "createdAt" | "locale">): string {
  const intro =
    inquiry.locale === "en"
      ? `Your message from ${formatDate(inquiry.createdAt, true)}:`
      : `Ihre Nachricht vom ${formatDate(inquiry.createdAt, true)} Uhr:`;
  return ["", "", intro, ...inquiry.message.split("\n").map((line) => `> ${line}`)].join("\n");
}
