import type { Dictionary } from "@/lib/i18n";

export function Stats({ dict }: { dict: Dictionary }) {
  return (
    <section aria-label={dict.locale === "de" ? "Kennzahlen" : "Key figures"} className="border-b border-line bg-white">
      <div className="container-site py-10 sm:py-12 lg:py-14">
        <dl className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-4">
          {dict.stats.map((s, i) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse border-l-2 border-accent pl-4 sm:pl-5" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <dt className="mt-2.5 text-[0.95rem] leading-snug text-stone [overflow-wrap:anywhere]">{s.label}</dt>
              <dd className="text-[clamp(2.3rem,4.5vw,3.1rem)] font-semibold leading-none tracking-[-0.02em] text-navy">
                {s.value}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
