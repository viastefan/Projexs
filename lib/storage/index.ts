import { blobPrivateBucket } from "./blob";
import { storageDriver } from "./env";
import { localPrivateBucket } from "./local";
import { StorageConflictError, StorageNotConfiguredError, type PrivateBucket } from "./types";

export { isStorageConfigured, storageDriver } from "./env";
export * from "./types";

export function privateBucket(): PrivateBucket {
  switch (storageDriver()) {
    case "blob":
      return blobPrivateBucket();
    case "local":
      return localPrivateBucket();
    default:
      throw new StorageNotConfiguredError();
  }
}

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Liest ein JSON-Dokument, verändert es und schreibt es nur zurück, wenn es
 * zwischendurch niemand anderes geändert hat (ETag). Sonst: neu lesen, neu anwenden.
 */
export async function updateJson<T>(
  pathname: string,
  initial: () => T,
  mutate: (current: T) => T | Promise<T>,
  attempts = 6,
): Promise<T> {
  const bucket = privateBucket();
  for (let attempt = 1; ; attempt++) {
    const doc = await bucket.readJson<T>(pathname);
    const next = await mutate(doc ? doc.data : initial());
    try {
      await bucket.writeJson(pathname, next, doc ? { ifMatch: doc.etag } : { createOnly: true });
      return next;
    } catch (error) {
      if (!(error instanceof StorageConflictError) || attempt >= attempts) throw error;
      await pause(40 * attempt + Math.random() * 80);
    }
  }
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  const doc = await privateBucket().readJson<T>(pathname);
  return doc ? doc.data : null;
}
