import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Expertise({ dict }: { dict: Dictionary }) {
  const e = dict.expertise;

  return (
    <section id={dict.ids.expertise} className="border-y border-line bg-surface py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <SectionHeading eyebrow={<Eyebrow>{e.eyebrow}</Eyebrow>} title={e.title} intro={e.intro} />

        <ul className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {e.pillars.map((p) => (
            <li key={p.title} className="border-t border-navy pt-6">
              <h3 className="text-[1.2rem] font-semibold">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-stone">{p.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-20">
          <h3 className="text-[1.4rem] font-semibold">{e.highlightsTitle}</h3>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {e.highlights.map((h) => (
              <li key={h.title} className="border border-line bg-white p-6">
                <h4 className="text-[1.05rem] font-semibold leading-snug text-navy">{h.title}</h4>
                <p className="mt-3 text-[0.98rem] leading-relaxed text-stone">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20">
          <h3 className="text-[1.4rem] font-semibold">{e.modulesTitle}</h3>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {e.modules.map((m) => (
              <li key={m.code} className="border border-line bg-white px-3.5 py-2 text-[0.95rem] text-ink">
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
