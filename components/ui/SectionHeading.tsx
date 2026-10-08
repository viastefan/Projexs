import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Einheitlicher Abschnittskopf: Kopfzeile, Überschrift und Einleitung. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  className,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)} data-reveal>
      {eyebrow}
      <h2
        className={cn(
          "mt-3 text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-[1.12] tracking-[-0.01em]",
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
