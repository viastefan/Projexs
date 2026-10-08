/**
 * Welche Ablage die Admin-App benutzt.
 *
 * Ein privater Vercel-Blob-Store (Frankfurt): Anfragen, Zugänge, Einstellungen,
 * Inhalts-Overrides und Push-Abos als JSON. Nur mit Schlüssel lesbar.
 * Beim Verbinden des Stores mit dem Vercel-Projekt legt Vercel den Schlüssel
 * als `BLOB_READ_WRITE_TOKEN` an.
 *
 * `STORAGE_DRIVER=local` legt alles unter `.data/` ab — für Entwicklung und
 * Tests. Auf Vercel wird das nie automatisch gewählt: Das Dateisystem dort ist
 * flüchtig.
 */

export type StorageDriver = "blob" | "local" | "none";

export function blobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || undefined;
}

export function storageDriver(): StorageDriver {
  if (process.env.STORAGE_DRIVER === "local") return "local";
  if (blobToken()) return "blob";
  return "none";
}

export function isStorageConfigured(): boolean {
  return storageDriver() !== "none";
}
