/**
 * Verhindert unschöne Zeilenumbrüche an Bindestrichen bei Begriffen wie
 * „Go-live-Moment“ in großen Überschriften.
 */
export function nowrapTerms(text: string, pattern: RegExp = /(go-live[\p{L}-]*)/iu) {
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
