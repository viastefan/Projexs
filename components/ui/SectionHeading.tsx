import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Einheitlicher Abschnittskopf: Kopfzeile, Überschrift und Einleitung. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow}
      <h2
        className={cn(
          "mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-[1.15]",
          tone === "light" && "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 text-[1.05rem] leading-relaxed", tone === "dark" ? "text-stone" : "text-mist")}>{intro}</p>
      )}
    </div>
  );
}
