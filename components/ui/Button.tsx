import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light" | "ghost-light";

export const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-[1rem] font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 active:translate-y-px";

export const buttonVariants: Record<Variant, string> = {
  primary: "bg-navy text-white shadow-[0_8px_20px_-10px_rgba(8,32,120,0.6)] hover:bg-navy-deep",
  secondary: "border border-navy text-navy hover:bg-navy hover:text-white",
  light: "bg-white text-navy shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] hover:bg-surface",
  "ghost-light": "border border-white/35 text-white hover:border-white hover:bg-white/10",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(buttonBase, buttonVariants[variant], className)}>
      {children}
    </Link>
  );
}
