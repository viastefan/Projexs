import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Check, Plus } from "@/components/ui/Icons";

export function Services({ dict }: { dict: Dictionary }) {
  const s = dict.services;

  return (
    <section id={dict.ids.services} className="section bg-white">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{s.eyebrow}</Eyebrow>} title={s.title} intro={s.intro} />

        <ol className="swipe-row mt-10">
          {s.roles.map((role, i) => (
            <li key={role.title} className="card flex flex-col p-6 sm:p-8" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
              <span className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-[1.3rem] font-semibold leading-snug">{role.title}</h3>
              <p className="mt-4 leading-relaxed text-stone">{role.text}</p>
              <ul className="mt-6 flex-1 space-y-2 border-t border-line pt-5 text-[0.98rem] text-ink">
                {role.points.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.2} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-14 sm:mt-16">
          <h3 className="text-[1.25rem] font-semibold" data-reveal>{s.situationsTitle}</h3>
          <div className="mt-5 grid gap-x-10 border-t border-line md:grid-cols-2">
            {s.situations.map((item) => (
              <details key={item.title} className="group border-b border-line">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.05rem] font-semibold text-navy">
                  {item.title}
                  <Plus aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="pb-5 leading-relaxed text-stone">{item.text}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
