import { cn } from "@/lib/utils";

/** Kleine Kopfzeile über Abschnittsüberschriften. */
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
        "text-[0.9rem] font-semibold uppercase tracking-[0.06em]",
        tone === "dark" ? "text-navy" : "text-mist",
        className,
      )}
    >
      {children}
    </p>
  );
}
