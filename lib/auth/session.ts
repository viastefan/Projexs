/**
 * Sitzungs-Cookie: `<Nutzdaten>.<Signatur>`, beide base64url. Die Signatur ist
 * ein HMAC-SHA256 über die Nutzdaten mit `ADMIN_SESSION_SECRET`.
 *
 * Nur Web Crypto — die Datei wird auch vom Proxy benutzt, der vor jeder
 * Anfrage an /admin läuft.
 */

export const SESSION_COOKIE = "projexs_admin";
export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export interface SessionPayload {
  /** Konto-ID */
  sub: string;
  /** PIN-Stand — ändert sich die PIN, gelten alte Sitzungen nicht mehr. */
  ver: number;
  exp: number;
}

export function sessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

let keyCache: { secret: string; key: Promise<CryptoKey> } | undefined;

function hmacKey(secret: string): Promise<CryptoKey> {
  if (keyCache?.secret !== secret) {
    keyCache = {
      secret,
      key: crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
        "sign",
        "verify",
      ]),
    };
  }
  return keyCache.key;
}

export async function createSessionToken(payload: Omit<SessionPayload, "exp">): Promise<string> {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET fehlt oder ist zu kurz.");
  const body = toBase64Url(encoder.encode(JSON.stringify({ ...payload, exp: Date.now() + SESSION_TTL_MS })));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function readSessionToken(token: string | undefined): Promise<SessionPayload | null> {
  const secret = sessionSecret();
  if (!secret || !token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  let valid = false;
  try {
    valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromBase64Url(signature) as BufferSource,
      encoder.encode(body),
    );
  } catch {
    return null;
  }
  if (!valid) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.ver !== "number" || payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/*
 * Vorschau-Link zum Weitergeben: zeigt die pausierte Website, ohne Anmeldung,
 * bis zum Ablaufdatum. Signiert mit demselben Schlüssel wie die Sitzung, aber
 * über einen eigenen Text — eine Sitzung lässt sich daraus nicht ableiten.
 */
const previewMessage = (exp: number) => encoder.encode(`vorschau:${exp}`);

export async function signPreview(exp: number): Promise<string | null> {
  const secret = sessionSecret();
  if (!secret) return null;
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), previewMessage(exp));
  return toBase64Url(new Uint8Array(signature));
}

export async function verifyPreview(exp: number, signature: string): Promise<boolean> {
  const secret = sessionSecret();
  if (!secret || !Number.isSafeInteger(exp) || exp < Date.now() || !signature) return false;
  try {
    return await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromBase64Url(signature) as BufferSource,
      previewMessage(exp),
    );
  } catch {
    return false;
  }
}
