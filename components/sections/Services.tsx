import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

/* Schlichte, eigens gezeichnete Linien-Icons für die drei Rollen */
const roleIcons = [
  // Projektleitung: Ziel / Kurs
  <svg key="lead" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="24" cy="24" r="17" />
    <circle cx="24" cy="24" r="10" />
    <circle cx="24" cy="24" r="3" fill="currentColor" />
    <path d="M24 3v6M24 39v6M3 24h6M39 24h6" />
  </svg>,
  // Programmmanagement: verbundene Knoten
  <svg key="program" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="18" y="4" width="12" height="9" rx="2" />
    <rect x="4" y="35" width="12" height="9" rx="2" />
    <rect x="18" y="35" width="12" height="9" rx="2" />
    <rect x="32" y="35" width="12" height="9" rx="2" />
    <path d="M24 13v11M10 35v-6h28v6M24 24v11" />
  </svg>,
  // Interim Management: Übergabe / Staffelstab
  <svg key="interim" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M6 18h28l-7-7" />
    <path d="M42 30H14l7 7" />
    <circle cx="40" cy="18" r="3" />
    <circle cx="8" cy="30" r="3" />
  </svg>,
];

export function Services({ dict }: { dict: Dictionary }) {
  const s = dict.services;

  return (
    <section id={dict.ids.services} className="relative bg-paper py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={<Eyebrow index="01">{s.eyebrow}</Eyebrow>} title={s.title} intro={s.intro} />

        <ol className="mt-16 grid grid-cols-1 gap-5 lg:mt-24 lg:grid-cols-3">
          {s.roles.map((role, i) => (
            <li
              key={role.title}
              data-reveal
              style={{ "--reveal-delay": i * 110 } as React.CSSProperties}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white/70 p-8 transition-[border-color,box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_40px_80px_-40px_rgb(10_15_22/0.35)] sm:p-10"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-accent to-navy transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between">
                <span className="size-12 text-accent-deep transition-transform duration-500 ease-out-expo group-hover:rotate-[8deg]">
                  {roleIcons[i]}
                </span>
                <span className="font-mono text-xs text-stone">0{i + 1}</span>
              </div>
              <h3 className="mt-10 text-[1.75rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[2rem]">{role.title}</h3>
              <p className="mt-4 text-[1.02rem] leading-relaxed text-stone">{role.text}</p>
              <ul className="mt-8 flex flex-wrap gap-2 pt-2">
                {role.points.map((p) => (
                  <li key={p} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-[0.8rem] font-medium text-ink/80">
                    {p}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-24 lg:mt-32">
          <h3 data-reveal className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-stone">
            {s.situationsTitle}
          </h3>
          <ul className="mt-8 grid grid-cols-1 border-t border-ink/10 md:grid-cols-2">
            {s.situations.map((item, i) => (
              <li
                key={item.title}
                data-reveal
                style={{ "--reveal-delay": (i % 2) * 120 } as React.CSSProperties}
                className="group flex gap-6 border-b border-ink/10 py-9 md:py-11 md:odd:border-r md:odd:pr-10 md:even:pl-10"
              >
                <span className="font-serif text-[2.6rem] leading-none text-accent-deep/80 transition-colors duration-300 group-hover:text-accent-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xl font-semibold tracking-[-0.02em] sm:text-[1.4rem]">{item.title}</h4>
                  <p className="mt-3 max-w-[34rem] leading-relaxed text-stone">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
