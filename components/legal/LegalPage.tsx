import Link from "next/link";
import type { ReactNode } from "react";
import type { Dictionary } from "@/lib/i18n";

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
      <section className="border-b border-line bg-surface pb-12 pt-16 sm:pt-20">
        <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
          <Link href={dict.routes.home} className="text-[0.95rem] font-semibold text-navy underline underline-offset-4">
            ← {dict.legal.backHome}
          </Link>
          <h1 className="mt-6 text-[clamp(2.1rem,4vw,3rem)] font-semibold leading-tight">{title}</h1>
          {updated && (
            <p className="mt-3 text-[0.95rem] text-stone">
              {dict.legal.updated}: {updated}
            </p>
          )}
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-[80rem] px-5 sm:px-8">
          <div className="prose-legal max-w-3xl">
            {dict.legal.germanOnly && <p className="note">{dict.legal.germanOnly}</p>}
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
