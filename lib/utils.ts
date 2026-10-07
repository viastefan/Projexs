/** Verbindet CSS-Klassen und filtert leere Werte heraus. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Absolute URL auf Basis der konfigurierten Website-Adresse. */
export function absoluteUrl(path: string, base: string) {
  return new URL(path, base).toString();
}
