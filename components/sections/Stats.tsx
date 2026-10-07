import type { Dictionary } from "@/lib/i18n";

export function Stats({ dict }: { dict: Dictionary }) {
  return (
    <section aria-label={dict.locale === "de" ? "Kennzahlen" : "Key figures"} className="border-y border-line bg-surface">
      <div className="mx-auto max-w-[80rem] px-5 py-12 sm:px-8 lg:py-14">
        <dl className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-4">
          {dict.stats.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse border-l-2 border-navy pl-4 sm:pl-5">
              <dt className="mt-3 text-[0.98rem] leading-snug text-stone [overflow-wrap:anywhere]">{s.label}</dt>
              <dd className="text-[clamp(2.2rem,4vw,2.9rem)] font-semibold leading-none text-navy">
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
