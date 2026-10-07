import type { Dictionary } from "@/lib/i18n";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Plus } from "@/components/ui/Icons";

export function Faq({ dict }: { dict: Dictionary }) {
  const f = dict.faq;

  return (
    <section id={dict.ids.faq} className="relative bg-paper-2 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-[88rem] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-20 lg:px-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div data-reveal>
              <Eyebrow index="06">{f.eyebrow}</Eyebrow>
            </div>
            <h2
              data-reveal
              className="mt-6 text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.045em]"
            >
              {f.title}
            </h2>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-ink/15">
            {f.items.map((item, i) => (
              <li key={item.q} data-reveal style={{ "--reveal-delay": i * 60 } as React.CSSProperties} className="border-b border-ink/15">
                <details className="group" name="faq">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 text-left sm:py-8">
                    <span className="flex gap-5">
                      <span className="pt-1 font-mono text-xs text-stone">{String(i + 1).padStart(2, "0")}</span>
                      <span className="min-w-0 text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-accent-deep sm:text-[1.35rem]">
                        {item.q}
                      </span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-inset ring-ink/20 transition-all duration-300 group-open:rotate-45 group-open:bg-ink group-open:text-paper group-open:ring-ink">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <p className="max-w-2xl pb-8 pl-10 pr-12 text-[1.02rem] leading-relaxed text-stone">{item.a}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
