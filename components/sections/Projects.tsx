import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Plus } from "@/components/ui/Icons";

type Client = Dictionary["projects"]["clients"][number];
type Engagement = Client["engagements"][number];
type Labels = Dictionary["projects"]["labels"];

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
        <p className="mt-4 rounded-md border-l-[3px] border-accent bg-surface px-4 py-3 text-ink">
          <span className="font-semibold text-navy">{labels.result}: </span>
          {e.result}
        </p>
      )}
    </li>
  );
}

/** Ein Kunde als aufklappbarer Eintrag – der erste ist geöffnet. */
function ClientCase({ c, labels, open }: { c: Client; labels: Labels; open: boolean }) {
  const facts: Array<[string, string | undefined]> = [
    [labels.period, c.period],
    [labels.industry, c.industry],
    [labels.release, c.release],
    [labels.team, c.team],
  ];

  return (
    <details name="projekte" open={open} className="group">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 sm:py-8">
        <div className="min-w-0">
          <p className="text-[0.9rem] text-stone">
            {c.period} · {c.industry}
          </p>
          <h3 className="mt-1 text-[1.6rem] font-semibold leading-tight sm:text-[1.8rem]">{c.client}</h3>
          <p className="mt-1 text-[1.05rem] text-ink">{c.headline}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-md border border-line text-navy transition-transform duration-200 group-open:rotate-45 group-open:border-navy"
        >
          <Plus className="size-5" />
        </span>
      </summary>

      <div className="grid gap-10 pb-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <dl className="divide-y divide-line border-y border-line text-[0.98rem]">
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
          {c.kpis.length > 0 && (
            <ul className="mt-6 grid grid-cols-3 gap-2">
              {c.kpis.map((k) => (
                <li key={k.label} className="min-w-0 rounded-md bg-navy p-3.5 text-white">
                  <p className="text-[1.15rem] font-semibold leading-none sm:text-[1.3rem]">{k.value}</p>
                  <p className="mt-1.5 text-[0.72rem] leading-snug text-mist [overflow-wrap:anywhere]">{k.label}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-8">
          <ul>
            {c.engagements.map((e) => (
              <Station key={e.role} e={e} labels={labels} />
            ))}
          </ul>
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
      </div>
    </details>
  );
}

export function Projects({ dict }: { dict: Dictionary }) {
  const p = dict.projects;

  return (
    <section id={dict.ids.projects} className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <SectionHeading eyebrow={<Eyebrow>{p.eyebrow}</Eyebrow>} title={p.title} intro={p.intro} />

        <div className="mt-12 divide-y divide-line border-y border-line">
          {p.clients.map((c, i) => (
            <ClientCase key={c.client} c={c} labels={p.labels} open={i === 0} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-6 rounded-lg border border-line bg-surface p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink">{p.note}</p>
          <Button href={dict.routes.contact} variant="secondary" className="shrink-0">
            {p.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
