import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Einheitlicher Abschnittskopf: Eyebrow + große Überschrift links, Intro rechts. */
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
    <div className={cn("grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
      <div className="lg:col-span-7">
        <div data-reveal>{eyebrow}</div>
        <h2
          data-reveal
          style={{ "--reveal-delay": 80 } as React.CSSProperties}
          className="mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
        >
          {title}
        </h2>
      </div>
      {intro && (
        <p
          data-reveal
          style={{ "--reveal-delay": 160 } as React.CSSProperties}
          className={cn(
            "text-[1.08rem] leading-relaxed lg:col-span-5 lg:pb-2",
            tone === "dark" ? "text-stone" : "text-mist",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
