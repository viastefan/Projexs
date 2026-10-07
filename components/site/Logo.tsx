import { cn } from "@/lib/utils";

/**
 * Das „X“ der Marke: zwei Linien, die sich kreuzen –
 * Fachbereich und IT, Plan und Umsetzung. Eine davon in Signal-Orange.
 */
export function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" fill="none">
      <path d="M14 14 86 86" stroke="currentColor" strokeWidth="17" strokeLinecap="square" />
      <path d="M86 14 14 86" stroke="var(--color-accent)" strokeWidth="17" strokeLinecap="square" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-sans text-[1.35rem] font-semibold leading-none tracking-[-0.04em]",
        className,
      )}
    >
      Proje
      <XMark className="mx-[0.035em] inline-block h-[0.66em] w-[0.66em] translate-y-[0.01em] self-baseline" />
      s
    </span>
  );
}

/** Quadratisches Bildzeichen (Favicon, Monogramm, Social) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" fill="none">
      <rect width="64" height="64" rx="14" fill="var(--color-ink)" />
      <path d="M19 19 45 45" stroke="#f5f2ec" strokeWidth="7" strokeLinecap="square" />
      <path d="M45 19 19 45" stroke="var(--color-accent)" strokeWidth="7" strokeLinecap="square" />
    </svg>
  );
}
