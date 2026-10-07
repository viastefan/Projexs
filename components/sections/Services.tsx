import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Services({ dict }: { dict: Dictionary }) {
  const s = dict.services;

  return (
    <section id={dict.ids.services} className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
        <SectionHeading eyebrow={<Eyebrow>{s.eyebrow}</Eyebrow>} title={s.title} intro={s.intro} />

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {s.roles.map((role) => (
            <li key={role.title} className="flex flex-col border border-line border-t-[3px] border-t-navy bg-white p-7 sm:p-8">
              <h3 className="text-[1.3rem] font-semibold leading-snug">{role.title}</h3>
              <p className="mt-4 leading-relaxed text-stone">{role.text}</p>
              <ul className="mt-6 space-y-2 border-t border-line pt-5 text-[0.98rem] text-ink">
                {role.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-accent" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <div className="mt-20">
          <h3 className="text-[1.4rem] font-semibold">{s.situationsTitle}</h3>
          <dl className="mt-8 grid gap-x-12 md:grid-cols-2">
            {s.situations.map((item) => (
              <div key={item.title} className="border-t border-line py-7">
                <dt className="text-[1.1rem] font-semibold text-navy">{item.title}</dt>
                <dd className="mt-2 leading-relaxed text-stone">{item.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
