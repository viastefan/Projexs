import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Passwörter werden nie gespeichert, nur ein scrypt-Hash davon. Die
 * Parameter stehen im Hash selbst, damit sie sich später erhöhen lassen,
 * ohne bestehende Zugänge ungültig zu machen.
 */

const COST = 15; // N = 2^15
const BLOCK = 8;
const PARALLEL = 1;
const KEY_LENGTH = 32;
const MAX_MEMORY = 64 * 1024 * 1024;

export const MIN_PASSWORD_LENGTH = 10;

function derive(password: string, salt: Buffer, cost: number, block: number, parallel: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize("NFC"),
      salt,
      KEY_LENGTH,
      { N: 2 ** cost, r: block, p: parallel, maxmem: MAX_MEMORY },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, COST, BLOCK, PARALLEL);
  return ["scrypt", COST, BLOCK, PARALLEL, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, cost, block, parallel, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"), Number(cost), Number(block), Number(parallel));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Damit eine unbekannte E-Mail-Adresse genauso lange braucht wie eine bekannte. */
let dummyHash: Promise<string> | undefined;
export function burnTime(password: string): Promise<boolean> {
  dummyHash ??= hashPassword("kein-echtes-passwort");
  return dummyHash.then((hash) => verifyPassword(password, hash)).then(() => false);
}

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Das Passwort braucht mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`;
  }
  if (password.length > 200) return "Das Passwort ist zu lang.";
  if (/^(.)\1+$/.test(password)) return "Bitte kein Passwort aus einem einzigen Zeichen.";
  return null;
}
