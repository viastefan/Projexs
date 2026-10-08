import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isStorageConfigured } from "@/lib/storage";
import { getAccount, type Account } from "./accounts";
import { createSessionToken, readSessionToken, SESSION_COOKIE, SESSION_TTL_MS, sessionSecret } from "./session";

export function isAdminConfigured(): boolean {
  return Boolean(sessionSecret()) && isStorageConfigured();
}

/** Die aktuelle Sitzung samt Konto — einmal pro Anfrage aus dem Speicher gelesen. */
export const getCurrentAccount = cache(async (): Promise<Account | null> => {
  if (!isAdminConfigured()) return null;
  const store = await cookies();
  const session = await readSessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const account = await getAccount(session.sub);
  // PIN geändert oder Konto entfernt: alte Sitzung ungültig.
  if (!account || account.passwordVersion !== session.ver) return null;
  return account;
});

/**
 * Jede Seite und jede Aktion der App ruft das auf. Der Proxy prüft vorher
 * nur die Signatur des Cookies; hier wird zusätzlich gegen das Konto geprüft.
 */
export async function requireAccount(): Promise<Account> {
  const account = await getCurrentAccount();
  if (!account) redirect("/admin/anmelden");
  return account;
}

/** Nur die Inhaberin darf Zugänge verwalten. */
export async function requireOwner(): Promise<Account> {
  const account = await requireAccount();
  if (account.role !== "owner") redirect("/admin/einstellungen");
  return account;
}

export async function startSession(account: Account): Promise<void> {
  const token = await createSessionToken({ sub: account.id, ver: account.passwordVersion });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
