import { cn } from "@/lib/utils";

export function Eyebrow({
  index,
  children,
  tone = "dark",
  className,
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 font-mono text-[0.72rem] font-medium uppercase tracking-[0.18em]",
        tone === "dark" ? "text-stone" : "text-mist",
        className,
      )}
    >
      <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" />
      {index && <span className={tone === "dark" ? "text-ink" : "text-paper"}>{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />}
      <span>{children}</span>
    </p>
  );
}
