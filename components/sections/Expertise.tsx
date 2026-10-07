import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Expertise({ dict }: { dict: Dictionary }) {
  const e = dict.expertise;

  return (
    <section id={dict.ids.expertise} className="grain relative isolate overflow-hidden bg-ink py-24 text-paper sm:py-32 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[15%] top-[10%] h-[70vh] w-[70vh] rounded-full bg-navy/40 blur-[150px]" />
        <div className="bg-grid-ink absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          tone="light"
          eyebrow={
            <Eyebrow index="02" tone="light">
              {e.eyebrow}
            </Eyebrow>
          }
          title={
            <>
              {e.title.split(". ")[0]}.{" "}
              <span className="font-serif font-normal italic tracking-[-0.02em] text-accent">
                {e.title.split(". ").slice(1).join(". ")}
              </span>
            </>
          }
          intro={e.intro}
        />

        {/* Säulen der Expertise */}
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] bg-white/10 ring-1 ring-white/10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {e.pillars.map((p, i) => (
            <li
              key={p.title}
              data-reveal
              style={{ "--reveal-delay": (i % 3) * 100 } as React.CSSProperties}
              className="group relative bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 sm:p-10"
            >
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-[1.35rem] font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-mist">{p.text}</p>
            </li>
          ))}
        </ul>

        {/* Highlights */}
        <div className="mt-24 lg:mt-32">
          <h3 data-reveal className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-mist">
            {e.highlightsTitle}
          </h3>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {e.highlights.map((h, i) => (
              <li
                key={h.title}
                data-reveal
                style={{ "--reveal-delay": i * 90 } as React.CSSProperties}
                className="relative rounded-2xl bg-gradient-to-b from-ink-3/80 to-ink-2/60 p-7 ring-1 ring-inset ring-white/[0.07]"
              >
                <span aria-hidden="true" className="absolute left-7 top-0 h-[2px] w-10 bg-accent" />
                <h4 className="mt-3 text-lg font-semibold leading-snug tracking-[-0.015em]">{h.title}</h4>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* SAP-Module */}
        <div className="mt-24 lg:mt-32">
          <h3 data-reveal className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-mist">
            {e.modulesTitle}
          </h3>
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/10 min-[420px]:grid-cols-4 lg:grid-cols-8">
            {e.modules.map((m, i) => (
              <li
                key={m.code}
                data-reveal="fade"
                style={{ "--reveal-delay": i * 35 } as React.CSSProperties}
                className="group flex aspect-[4/3] flex-col justify-between bg-ink p-4 transition-colors duration-300 hover:bg-accent sm:p-5"
              >
                <span className="font-mono text-[clamp(1.2rem,2vw,1.6rem)] font-medium tracking-tight text-paper transition-colors group-hover:text-ink">
                  {m.code}
                </span>
                <span className="text-[0.76rem] leading-tight text-mist transition-colors group-hover:text-ink/80">{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
