import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Plus } from "@/components/ui/Icons";

export function Expertise({ dict }: { dict: Dictionary }) {
  const e = dict.expertise;

  return (
    <section id={dict.ids.expertise} className="section bg-white">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{e.eyebrow}</Eyebrow>} title={e.title} intro={e.intro} />

        <div className="mt-10 grid gap-x-10 border-t border-line md:grid-cols-2">
          {e.pillars.map((p) => (
            <details key={p.title} className="group border-b border-line">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[1.1rem] font-semibold text-navy">
                {p.title}
                <Plus aria-hidden="true" className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <p className="pb-5 leading-relaxed text-stone">{p.text}</p>
            </details>
          ))}
        </div>

        <div className="mt-12" data-reveal>
          <h3 className="text-[1.25rem] font-semibold">{e.modulesTitle}</h3>
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
