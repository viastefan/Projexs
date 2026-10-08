import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, stat } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { StorageConflictError, type PrivateBucket, type StoredFile, type WriteOptions } from "./types";

/**
 * Lokaler Ersatz für Vercel Blob — gleiche Schnittstelle, Dateien unter
 * `.data/`. Nur für Entwicklung und automatische Tests.
 */

export const LOCAL_ROOT = path.join(process.cwd(), ".data");

/** Verhindert, dass ein Pfad aus `.data/private/` herausführt. */
function localFilePath(pathname: string): string {
  const base = path.join(LOCAL_ROOT, "private");
  const resolved = path.resolve(base, pathname);
  if (!resolved.startsWith(base + path.sep)) throw new Error("Ungültiger Pfad.");
  return resolved;
}

function etagOf(content: string): string {
  return createHash("sha1").update(content).digest("hex");
}

async function writeAtomically(file: string, content: string) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomBytes(6).toString("hex")}.tmp`;
  await writeFile(tmp, content);
  await rename(tmp, file);
}

async function walk(dir: string): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : Promise.resolve(entry.name.endsWith(".tmp") ? [] : [full]);
    }),
  );
  return nested.flat();
}

export function localPrivateBucket(): PrivateBucket {
  return {
    async readJson<T>(pathname: string) {
      try {
        const content = await readFile(localFilePath(pathname), "utf8");
        return { data: JSON.parse(content) as T, etag: etagOf(content) };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },

    async writeJson(pathname, data, options: WriteOptions = {}) {
      const file = localFilePath(pathname);
      const content = JSON.stringify(data);
      let current: string | null = null;
      try {
        current = await readFile(file, "utf8");
      } catch {
        current = null;
      }
      if (options.createOnly && current !== null) throw new StorageConflictError();
      if (options.ifMatch && (current === null || etagOf(current) !== options.ifMatch)) {
        throw new StorageConflictError();
      }
      await writeAtomically(file, content);
      return etagOf(content);
    },

    async list(prefix, options = {}) {
      const base = path.join(LOCAL_ROOT, "private");
      const all = (await walk(base))
        .map((file) => path.relative(base, file).split(path.sep).join("/"))
        .filter((pathname) => pathname.startsWith(prefix))
        .sort();
      const start = options.cursor ? Number(options.cursor) : 0;
      const end = options.limit ? start + options.limit : all.length;
      const page = all.slice(start, end);
      const files: StoredFile[] = await Promise.all(
        page.map(async (pathname) => {
          const info = await stat(localFilePath(pathname));
          return { pathname, size: info.size, uploadedAt: info.mtime };
        }),
      );
      return { files, cursor: end < all.length ? String(end) : undefined };
    },

    async remove(pathnames) {
      await Promise.all(pathnames.map((pathname) => rm(localFilePath(pathname), { force: true })));
    },
  };
}
