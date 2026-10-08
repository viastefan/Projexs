"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { submitContact, type ContactErrorCode, type ContactField, type ContactState } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { Check, Mail } from "@/components/ui/Icons";

const initialState: ContactState = { status: "idle" };

export function ContactForm({ dict, source = "form" }: { dict: Dictionary; source?: "form" | "contact-page" }) {
  const f = dict.contact.form;
  const [state, action, pending] = useActionState(submitContact, initialState);
  // Nach fehlerhaftem Absenden: erstes ungültiges Feld fokussieren
  useEffect(() => {
    if (state.status !== "invalid") return;
    document.querySelector<HTMLElement>("form [aria-invalid='true']")?.focus();
  }, [state]);

  const message = (code?: ContactErrorCode) =>
    code === "required"
      ? f.required
      : code === "email"
        ? f.invalidEmail
        : code === "consent"
          ? f.consentRequired
          : code === "short"
            ? f.tooShort
            : undefined;

  const err = (field: ContactField) => message(state.errors?.[field]);
  const v = state.values ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="flex min-h-[28rem] flex-col items-start justify-center rounded-xl border border-line bg-surface p-8 sm:p-12">
        <span className="grid size-12 place-items-center rounded-md bg-navy text-white">
          <Check className="size-6" strokeWidth={2.2} />
        </span>
        <h3 className="mt-6 text-[1.7rem] font-semibold">{f.successTitle}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-stone">{f.successText}</p>
      </div>
    );
  }

  if (state.status === "unconfigured") {
    const details = [
      `Name: ${v.firstName ?? ""} ${v.lastName ?? ""}`,
      `${f.email}: ${v.email ?? ""}`,
      v.phone && `${f.phone}: ${v.phone}`,
      v.company && `${f.company}: ${v.company}`,
      v.topic && `${f.topic} ${v.topic}`,
    ].filter(Boolean);
    const body = `${details.join("\n")}\n\n${v.message ?? ""}`;
    const href = `mailto:${site.contact.email}?subject=${encodeURIComponent(f.mailSubject)}&body=${encodeURIComponent(body)}`;

    return (
      <div role="status" className="flex min-h-[28rem] flex-col items-start justify-center rounded-xl border border-line bg-surface p-8 sm:p-12">
        <span className="grid size-12 place-items-center rounded-md bg-navy text-white">
          <Mail className="size-6" />
        </span>
        <p className="mt-6 max-w-md leading-relaxed text-stone">{f.fallbackText}</p>
        <a
          href={href}
          className="mt-8 inline-flex h-12 items-center rounded-md bg-navy px-6 font-semibold text-white hover:bg-navy-deep"
        >
          {f.fallbackButton}
        </a>
      </div>
    );
  }

  const inputClass = (error?: string) =>
    cn(
      "block h-12 w-full rounded-md border bg-white px-4 text-[1rem] text-ink outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-navy/20",
      error ? "border-red-700" : "border-line",
    );

  return (
    <form
      action={action}
      noValidate
      className="rounded-xl border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-10"
      aria-busy={pending}
    >
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="locale" value={dict.locale} />
      {/* Honeypot – für Menschen unsichtbar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="firstName" label={f.firstName} autoComplete="given-name" required error={err("firstName")} defaultValue={v.firstName} inputClass={inputClass} />
        <Field name="lastName" label={f.lastName} autoComplete="family-name" required error={err("lastName")} defaultValue={v.lastName} inputClass={inputClass} />
        <Field name="email" type="email" label={f.email} autoComplete="email" required error={err("email")} defaultValue={v.email} inputClass={inputClass} />
        <Field name="phone" type="tel" label={f.phone} optional={f.optional} autoComplete="tel" defaultValue={v.phone} inputClass={inputClass} />
        <div className="sm:col-span-2">
          <Field name="company" label={f.company} optional={f.optional} autoComplete="organization" defaultValue={v.company} inputClass={inputClass} />
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="mb-3 text-[0.95rem] font-semibold">
          {f.topic} <span className="font-normal text-stone">({f.optional})</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {f.topics.map((t) => (
            <label
              key={t}
              className="cursor-pointer rounded-md border border-line px-4 py-2 text-[0.95rem] transition-colors hover:border-navy has-checked:border-navy has-checked:bg-navy has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-navy/30"
            >
              <input type="radio" name="topic" value={t} defaultChecked={v.topic === t} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <label htmlFor="message" className="mb-2 block text-[0.95rem] font-semibold">
          {f.message} <span aria-hidden="true" className="text-red-700">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          defaultValue={v.message}
          placeholder={f.messagePlaceholder}
          aria-invalid={Boolean(err("message"))}
          aria-describedby={err("message") ? "message-error" : undefined}
          className={cn(
            "block w-full resize-y rounded-md border bg-white px-4 py-3 text-[1rem] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-navy focus:ring-2 focus:ring-navy/20",
            err("message") ? "border-red-700" : "border-line",
          )}
        />
        {err("message") && (
          <p id="message-error" className="mt-2 text-[0.95rem] text-red-700">
            {err("message")}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-stone">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(err("consent"))}
            aria-describedby={err("consent") ? "consent-error" : undefined}
            className="mt-1 size-[1.05rem] shrink-0 cursor-pointer accent-[var(--color-navy)]"
          />
          <span>
            {f.consentBefore}
            <Link href={dict.routes.privacy} className="font-semibold text-navy underline underline-offset-4">
              {f.consentLink}
            </Link>
            {f.consentAfter}
          </span>
        </label>
        {err("consent") && (
          <p id="consent-error" className="mt-2 pl-7 text-[0.95rem] text-red-700">
            {err("consent")}
          </p>
        )}
      </div>

      {state.status === "error" && (
        <p role="alert" className="mt-6 border border-red-700 bg-red-50 p-4 text-[0.95rem] text-red-800">
          {f.errorText}{" "}
          <a href={`mailto:${site.contact.email}`} className="font-semibold underline">
            {site.contact.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-md bg-navy px-8 text-[1rem] font-semibold text-white transition-colors hover:bg-navy-deep disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? f.sending : f.submit}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  optional,
  error,
  autoComplete,
  defaultValue,
  inputClass,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: string;
  error?: string;
  autoComplete?: string;
  defaultValue?: string;
  inputClass: (error?: string) => string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[0.95rem] font-semibold">
        {label}{" "}
        {required && (
          <span aria-hidden="true" className="text-red-700">
            *
          </span>
        )}
        {optional && <span className="font-normal text-stone">({optional})</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass(error)}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-[0.95rem] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
