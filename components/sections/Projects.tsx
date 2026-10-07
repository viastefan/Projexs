import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Check, Plus } from "@/components/ui/Icons";

type Client = Dictionary["projects"]["clients"][number];
type Engagement = Client["engagements"][number];
type Labels = Dictionary["projects"]["labels"];

/** Wie viele Teilprojekte pro Kunde sofort sichtbar sind – der Rest klappt auf. */
const VISIBLE = 2;

function EngagementCard({ e, labels, index }: { e: Engagement; labels: Labels; index: number }) {
  return (
    <li
      data-reveal
      style={{ "--reveal-delay": index * 80 } as React.CSSProperties}
      className="rounded-[1.5rem] border border-ink/10 bg-white/80 p-7 shadow-[0_1px_0_rgb(10_15_22/0.04)] sm:p-9"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <h4 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.02em] sm:text-[1.35rem]">{e.role}</h4>
        <span className="inline-flex shrink-0 self-start rounded-full bg-paper-2 px-3 py-1 font-mono text-[0.72rem] text-stone">
          {e.period}
        </span>
      </div>
      <ul className="mt-6 space-y-3">
        {e.points.map((p) => (
          <li key={p} className="flex gap-3 leading-relaxed text-ink/80">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent-deep" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {e.result && (
        <div className="mt-7 flex gap-4 rounded-2xl bg-accent/[0.08] p-5 ring-1 ring-inset ring-accent/20">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-ink">
            <Check className="size-4" />
          </span>
          <p className="leading-relaxed">
            <span className="mr-2 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent-deep">{labels.result}</span>
            <span className="font-medium text-ink">{e.result}</span>
          </p>
        </div>
      )}
    </li>
  );
}

function ClientCase({ c, labels, index }: { c: Client; labels: Labels; index: number }) {
  const visible = c.engagements.slice(0, VISIBLE);
  const hidden = c.engagements.slice(VISIBLE);

  return (
    <article className="grid gap-10 border-t border-ink/15 py-14 sm:py-20 lg:grid-cols-12 lg:gap-16">
      <header className="self-start lg:sticky lg:top-28 lg:col-span-5 xl:col-span-4">
        <div data-reveal className="flex items-center gap-3 font-mono text-[0.72rem] text-stone">
          <span className="text-ink">{String(index + 1).padStart(2, "0")}</span>
          <span aria-hidden="true" className="h-px w-6 bg-ink/30" />
          {c.period}
        </div>
        <h3 data-reveal className="mt-5 text-[clamp(2.4rem,4.4vw,3.6rem)] font-semibold leading-[0.95] tracking-[-0.05em]">
          {c.client}
        </h3>
        <p data-reveal className="mt-3 text-stone">
          {c.industry}
        </p>
        <p data-reveal className="mt-6 font-serif text-[1.65rem] leading-[1.15] text-ink">
          {c.headline}
        </p>

        <dl data-reveal className="mt-8 space-y-3 border-t border-ink/10 pt-6 text-[0.95rem]">
          {c.release && (
            <div className="flex gap-4">
              <dt className="w-28 shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-stone">{labels.release}</dt>
              <dd className="font-medium">{c.release}</dd>
            </div>
          )}
          {c.team && (
            <div className="flex gap-4">
              <dt className="w-28 shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-stone">{labels.team}</dt>
              <dd className="font-medium">{c.team}</dd>
            </div>
          )}
          <div className="flex gap-4">
            <dt className="w-28 shrink-0 pt-1 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-stone">{labels.modules}</dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {c.modules.map((m) => (
                  <li key={m} className="rounded-md bg-ink px-2 py-1 font-mono text-[0.72rem] font-medium text-paper">
                    {m}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        {c.kpis.length > 0 && (
          <ul data-reveal className="mt-8 grid grid-cols-3 gap-2">
            {c.kpis.map((k) => (
              <li key={k.label} className="rounded-2xl bg-ink p-4 text-paper">
                <p className="text-[1.35rem] font-semibold leading-none tracking-[-0.03em] text-accent-2 sm:text-2xl">{k.value}</p>
                <p className="mt-2 text-[0.72rem] leading-snug text-mist">{k.label}</p>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="lg:col-span-7 xl:col-span-8">
        <ul className="space-y-4">
          {visible.map((e, i) => (
            <EngagementCard key={e.role} e={e} labels={labels} index={i} />
          ))}
        </ul>

        {hidden.length > 0 && (
          <details className="group mt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.5rem] border border-dashed border-ink/20 px-7 py-5 font-medium transition-colors hover:border-ink/40 hover:bg-white/50 sm:px-9">
              <span>
                <span className="group-open:hidden">{labels.showMore}</span>
                <span className="hidden group-open:inline">{labels.showLess}</span>
                <span className="ml-2 font-mono text-sm text-stone">+{hidden.length}</span>
              </span>
              <span className="grid size-9 place-items-center rounded-full bg-ink text-paper transition-transform duration-300 group-open:rotate-45">
                <Plus className="size-4" />
              </span>
            </summary>
            <ul className="mt-4 space-y-4">
              {hidden.map((e, i) => (
                <EngagementCard key={e.role} e={e} labels={labels} index={i} />
              ))}
            </ul>
          </details>
        )}

        {c.more.length > 0 && (
          <div data-reveal className="mt-8">
            <h4 className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-stone">{labels.more}</h4>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.more.map((m) => (
                <li key={m} className="rounded-full border border-ink/15 px-4 py-2 text-[0.88rem] text-ink/80">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

export function Projects({ dict }: { dict: Dictionary }) {
  const p = dict.projects;

  return (
    <section id={dict.ids.projects} className="relative bg-paper py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow={<Eyebrow index="03">{p.eyebrow}</Eyebrow>} title={p.title} intro={p.intro} />

        <div className="mt-16 lg:mt-24">
          {p.clients.map((c, i) => (
            <ClientCase key={c.client} c={c} labels={p.labels} index={i} />
          ))}
        </div>

        <div
          data-reveal
          className="mt-6 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] bg-ink p-8 text-paper sm:flex-row sm:items-center sm:p-10"
        >
          <p className="max-w-xl font-serif text-[1.6rem] leading-[1.2]">{p.note}</p>
          <Button href={`#${dict.ids.contact}`} className="shrink-0">
            {p.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
