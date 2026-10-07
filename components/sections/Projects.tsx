import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

type Client = Dictionary["projects"]["clients"][number];
type Engagement = Client["engagements"][number];
type Labels = Dictionary["projects"]["labels"];

/** Wie viele Stationen pro Kunde sofort sichtbar sind – der Rest steht darunter als Aufklapp-Bereich. */
const VISIBLE = 2;

function Station({ e, labels }: { e: Engagement; labels: Labels }) {
  return (
    <li className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <h4 className="text-[1.1rem] font-semibold leading-snug">{e.role}</h4>
        <p className="shrink-0 text-[0.95rem] text-stone">{e.period}</p>
      </div>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink">
        {e.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {e.result && (
        <p className="mt-4 border-l-[3px] border-accent bg-surface px-4 py-3 text-ink">
          <span className="font-semibold text-navy">{labels.result}: </span>
          {e.result}
        </p>
      )}
    </li>
  );
}

function ClientCase({ c, labels }: { c: Client; labels: Labels }) {
  const visible = c.engagements.slice(0, VISIBLE);
  const hidden = c.engagements.slice(VISIBLE);

  const facts: Array<[string, string | undefined]> = [
    [labels.period, c.period],
    [labels.industry, c.industry],
    [labels.release, c.release],
    [labels.team, c.team],
  ];

  return (
    <article className="border-t border-line py-14 lg:grid lg:grid-cols-12 lg:gap-12">
      <header className="lg:col-span-4">
        <h3 className="text-[1.75rem] font-semibold leading-tight">{c.client}</h3>
        <p className="mt-3 text-[1.1rem] font-semibold leading-snug text-ink">{c.headline}</p>

        <dl className="mt-6 divide-y divide-line border-y border-line text-[0.98rem]">
          {facts
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-3">
                <dt className="text-stone">{k}</dt>
                <dd className="font-semibold text-ink">{v}</dd>
              </div>
            ))}
          {c.modules.length > 0 && (
            <div className="grid grid-cols-[7.5rem_1fr] gap-3 py-3">
              <dt className="text-stone">{labels.modules}</dt>
              <dd className="text-ink">{c.modules.join(", ")}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mt-10 lg:col-span-8 lg:mt-0">
        <ul>
          {visible.map((e) => (
            <Station key={e.role} e={e} labels={labels} />
          ))}
        </ul>

        {hidden.length > 0 && (
          <details className="group mt-6 border-t border-line pt-6">
            <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-navy hover:underline underline-offset-4">
              <span className="group-open:hidden">
                {labels.showMore} ({hidden.length})
              </span>
              <span className="hidden group-open:inline">{labels.showLess}</span>
            </summary>
            <ul className="mt-6">
              {hidden.map((e) => (
                <Station key={e.role} e={e} labels={labels} />
              ))}
            </ul>
          </details>
        )}

        {c.more.length > 0 && (
          <div className="mt-8 border-t border-line pt-6">
            <h4 className="font-semibold text-navy">{labels.more}</h4>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink">
              {c.more.map((m) => (
                <li key={m}>{m}</li>
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
    <section id={dict.ids.projects} className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <SectionHeading eyebrow={<Eyebrow>{p.eyebrow}</Eyebrow>} title={p.title} intro={p.intro} />

        <div className="mt-6">
          {p.clients.map((c) => (
            <ClientCase key={c.client} c={c} labels={p.labels} />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-6 border border-line bg-surface p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink">{p.note}</p>
          <Button href={`#${dict.ids.contact}`} variant="secondary" className="shrink-0">
            {p.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
