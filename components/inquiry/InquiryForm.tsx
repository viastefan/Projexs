"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { submitContact, type ContactErrorCode, type ContactField, type ContactState } from "@/lib/contact";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, Mail } from "@/components/ui/Icons";
import type { InquirySource } from "./InquiryTrigger";

type StepKey = "topic" | "timeframe" | "person" | "contact" | "message" | "consent";

const STEPS: Array<{ key: StepKey; fields: ContactField[]; optional?: boolean }> = [
  { key: "topic", fields: ["topic"], optional: true },
  { key: "timeframe", fields: ["timeframe"], optional: true },
  { key: "person", fields: ["firstName", "lastName", "company"] },
  { key: "contact", fields: ["email", "phone"] },
  { key: "message", fields: ["message"] },
  { key: "consent", fields: ["consent"] },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const initialState: ContactState = { status: "idle" };

type Values = Record<Exclude<ContactField, "consent">, string> & { consent: boolean };

const emptyValues: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
  topic: "",
  timeframe: "",
  message: "",
  consent: false,
};

/**
 * Mehrstufiges Anfrageformular (eine Frage pro Schritt).
 * Alle Felder bleiben in einem Formular; nicht aktive Schritte sind ausgeblendet,
 * sodass am Ende ein einziger Server-Aufruf erfolgt.
 */
export function InquiryForm({
  dict,
  variant = "inline",
  source,
}: {
  dict: Dictionary;
  variant?: "inline" | "modal";
  /** Herkunft der Anfrage (verstecktes Feld „source“). */
  source?: InquirySource;
}) {
  const f = dict.contact.form;
  const q = dict.inquiry;
  const [state, action, pending] = useActionState(submitContact, initialState);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(emptyValues);
  const [clientErrors, setClientErrors] = useState<Partial<Record<ContactField, string>>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const total = STEPS.length;
  const current = STEPS[step];

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

  // Serverseitige Fehler: zum ersten betroffenen Schritt springen.
  // Abgeleiteter Zustand wird direkt beim Rendern gesetzt (kein Effect nötig).
  const [handledState, setHandledState] = useState<ContactState>(state);
  if (state !== handledState) {
    setHandledState(state);
    if (state.status === "invalid" && state.errors) {
      const errorFields = Object.keys(state.errors) as ContactField[];
      const index = STEPS.findIndex((s) => s.fields.some((fld) => errorFields.includes(fld)));
      if (index >= 0) setStep(index);
      const mapped: Partial<Record<ContactField, string>> = {};
      for (const fld of errorFields) mapped[fld] = message(state.errors[fld]);
      setClientErrors(mapped);
    }
  }

  // Beim Schrittwechsel das erste Eingabefeld fokussieren
  useEffect(() => {
    const el = panelRef.current?.querySelector<HTMLElement>("input:not([type=hidden]), textarea");
    el?.focus({ preventScroll: variant === "inline" });
  }, [step, variant]);

  const set = (field: keyof Values, value: string | boolean) => {
    setValues((v) => ({ ...v, [field]: value }));
    setClientErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (index: number) => {
    const errors: Partial<Record<ContactField, string>> = {};
    const s = STEPS[index];
    if (s.key === "person") {
      if (!values.firstName.trim()) errors.firstName = f.required;
      if (!values.lastName.trim()) errors.lastName = f.required;
    }
    if (s.key === "contact") {
      if (!values.email.trim()) errors.email = f.required;
      else if (!EMAIL_RE.test(values.email.trim())) errors.email = f.invalidEmail;
    }
    if (s.key === "consent" && !values.consent) errors.consent = f.consentRequired;
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, total - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key !== "Enter" || target.tagName === "TEXTAREA" || target.tagName === "BUTTON") return;
    e.preventDefault();
    if (step < total - 1) next();
    else if (validateStep(step)) e.currentTarget.requestSubmit();
  };

  const frame = cn(
    "bg-white",
    variant === "inline" ? "rounded-xl border border-line p-5 shadow-[var(--shadow-card)] sm:p-10" : "p-5 sm:p-8",
  );

  if (state.status === "success") {
    return (
      <div role="status" className={cn(frame, "flex min-h-[24rem] flex-col items-start justify-center")}>
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
      `Name: ${values.firstName} ${values.lastName}`,
      `${f.email}: ${values.email}`,
      values.phone && `${f.phone}: ${values.phone}`,
      values.company && `${f.company}: ${values.company}`,
      values.topic && `${f.topic} ${values.topic}`,
      values.timeframe && `${q.steps.timeframe.label}: ${values.timeframe}`,
    ].filter(Boolean);
    const body = `${details.join("\n")}\n\n${values.message}`;
    const href = `mailto:${site.contact.email}?subject=${encodeURIComponent(f.mailSubject)}&body=${encodeURIComponent(body)}`;
    return (
      <div role="status" className={cn(frame, "flex min-h-[24rem] flex-col items-start justify-center")}>
        <span className="grid size-12 place-items-center rounded-md bg-navy text-white">
          <Mail className="size-6" />
        </span>
        <p className="mt-6 max-w-md leading-relaxed text-stone">{f.fallbackText}</p>
        <a href={href} className="mt-8 inline-flex h-12 items-center rounded-md bg-navy px-6 font-semibold text-white hover:bg-navy-deep">
          {f.fallbackButton}
        </a>
      </div>
    );
  }

  const inputClass = (error?: string) =>
    cn(
      "block h-12 w-full rounded-md border bg-white px-4 text-[1.02rem] text-ink outline-none transition-colors focus:border-navy focus:ring-2 focus:ring-navy/20",
      error ? "border-red-700" : "border-line",
    );

  const chip = (checked: boolean) =>
    cn(
      "cursor-pointer rounded-md border px-4 py-2.5 text-[0.98rem] transition-colors hover:border-navy has-focus-visible:ring-2 has-focus-visible:ring-navy/30",
      checked ? "border-navy bg-navy text-white" : "border-line bg-white text-ink",
    );

  const err = (field: ContactField) => clientErrors[field];

  return (
    <form action={action} noValidate onKeyDown={onKeyDown} className={frame} aria-busy={pending}>
      <input type="hidden" name="source" value={source ?? (variant === "modal" ? "dialog" : "contact-page")} />
      <input type="hidden" name="locale" value={dict.locale} />
      {/* Honeypot – für Menschen unsichtbar */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Fortschritt */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.85rem] font-semibold uppercase tracking-[0.06em] text-stone">
          {q.stepLabel} {step + 1} {q.of} {total}
        </p>
        <p className="hidden text-[0.85rem] text-stone sm:block">{q.enterHint}</p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step + 1}
        aria-label={`${q.stepLabel} ${step + 1} ${q.of} ${total}`}
        className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface"
      >
        <div className="h-full rounded-full bg-navy transition-[width] duration-300" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      {/* Schritte – nur der aktive ist sichtbar, alle Felder bleiben Teil des Formulars */}
      <div ref={panelRef} key={step} className="animate-step mt-8 min-h-[16rem]">
        {/* 1 · Thema */}
        <fieldset hidden={current.key !== "topic"}>
          <legend className="text-[1.45rem] font-semibold leading-snug text-navy">{q.steps.topic.q}</legend>
          <p className="mt-2 text-stone">{q.steps.topic.hint}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {f.topics.map((t) => (
              <label key={t} className={chip(values.topic === t)}>
                <input type="radio" name="topic" value={t} checked={values.topic === t} onChange={() => set("topic", t)} className="sr-only" />
                {t}
              </label>
            ))}
          </div>
          <p className="mt-5 text-[0.9rem] text-stone">{q.optionalHint}</p>
        </fieldset>

        {/* 2 · Zeitrahmen */}
        <fieldset hidden={current.key !== "timeframe"}>
          <legend className="text-[1.45rem] font-semibold leading-snug text-navy">{q.steps.timeframe.q}</legend>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {q.steps.timeframe.options.map((t) => (
              <label key={t} className={chip(values.timeframe === t)}>
                <input type="radio" name="timeframe" value={t} checked={values.timeframe === t} onChange={() => set("timeframe", t)} className="sr-only" />
                {t}
              </label>
            ))}
          </div>
          <p className="mt-5 text-[0.9rem] text-stone">{q.optionalHint}</p>
        </fieldset>

        {/* 3 · Person */}
        <div hidden={current.key !== "person"}>
          <h3 className="text-[1.45rem] font-semibold leading-snug text-navy">{q.steps.person.q}</h3>
          <p className="mt-2 text-stone">{q.steps.person.hint}</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="iq-firstName" name="firstName" label={f.firstName} required autoComplete="given-name" value={values.firstName} onChange={(v) => set("firstName", v)} error={err("firstName")} inputClass={inputClass} />
            <Field id="iq-lastName" name="lastName" label={f.lastName} required autoComplete="family-name" value={values.lastName} onChange={(v) => set("lastName", v)} error={err("lastName")} inputClass={inputClass} />
            <div className="sm:col-span-2">
              <Field id="iq-company" name="company" label={f.company} optional={f.optional} autoComplete="organization" value={values.company} onChange={(v) => set("company", v)} inputClass={inputClass} />
            </div>
          </div>
        </div>

        {/* 4 · Kontakt */}
        <div hidden={current.key !== "contact"}>
          <h3 className="text-[1.45rem] font-semibold leading-snug text-navy">{q.steps.contact.q}</h3>
          <p className="mt-2 text-stone">{q.steps.contact.hint}</p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="iq-email" name="email" type="email" label={f.email} required autoComplete="email" value={values.email} onChange={(v) => set("email", v)} error={err("email")} inputClass={inputClass} />
            <Field id="iq-phone" name="phone" type="tel" label={f.phone} optional={f.optional} autoComplete="tel" value={values.phone} onChange={(v) => set("phone", v)} inputClass={inputClass} />
          </div>
        </div>

        {/* 5 · Nachricht */}
        <div hidden={current.key !== "message"}>
          <label htmlFor="iq-message" className="block text-[1.45rem] font-semibold leading-snug text-navy">
            {q.steps.message.q}
          </label>
          <p className="mt-2 text-stone">{q.steps.message.hint}</p>
          <textarea
            id="iq-message"
            name="message"
            rows={6}
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder={f.messagePlaceholder}
            aria-invalid={Boolean(err("message"))}
            aria-describedby={err("message") ? "iq-message-error" : undefined}
            className={cn(
              "mt-6 block w-full resize-y rounded-md border bg-white px-4 py-3 text-[1.02rem] text-ink outline-none transition-colors placeholder:text-stone/70 focus:border-navy focus:ring-2 focus:ring-navy/20",
              err("message") ? "border-red-700" : "border-line",
            )}
          />
          {err("message") && (
            <p id="iq-message-error" className="mt-2 text-[0.95rem] text-red-700">
              {err("message")}
            </p>
          )}
          <p className="mt-5 text-[0.9rem] text-stone">{q.optionalHint}</p>
        </div>

        {/* 6 · Einwilligung */}
        <div hidden={current.key !== "consent"}>
          <h3 className="text-[1.45rem] font-semibold leading-snug text-navy">{q.steps.consent.q}</h3>
          <p className="mt-2 text-stone">{q.steps.consent.hint}</p>
          <dl className="mt-6 grid gap-2 rounded-md bg-surface p-5 text-[0.95rem] sm:grid-cols-[9rem_1fr]">
            <dt className="text-stone">{f.firstName}</dt>
            <dd className="font-semibold">
              {values.firstName} {values.lastName}
              {values.company ? ` · ${values.company}` : ""}
            </dd>
            <dt className="text-stone">{f.email}</dt>
            <dd className="font-semibold">{values.email}</dd>
            {values.topic && (
              <>
                <dt className="text-stone">{f.topic}</dt>
                <dd className="font-semibold">{values.topic}</dd>
              </>
            )}
            {values.timeframe && (
              <>
                <dt className="text-stone">{q.steps.timeframe.label}</dt>
                <dd className="font-semibold">{values.timeframe}</dd>
              </>
            )}
          </dl>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-stone">
            <input
              type="checkbox"
              name="consent"
              checked={values.consent}
              onChange={(e) => set("consent", e.target.checked)}
              aria-invalid={Boolean(err("consent"))}
              aria-describedby={err("consent") ? "iq-consent-error" : undefined}
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
            <p id="iq-consent-error" className="mt-2 pl-7 text-[0.95rem] text-red-700">
              {err("consent")}
            </p>
          )}
          {state.status === "error" && (
            <p role="alert" className="mt-5 rounded-md border border-red-700 bg-red-50 p-4 text-[0.95rem] text-red-800">
              {f.errorText}{" "}
              <a href={`mailto:${site.contact.email}`} className="font-semibold underline">
                {site.contact.email}
              </a>
              .
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="inline-flex h-11 items-center justify-center rounded-md px-4 text-[0.98rem] font-semibold text-navy hover:underline underline-offset-4 disabled:invisible"
        >
          ← {q.back}
        </button>
        {step < total - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-navy-deep"
          >
            {q.next}
            <ArrowRight className="size-[18px]" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 text-[1rem] font-semibold text-white transition-colors hover:bg-navy-deep disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? f.sending : q.submit}
            {!pending && <Check className="size-[18px]" />}
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  optional,
  error,
  autoComplete,
  value,
  onChange,
  inputClass,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: string;
  error?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  inputClass: (error?: string) => string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.95rem] font-semibold">
        {label}{" "}
        {required && (
          <span aria-hidden="true" className="text-red-700">
            *
          </span>
        )}
        {optional && <span className="font-normal text-stone">({optional})</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClass(error)}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.95rem] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
