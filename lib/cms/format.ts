const TZ = "Europe/Berlin";

export function formatDate(iso: string, withTime = false): string {
  return new Date(iso).toLocaleString("de-DE", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export function formatShortDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toLocaleDateString("de-DE", { timeZone: TZ }) === now.toLocaleDateString("de-DE", { timeZone: TZ });
  if (sameDay) return date.toLocaleTimeString("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }) + " Uhr";
  return date.toLocaleDateString("de-DE", { timeZone: TZ, day: "numeric", month: "short" });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - Date.parse(iso);
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  return days === 1 ? "gestern" : `vor ${days} Tagen`;
}

export function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "numeric", hourCycle: "h23" })
      .formatToParts(new Date())
      .find((part) => part.type === "hour")?.value ?? 12,
  );
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export function todayLabel(): string {
  return new Date().toLocaleDateString("de-DE", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
}
