import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "light" | "dark" | "ghost-light" | "ghost-dark";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink hover:bg-accent-2 shadow-[0_10px_30px_-10px_rgb(10_165_192/0.55)] hover:shadow-[0_16px_40px_-12px_rgb(10_165_192/0.75)]",
  light: "bg-paper text-ink hover:bg-white",
  dark: "bg-ink text-paper hover:bg-ink-3",
  "ghost-light": "text-paper ring-1 ring-inset ring-white/20 hover:ring-white/50 hover:bg-white/5",
  "ghost-dark": "text-ink ring-1 ring-inset ring-ink/15 hover:ring-ink/40 hover:bg-ink/[0.03]",
};

export function Button({
  href,
  children,
  variant = "primary",
  arrow = true,
  className,
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "group inline-flex h-12 items-center justify-center gap-3 rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-all duration-300 ease-out",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="size-[18px] transition-transform duration-300 ease-out group-hover:translate-x-1" />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
