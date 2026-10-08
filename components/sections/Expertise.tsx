import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Expertise({ dict }: { dict: Dictionary }) {
  const e = dict.expertise;

  return (
    <section id={dict.ids.expertise} className="section bg-white">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{e.eyebrow}</Eyebrow>} title={e.title} intro={e.intro} />

        <ul className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {e.pillars.map((p, i) => (
            <li key={p.title} className="border-t-2 border-navy/80 pt-5" data-reveal style={{ "--reveal-delay": `${(i % 3) * 70}ms` } as React.CSSProperties}>
              <h3 className="text-[1.2rem] font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 sm:mt-20">
          <h3 className="text-[1.4rem] font-semibold" data-reveal>{e.highlightsTitle}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {e.highlights.map((h, i) => (
              <li key={h.title} className="card bg-surface p-6" data-reveal style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}>
                <h4 className="text-[1.05rem] font-semibold leading-snug text-navy">{h.title}</h4>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-stone">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 sm:mt-20" data-reveal>
          <h3 className="text-[1.4rem] font-semibold">{e.modulesTitle}</h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {e.modules.map((m) => (
              <li key={m.code} className="rounded-md border border-line bg-white px-3 py-1.5 text-[0.92rem] text-ink">
                <span className="font-semibold text-navy">{m.code}</span>
                <span className="text-stone"> · {m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
