import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Plus } from "@/components/ui/Icons";
import { InquiryTrigger } from "@/components/inquiry/InquiryTrigger";

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
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-6 sm:gap-6 sm:py-8">
        <div className="min-w-0">
          <p className="text-[0.9rem] text-stone">
            {c.period} · {c.industry}
          </p>
          <h3 className="mt-1 text-[1.45rem] font-semibold leading-tight sm:text-[1.8rem]">{c.client}</h3>
          <p className="mt-1 text-[1.05rem] text-ink">{c.headline}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 grid size-11 shrink-0 place-items-center rounded-md border border-line text-navy transition-transform duration-200 group-open:rotate-45 group-open:border-navy"
        >
          <Plus className="size-5" />
        </span>
      </summary>

      <div className="grid gap-8 pb-8 sm:pb-12 lg:grid-cols-12 lg:gap-12">
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
    <section id={dict.ids.projects} className="section border-t border-line bg-surface">
      <div className="container-site">
        <SectionHeading eyebrow={<Eyebrow>{p.eyebrow}</Eyebrow>} title={p.title} intro={p.intro} />

        <div className="mt-10 divide-y divide-line rounded-xl border border-line bg-white px-5 shadow-[var(--shadow-card)] sm:px-8" data-reveal>
          {p.clients.map((c, i) => (
            <ClientCase key={c.client} c={c} labels={p.labels} open={i === 0} />
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-xl bg-navy p-6 text-white sm:flex-row sm:items-center sm:p-8" data-reveal>
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-white/85">{p.note}</p>
          <InquiryTrigger href={dict.routes.contact} source="dialog" variant="light" className="w-full shrink-0 sm:w-auto">
            {p.cta}
          </InquiryTrigger>
        </div>
      </div>
    </section>
  );
}
