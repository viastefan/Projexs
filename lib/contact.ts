"use server";

import { site } from "@/content/site";

export type ContactField = "firstName" | "lastName" | "email" | "phone" | "company" | "topic" | "message" | "consent";
export type ContactErrorCode = "required" | "email" | "consent" | "short";

export type ContactValues = Partial<Record<Exclude<ContactField, "consent">, string>>;

export type ContactState = {
  status: "idle" | "success" | "invalid" | "error" | "unconfigured";
  errors?: Partial<Record<ContactField, ContactErrorCode>>;
  values?: ContactValues;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500;

function clean(value: FormDataEntryValue | null, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactValues = {
    firstName: clean(formData.get("firstName"), 120),
    lastName: clean(formData.get("lastName"), 120),
    email: clean(formData.get("email"), 200),
    phone: clean(formData.get("phone"), 60),
    company: clean(formData.get("company"), 160),
    topic: clean(formData.get("topic"), 120),
    message: clean(formData.get("message"), 5000),
  };
  const consent = formData.get("consent") === "on";

  // Spam-Schutz: unsichtbares Honeypot-Feld und Mindest-Ausfüllzeit.
  // Bots erhalten eine scheinbar erfolgreiche Antwort.
  const honeypot = clean(formData.get("website"));
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (honeypot || (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: "success" };
  }

  const errors: ContactState["errors"] = {};
  if (!values.firstName) errors.firstName = "required";
  if (!values.lastName) errors.lastName = "required";
  if (!values.email) errors.email = "required";
  else if (!EMAIL_RE.test(values.email)) errors.email = "email";
  if (!values.message) errors.message = "required";
  else if (values.message.length < 10) errors.message = "short";
  if (!consent) errors.consent = "consent";

  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Kein Mail-Dienst konfiguriert: Formular bietet den Versand per E-Mail-Programm an.
    return { status: "unconfigured", values };
  }

  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || `ProjeXs Website <website@projexs.de>`;
  const name = `${values.firstName} ${values.lastName}`;

  const rows: Array<[string, string | undefined]> = [
    ["Name", name],
    ["E-Mail", values.email],
    ["Mobil", values.phone],
    ["Firma", values.company],
    ["Anliegen", values.topic],
  ];

  const text = [
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    values.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#0a0f16">
      <h2 style="margin:0 0 16px;font-size:18px">Neue Anfrage über projexs.de</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .filter(([, v]) => v)
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#515b68">${k}</td><td style="padding:4px 0"><strong>${escapeHtml(v!)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <div style="white-space:pre-wrap;border-left:3px solid #0aa5c0;padding:4px 0 4px 14px">${escapeHtml(values.message!)}</div>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: `Anfrage von ${name}${values.company ? ` (${values.company})` : ""}${values.topic ? ` – ${values.topic}` : ""}`,
        text,
        html,
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Kontaktformular: Versand fehlgeschlagen", res.status, await res.text().catch(() => ""));
      return { status: "error", values };
    }
    return { status: "success" };
  } catch (err) {
    console.error("Kontaktformular: Netzwerkfehler", err);
    return { status: "error", values };
  }
}
