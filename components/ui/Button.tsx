import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "light";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-navy-deep",
  secondary: "border border-navy text-navy hover:bg-navy hover:text-white",
  light: "bg-white text-navy hover:bg-surface",
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
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-md px-6 text-[1rem] font-semibold transition-colors duration-200",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
