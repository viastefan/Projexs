import { timingSafeEqual } from "node:crypto";
import { site } from "@/content/site";
import { readJson, updateJson } from "@/lib/storage";
import { EMAIL_RE, newId, nowIso } from "@/lib/cms/util";
import { burnTime, hashPassword, verifyPassword } from "./password";

/**
 * Zugänge der Admin-App.
 *
 * - `owner`: Daniela. `ADMIN_PIN` (Vercel) öffnet immer ihren Zugang und legt
 *   ihn beim allerersten Öffnen an; eine in der App geänderte PIN gilt zusätzlich.
 * - `editor`: weitere Zugänge (z. B. eine Assistenz oder die technische
 *   Betreuung), die Daniela in den Einstellungen anlegt — mit Name, E-Mail und
 *   eigener PIN. Sie sehen alles, können aber keine Zugänge verwalten.
 * - Jeder Zugang ändert seine PIN selbst; dabei enden nur dessen Sitzungen.
 *
 * Sechs Ziffern sind schnell durchprobiert, wenn nichts bremst. Deshalb sperrt
 * die App nach fünf falschen Eingaben, jedes weitere Mal länger (bis zu einer
 * Stunde) — für alle Geräte zusammen, gespeichert im privaten Speicher.
 */

export type Role = "owner" | "editor";

export interface Account {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** Steigt bei jeder neuen PIN: alte Sitzungen auf anderen Geräten verfallen. */
  passwordVersion: number;
  /** scrypt-Hash der PIN — nie die PIN selbst. */
  pinHash?: string;
  pinSetAt?: string;
  createdAt: string;
  lastLoginAt?: string;
}

/** Was die Oberfläche von einem Konto sehen darf — nie einen Hash. */
export type PublicAccount = Pick<Account, "id" | "email" | "name" | "role" | "createdAt" | "lastLoginAt" | "pinSetAt">;

interface AccountsDoc {
  version: 1;
  accounts: Account[];
}

const PATH = "admin/accounts.json";
const EMPTY: AccountsDoc = { version: 1, accounts: [] };

export class AccountError extends Error {}

export function toPublic(account: Account): PublicAccount {
  const { id, email, name, role, createdAt, lastLoginAt, pinSetAt } = account;
  return { id, email, name, role, createdAt, lastLoginAt, pinSetAt };
}

async function readAccounts(): Promise<Account[]> {
  return (await readJson<AccountsDoc>(PATH))?.accounts ?? [];
}

export async function listAccounts(): Promise<PublicAccount[]> {
  return (await readAccounts()).map(toPublic);
}

export async function getAccount(id: string): Promise<Account | null> {
  return (await readAccounts()).find((account) => account.id === id) ?? null;
}

async function updateAccount(id: string, change: (account: Account) => Account): Promise<Account> {
  let updated: Account | null = null;
  await updateJson<AccountsDoc>(PATH, () => EMPTY, (doc) => ({
    ...doc,
    accounts: doc.accounts.map((item) => {
      if (item.id !== id) return item;
      updated = change(item);
      return updated;
    }),
  }));
  if (!updated) throw new AccountError("Den Zugang gibt es nicht mehr.");
  return updated;
}

/* ------------------------------------------------------------------ PIN -- */

export const PIN_LENGTH = 6;
const PIN_PATTERN = new RegExp(`^\\d{${PIN_LENGTH}}$`);

export function isPinShaped(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

/** Genau sechs Ziffern, keine Reihe und nichts aus lauter gleichen Ziffern. */
export function pinProblem(pin: string): string | null {
  if (!isPinShaped(pin)) return `Die PIN hat genau ${PIN_LENGTH} Ziffern.`;
  if (/^(\d)\1+$/.test(pin)) return "Bitte keine PIN aus lauter gleichen Ziffern.";
  if ("01234567890".includes(pin) || "09876543210".includes(pin)) return "Bitte keine einfache Ziffernfolge wie 123456.";
  return null;
}

/** Die PIN aus Vercel (`ADMIN_PIN`) — gehört Daniela. */
function adminPin(): string | null {
  const pin = process.env.ADMIN_PIN?.trim() ?? "";
  return isPinShaped(pin) ? pin : null;
}

export function hasAdminPin(): boolean {
  return adminPin() !== null;
}

function sameDigits(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

interface PinGuardDoc {
  version: 1;
  failures: number;
  lockCount: number;
  lockedUntil?: string;
  lastFailureAt?: string;
}

const GUARD_PATH = "admin/pin-sperre.json";
const GUARD_EMPTY: PinGuardDoc = { version: 1, failures: 0, lockCount: 0 };
const MAX_FAILURES = 5;
const LOCK_BASE_MS = 15 * 60 * 1000;
const LOCK_MAX_MS = 60 * 60 * 1000;
/** Einzelne Vertipper verjähren: Nach einem Tag ohne Fehler zählt es von vorn. */
const FORGET_AFTER_MS = 24 * 60 * 60 * 1000;

async function pinLockedUntil(): Promise<string | null> {
  const guard = await readJson<PinGuardDoc>(GUARD_PATH);
  return guard?.lockedUntil && Date.parse(guard.lockedUntil) > Date.now() ? guard.lockedUntil : null;
}

async function recordPinFailure(): Promise<string | null> {
  let lockedUntil: string | null = null;
  await updateJson<PinGuardDoc>(GUARD_PATH, () => GUARD_EMPTY, (guard) => {
    lockedUntil = null;
    const stale = guard.lastFailureAt && Date.now() - Date.parse(guard.lastFailureAt) > FORGET_AFTER_MS;
    const base = stale ? GUARD_EMPTY : guard;
    const failures = base.failures + 1;
    if (failures < MAX_FAILURES) return { ...base, failures, lastFailureAt: nowIso() };
    const duration = Math.min(LOCK_BASE_MS * 2 ** base.lockCount, LOCK_MAX_MS);
    lockedUntil = new Date(Date.now() + duration).toISOString();
    return { version: 1, failures: 0, lockCount: base.lockCount + 1, lockedUntil, lastFailureAt: nowIso() };
  });
  return lockedUntil;
}

async function clearPinFailures(): Promise<void> {
  const guard = await readJson<PinGuardDoc>(GUARD_PATH);
  if (!guard || (guard.failures === 0 && guard.lockCount === 0)) return;
  await updateJson<PinGuardDoc>(GUARD_PATH, () => GUARD_EMPTY, () => GUARD_EMPTY);
}

/** Legt den Zugang der Inhaberin an — gibt es ihn schon, bleibt es bei dem. */
async function addOwner(pin: string): Promise<Account> {
  const now = nowIso();
  const account: Account = {
    id: newId(),
    email: site.contact.email.toLowerCase(),
    name: site.owner.name,
    role: "owner",
    passwordVersion: 1,
    pinHash: await hashPassword(pin),
    pinSetAt: now,
    createdAt: now,
  };
  let existing: Account | null = null;
  await updateJson<AccountsDoc>(PATH, () => EMPTY, (doc) => {
    existing = doc.accounts.find((item) => item.role === "owner") ?? null;
    return existing ? doc : { version: 1, accounts: [...doc.accounts, account] };
  });
  return existing ?? account;
}

async function signedIn(account: Account): Promise<Account> {
  await clearPinFailures();
  return updateAccount(account.id, (item) => ({ ...item, lastLoginAt: nowIso() }));
}

/** Ist Danielas gespeicherte PIN dieselbe wie die aus Vercel (`ADMIN_PIN`)? */
async function storesVercelPin(account: Account): Promise<boolean> {
  const pin = adminPin();
  return Boolean(pin && account.pinHash && (await verifyPassword(pin, account.pinHash)));
}

export type PinLoginResult =
  | { ok: true; account: Account }
  | { ok: false; reason: "invalid" | "locked" | "unconfigured"; lockedUntil?: string };

export async function loginWithPin(pin: string): Promise<PinLoginResult> {
  const lockedUntil = await pinLockedUntil();
  if (lockedUntil) return { ok: false, reason: "locked", lockedUntil };

  const fromVercel = adminPin();
  const accounts = await readAccounts();
  const owner = accounts.find((account) => account.role === "owner") ?? null;
  if (!accounts.some((account) => account.pinHash) && !fromVercel) return { ok: false, reason: "unconfigured" };

  if (isPinShaped(pin)) {
    // Zuerst Daniela: Die PIN aus Vercel gehört ihr und öffnet immer ihren Zugang.
    if (fromVercel && sameDigits(pin, fromVercel)) {
      return { ok: true, account: await signedIn(owner ?? (await addOwner(pin))) };
    }
    for (const account of accounts) {
      if (account.pinHash && (await verifyPassword(pin, account.pinHash))) {
        return { ok: true, account: await signedIn(account) };
      }
    }
  }

  if (!accounts.some((account) => account.pinHash)) await burnTime(pin);
  const locked = await recordPinFailure();
  return locked ? { ok: false, reason: "locked", lockedUntil: locked } : { ok: false, reason: "invalid" };
}

async function setPinHash(id: string, pin: string, signOutOthers: boolean): Promise<Account> {
  const pinHash = await hashPassword(pin);
  return updateAccount(id, (item) => ({
    ...item,
    pinHash,
    pinSetAt: nowIso(),
    passwordVersion: signOutOthers ? item.passwordVersion + 1 : item.passwordVersion,
  }));
}

/** Öffnet die PIN diesen Zugang? Danielas: die PIN aus Vercel oder ihre eigene. Andere: nur ihre eigene. */
async function opensAccount(account: Account, pin: string): Promise<boolean> {
  if (!isPinShaped(pin)) return false;
  const fromVercel = adminPin();
  if (account.role === "owner" && fromVercel && sameDigits(pin, fromVercel)) return true;
  return Boolean(account.pinHash) && (await verifyPassword(pin, account.pinHash!));
}

/** Öffnet die PIN schon einen anderen Zugang? Dann ließen sich die beiden nicht mehr auseinanderhalten. */
async function pinOfOtherAccount(pin: string, exceptId: string | null): Promise<boolean> {
  const fromVercel = adminPin();
  const owner = (await readAccounts()).find((account) => account.role === "owner");
  if (fromVercel && sameDigits(pin, fromVercel) && owner?.id !== exceptId) return true;
  for (const other of await readAccounts()) {
    if (other.id !== exceptId && (await opensAccount(other, pin))) return true;
  }
  return false;
}

const PIN_TAKEN = "Diese PIN ist schon vergeben. Bitte eine andere wählen.";

/**
 * Eigene PIN ändern: jeder Zugang bestätigt mit seiner bisherigen. Abgemeldet
 * werden nur die anderen Geräte dieses Zugangs.
 */
export async function changePin(id: string, input: { current: string; next: string }): Promise<Account> {
  const account = await getAccount(id);
  if (!account) throw new AccountError("Den Zugang gibt es nicht mehr.");
  const lockedUntil = await pinLockedUntil();
  if (lockedUntil) throw new AccountError("Zu viele falsche Eingaben. Bitte später noch einmal versuchen.");
  if (!(await opensAccount(account, input.current))) {
    await recordPinFailure();
    throw new AccountError("Die bisherige PIN stimmt nicht.");
  }
  const problem = pinProblem(input.next);
  if (problem) throw new AccountError(problem);
  if (account.pinHash && (await verifyPassword(input.next, account.pinHash))) {
    throw new AccountError("Die neue PIN muss sich von der bisherigen unterscheiden.");
  }
  if (await pinOfOtherAccount(input.next, account.id)) throw new AccountError(PIN_TAKEN);
  return setPinHash(id, input.next, true);
}

/** Eigene Stammdaten des Zugangs (Name, E-Mail). */
export async function updateProfile(id: string, input: { name: string; email: string }): Promise<Account> {
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().toLowerCase().slice(0, 160);
  if (!name) throw new AccountError("Bitte einen Namen angeben.");
  if (!EMAIL_RE.test(email)) throw new AccountError("Bitte eine gültige E-Mail-Adresse angeben.");
  return updateAccount(id, (item) => ({ ...item, name, email }));
}

/** Weiteren Zugang anlegen — nur die Inhaberin. */
export async function addEditor(input: { name: string; email: string; pin: string }): Promise<Account> {
  const name = input.name.trim().slice(0, 80);
  const email = input.email.trim().toLowerCase().slice(0, 160);
  if (!name) throw new AccountError("Bitte einen Namen angeben.");
  if (!EMAIL_RE.test(email)) throw new AccountError("Bitte eine gültige E-Mail-Adresse angeben.");
  const problem = pinProblem(input.pin);
  if (problem) throw new AccountError(problem);
  if (await pinOfOtherAccount(input.pin, null)) throw new AccountError(PIN_TAKEN);
  if ((await readAccounts()).some((account) => account.email === email)) {
    throw new AccountError("Mit dieser E-Mail-Adresse gibt es schon einen Zugang.");
  }
  const now = nowIso();
  const account: Account = {
    id: newId(),
    email,
    name,
    role: "editor",
    passwordVersion: 1,
    pinHash: await hashPassword(input.pin),
    pinSetAt: now,
    createdAt: now,
  };
  await updateJson<AccountsDoc>(PATH, () => EMPTY, (doc) => ({ version: 1, accounts: [...doc.accounts, account] }));
  return account;
}

/** Zugang entfernen — nie den der Inhaberin. */
export async function removeAccount(id: string): Promise<void> {
  await updateJson<AccountsDoc>(PATH, () => EMPTY, (doc) => ({
    version: 1,
    accounts: doc.accounts.filter((account) => account.id !== id || account.role === "owner"),
  }));
}

export interface OwnerAccess {
  name: string;
  firstName: string;
  /** Daniela hat in der App eine eigene PIN, die nicht die aus Vercel ist. */
  ownPin: boolean;
  pinSetAt?: string;
  lastLoginAt?: string;
  /** `ADMIN_PIN` in Vercel ist gültig und öffnet ihren Zugang. */
  vercelPin: boolean;
}

/** Wie Daniela gerade in ihren Zugang kommt. */
export async function ownerAccess(): Promise<OwnerAccess> {
  const owner = (await readAccounts()).find((account) => account.role === "owner") ?? null;
  const ownPin = Boolean(owner?.pinHash) && !(await storesVercelPin(owner!));
  const name = owner?.name ?? site.owner.name;
  return {
    name,
    firstName: name.split(" ")[0],
    ownPin,
    pinSetAt: ownPin ? owner?.pinSetAt : undefined,
    lastLoginAt: owner?.lastLoginAt,
    vercelPin: adminPin() !== null,
  };
}
