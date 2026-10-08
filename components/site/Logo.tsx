import { cn } from "@/lib/utils";

/**
 * Wortmarke „ProjeXs“. Das X steht in der Markenfarbe Türkis.
 *
 * Es ist bewusst ein echter Buchstabe und keine Grafik: So lesen
 * Screenreader und Suchmaschinen den Namen vollständig, und der
 * sichtbare Text stimmt mit dem Namen des Links überein.
 */
export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("font-sans text-[1.35rem] font-semibold leading-none tracking-[-0.03em]", className)}>
      Proje<span className={cn("text-accent", markClassName)}>X</span>s
    </span>
  );
}
