import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Einheitlicher Abschnittskopf: Überschrift und Einleitung, optional mit Kopfzeile. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)} data-reveal>
      {eyebrow ?? <span aria-hidden="true" className={cn("draw-line mb-5 block h-1 w-10 rounded-full bg-gradient-to-r from-accent to-accent-light", align === "center" && "mx-auto")} />}
      <h2
        className={cn(
          eyebrow ? "mt-3" : undefined,
          "text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-[1.12] tracking-[-0.01em]",
          tone === "light" && "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 text-[1.05rem] leading-relaxed sm:text-[1.1rem]", tone === "dark" ? "text-stone" : "text-mist")}>
          {intro}
        </p>
      )}
    </div>
  );
}
