import { cn } from "@/lib/utils";

/** Kleine Kopfzeile über Abschnittsüberschriften – mit kurzem Akzentstrich. */
export function Eyebrow({
  children,
  tone = "dark",
  className,
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.85rem] font-semibold uppercase tracking-[0.08em]",
        tone === "dark" ? "text-navy" : "text-accent-light",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-6", tone === "dark" ? "bg-accent" : "bg-accent-light")} />
      {children}
    </p>
  );
}
