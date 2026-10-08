import { BlobError, BlobNotFoundError, BlobPreconditionFailedError, del, get, head, list, put } from "@vercel/blob";
import { blobToken } from "./env";
import { StorageConflictError, type PrivateBucket, type WriteOptions } from "./types";

function requireToken(): string {
  const token = blobToken();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN fehlt.");
  return token;
}

function isOverwriteConflict(error: unknown): boolean {
  return error instanceof BlobError && /exist|overwrite/i.test(error.message);
}

/** ETags ohne Rücksicht auf die Schreibweise vergleichen (W/-Präfix, Anführungszeichen). */
function sameEtag(a: string, b: string): boolean {
  const bare = (value: string) => value.trim().replace(/^W\//i, "").replace(/^"(.*)"$/, "$1");
  return bare(a) !== "" && bare(a) === bare(b);
}

async function headOrNull(pathname: string, token: string) {
  try {
    return await head(pathname, { token });
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

export function blobPrivateBucket(): PrivateBucket {
  return {
    async readJson<T>(pathname: string) {
      // Den Stand (ETag) fürs bedingte Schreiben liefert head() — genau so,
      // wie put() ihn bei ifMatch erwartet. Der ETag der Download-Antwort
      // taugt dafür nicht: Größere Dokumente liefert das CDN komprimiert aus,
      // dann heißt er „W/…“ und passt nie.
      const token = requireToken();
      for (let attempt = 1; attempt <= 3; attempt++) {
        const before = await headOrNull(pathname, token);
        if (!before) return null;
        // useCache: false liest am CDN vorbei direkt aus dem Speicher — sonst
        // sähe die App ihre eigenen Änderungen erst nach einer Minute.
        const result = await get(pathname, { access: "private", token, useCache: false });
        if (!result || result.statusCode !== 200) return null;
        const data = JSON.parse(await new Response(result.stream).text()) as T;
        if (sameEtag(result.blob.etag, before.etag)) return { data, etag: before.etag };
        const after = await headOrNull(pathname, token);
        if (after && after.etag === before.etag) return { data, etag: before.etag };
      }
      throw new StorageConflictError();
    },

    async writeJson(pathname, data, options: WriteOptions = {}) {
      try {
        const result = await put(pathname, JSON.stringify(data), {
          access: "private",
          token: requireToken(),
          contentType: "application/json; charset=utf-8",
          addRandomSuffix: false,
          allowOverwrite: !options.createOnly,
          ifMatch: options.ifMatch,
          cacheControlMaxAge: 60,
        });
        return result.etag;
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError) throw new StorageConflictError();
        if (options.createOnly && isOverwriteConflict(error)) throw new StorageConflictError();
        throw error;
      }
    },

    async list(prefix, options = {}) {
      const result = await list({ prefix, token: requireToken(), limit: options.limit, cursor: options.cursor });
      return {
        files: result.blobs.map((blob) => ({
          pathname: blob.pathname,
          size: blob.size,
          uploadedAt: new Date(blob.uploadedAt),
        })),
        cursor: result.hasMore ? result.cursor : undefined,
      };
    },

    async remove(pathnames) {
      if (pathnames.length === 0) return;
      await del(pathnames, { token: requireToken() });
    },
  };
}
