import { cn } from "@/lib/utils";

/**
 * Wortmarke „ProjeXs“. Das X steht in der Markenfarbe Türkis.
 *
 * Es ist bewusst ein echter Buchstabe und keine Grafik: So lesen
 * Screenreader und Suchmaschinen den Namen vollständig, und der
 * sichtbare Text stimmt mit dem Namen des Links überein.
 *
 * tone="light" für dunkle Hintergründe (weiße Wortmarke, helles Türkis).
 */
export function Logo({
  className,
  markClassName,
  tone = "dark",
}: {
  className?: string;
  markClassName?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "font-sans text-[1.4rem] font-semibold leading-none tracking-[-0.03em] transition-colors duration-300",
        tone === "light" ? "text-white" : "text-navy",
        className,
      )}
    >
      Proje<span className={cn(tone === "light" ? "text-accent-light" : "text-accent", markClassName)}>X</span>s
    </span>
  );
}
