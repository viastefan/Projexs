export type Etag = string;

export interface JsonDoc<T> {
  data: T;
  etag: Etag;
}

export interface StoredFile {
  pathname: string;
  size: number;
  uploadedAt: Date;
}

export interface WriteOptions {
  /** Nur schreiben, wenn die Datei noch diesen Stand hat. */
  ifMatch?: Etag;
  /** Nur schreiben, wenn es die Datei noch nicht gibt. */
  createOnly?: boolean;
}

/** Privater Speicher: JSON-Dokumente, die niemand direkt abrufen kann. */
export interface PrivateBucket {
  readJson<T>(pathname: string): Promise<JsonDoc<T> | null>;
  writeJson(pathname: string, data: unknown, options?: WriteOptions): Promise<Etag>;
  list(prefix: string, options?: { limit?: number; cursor?: string }): Promise<{ files: StoredFile[]; cursor?: string }>;
  remove(pathnames: string[]): Promise<void>;
}

export class StorageConflictError extends Error {
  constructor(message = "Das Dokument wurde zwischenzeitlich geändert.") {
    super(message);
    this.name = "StorageConflictError";
  }
}

export class StorageNotConfiguredError extends Error {
  constructor() {
    super("Der Speicher ist noch nicht eingerichtet.");
    this.name = "StorageNotConfiguredError";
  }
}
