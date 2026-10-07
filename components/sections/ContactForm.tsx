"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactErrorCode, type ContactField, type ContactState } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Mail } from "@/components/ui/Icons";

const initialState: ContactState = { status: "idle" };

export function ContactForm({ dict }: { dict: Dictionary }) {
  const f = dict.contact.form;
  const [state, action, pending] = useActionState(submitContact, initialState);
  const startedRef = useRef<HTMLInputElement>(null);

  // Zeitpunkt des Seitenaufrufs für den Spam-Schutz (Mindest-Ausfüllzeit)
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);

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
      <div role="status" className="flex min-h-[32rem] flex-col items-start justify-center rounded-[2rem] bg-paper p-8 text-ink sm:p-12">
        <span className="grid size-14 place-items-center rounded-full bg-accent text-ink">
          <Check className="size-7" strokeWidth={2.2} />
        </span>
        <h3 className="mt-8 text-[2.2rem] font-semibold tracking-[-0.04em]">{f.successTitle}</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-stone">{f.successText}</p>
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
      <div role="status" className="flex min-h-[32rem] flex-col items-start justify-center rounded-[2rem] bg-paper p-8 text-ink sm:p-12">
        <span className="grid size-14 place-items-center rounded-full bg-ink text-paper">
          <Mail className="size-6" />
        </span>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-stone">{f.fallbackText}</p>
        <a
          href={href}
          className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-ink px-6 font-medium text-paper transition-colors hover:bg-ink-3"
        >
          {f.fallbackButton}
          <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="rounded-[2rem] bg-paper p-6 text-ink sm:p-10" aria-busy={pending}>
      <input ref={startedRef} type="hidden" name="startedAt" defaultValue="0" />
      {/* Honeypot – für Menschen unsichtbar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="firstName" label={f.firstName} autoComplete="given-name" required error={err("firstName")} defaultValue={v.firstName} />
        <Field name="lastName" label={f.lastName} autoComplete="family-name" required error={err("lastName")} defaultValue={v.lastName} />
        <Field name="email" type="email" label={f.email} autoComplete="email" required error={err("email")} defaultValue={v.email} />
        <Field name="phone" type="tel" label={f.phone} optional={f.optional} autoComplete="tel" defaultValue={v.phone} />
        <div className="sm:col-span-2">
          <Field name="company" label={f.company} optional={f.optional} autoComplete="organization" defaultValue={v.company} />
        </div>
      </div>

      <fieldset className="mt-7">
        <legend className="mb-3 text-sm font-medium">
          {f.topic} <span className="font-normal text-stone">({f.optional})</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {f.topics.map((t) => (
            <label
              key={t}
              className="cursor-pointer rounded-full border border-ink/15 px-4 py-2 text-[0.88rem] transition-colors hover:border-ink/40 has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-accent has-focus-visible:ring-offset-2"
            >
              <input type="radio" name="topic" value={t} defaultChecked={v.topic === t} className="sr-only" />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          {f.message} <span aria-hidden="true" className="text-accent-deep">*</span>
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
            "block w-full resize-y rounded-2xl border bg-white px-4 py-3.5 text-[1rem] outline-none transition-[border-color,box-shadow] placeholder:text-stone/60 focus:border-accent focus:ring-4 focus:ring-accent/15",
            err("message") ? "border-red-600" : "border-ink/15",
          )}
        />
        {err("message") && (
          <p id="message-error" className="mt-2 text-sm text-red-700">
            {err("message")}
          </p>
        )}
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-[0.9rem] leading-relaxed text-stone">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={Boolean(err("consent"))}
            aria-describedby={err("consent") ? "consent-error" : undefined}
            className="mt-1 size-[1.1rem] shrink-0 cursor-pointer rounded accent-[var(--color-accent-deep)]"
          />
          <span>
            {f.consentBefore}
            <Link href={dict.routes.privacy} className="font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              {f.consentLink}
            </Link>
            {f.consentAfter}
          </span>
        </label>
        {err("consent") && (
          <p id="consent-error" className="mt-2 pl-7 text-sm text-red-700">
            {err("consent")}
          </p>
        )}
      </div>

      {state.status === "error" && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {f.errorText}{" "}
          <a href={`mailto:${site.contact.email}`} className="font-medium underline">
            {site.contact.email}
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-base font-medium text-paper transition-colors hover:bg-ink-3 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {pending ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" aria-hidden="true" />
            {f.sending}
          </>
        ) : (
          <>
            {f.submit}
            <ArrowRight className="size-[18px] transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
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
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: string;
  error?: string;
  autoComplete?: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label}{" "}
        {required && (
          <span aria-hidden="true" className="text-accent-deep">
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
        className={cn(
          "block h-12 w-full rounded-xl border bg-white px-4 text-[1rem] outline-none transition-[border-color,box-shadow] focus:border-accent focus:ring-4 focus:ring-accent/15",
          error ? "border-red-600" : "border-ink/15",
        )}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
