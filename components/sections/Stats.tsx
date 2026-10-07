import type { Dictionary } from "@/lib/i18n";
import { CountUp } from "@/components/ui/CountUp";
import { cn } from "@/lib/utils";

export function Stats({ dict }: { dict: Dictionary }) {
  return (
    <section aria-label={dict.locale === "de" ? "Kennzahlen" : "Key figures"} className="relative bg-ink text-paper">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <dl className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
          {dict.stats.map((s, i) => (
            <div
              key={s.label}
              data-reveal
              style={{ "--reveal-delay": i * 90 } as React.CSSProperties}
              className={cn(
                "flex flex-col-reverse justify-end gap-3 border-b border-white/10 py-9 sm:py-12 lg:border-b-0 lg:px-8",
                i % 2 === 0 ? "border-r pr-4 lg:pr-8" : "pl-5 lg:border-r",
                i === 0 && "lg:pl-0",
                i === dict.stats.length - 1 && "lg:border-r-0",
              )}
            >
              <dt className="max-w-[16rem] text-sm leading-snug text-mist sm:text-[0.95rem]">{s.label}</dt>
              <dd className="font-sans text-[clamp(2.6rem,5vw,4.25rem)] font-semibold leading-none tracking-[-0.05em] text-paper">
                <CountUp value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
