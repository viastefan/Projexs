import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";
import { ArrowRight } from "@/components/ui/Icons";

export function LegalPage({
  dict,
  title,
  updated,
  children,
}: {
  dict: Dictionary;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink pb-16 pt-36 text-paper sm:pb-20 sm:pt-44">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-[10%] -top-[40%] h-[70vh] w-[70vh] rounded-full bg-navy/50 blur-[140px]" />
          <div className="bg-grid-ink absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_20%_20%,#000,transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <Link
            href={dict.routes.home}
            className="group inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-mist transition-colors hover:text-paper"
          >
            <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            {dict.legal.backHome}
          </Link>
          <h1 className="mt-8 animate-rise text-[clamp(2.6rem,6vw,5rem)] font-semibold leading-none tracking-[-0.045em]">
            {title}
          </h1>
          {updated && (
            <p className="mt-5 font-mono text-[0.75rem] uppercase tracking-[0.16em] text-mist">
              {dict.legal.updated}: {updated}
            </p>
          )}
        </div>
      </section>
      <section className="bg-paper py-16 sm:py-24">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8 lg:px-12">
          <div className="prose-legal max-w-3xl">
            {dict.legal.germanOnly && <p className="note">{dict.legal.germanOnly}</p>}
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
