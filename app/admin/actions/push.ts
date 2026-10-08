"use server";

import { revalidatePath } from "next/cache";
import { requireAccount } from "@/lib/auth/server";
import {
  findSubscription,
  listSubscriptions,
  PushError,
  removeSubscriptionById,
  saveSubscription,
  sendPush,
  type BrowserSubscription,
} from "@/lib/push";
import type { ActionState } from "./state";

type DeviceInput = BrowserSubscription & { device: string };

/** Was aus dem Browser kommt, ist ungeprüft — nur die erwarteten Felder übernehmen. */
function readDevice(input: unknown): DeviceInput | null {
  if (!input || typeof input !== "object") return null;
  const { endpoint, keys, device } = input as Record<string, unknown>;
  if (typeof endpoint !== "string" || !keys || typeof keys !== "object") return null;
  const { p256dh, auth } = keys as Record<string, unknown>;
  if (typeof p256dh !== "string" || typeof auth !== "string") return null;
  return { endpoint, keys: { p256dh, auth }, device: typeof device === "string" ? device : "" };
}

export async function enablePushAction(input: unknown): Promise<ActionState> {
  const account = await requireAccount();
  const device = readDevice(input);
  if (!device) return { status: "error", message: "Das Abo des Browsers ist unvollständig." };
  try {
    await saveSubscription(device, account.id);
  } catch (error) {
    if (error instanceof PushError) return { status: "error", message: error.message };
    throw error;
  }
  revalidatePath("/admin/einstellungen");
  return { status: "ok", message: "Push ist auf diesem Gerät eingeschaltet." };
}

export async function disablePushAction(endpoint: unknown): Promise<ActionState> {
  const account = await requireAccount();
  if (typeof endpoint === "string") {
    const subscription = await findSubscription(endpoint);
    if (subscription && subscription.accountId === account.id) await removeSubscriptionById(subscription.id);
  }
  revalidatePath("/admin/einstellungen");
  return { status: "ok", message: "Push ist auf diesem Gerät ausgeschaltet." };
}

/** Ein anderes eigenes Gerät abmelden, z. B. ein altes Handy. */
export async function removePushDeviceAction(id: unknown): Promise<ActionState> {
  const account = await requireAccount();
  const subscription = (await listSubscriptions()).find((item) => item.id === id);
  if (!subscription || subscription.accountId !== account.id) {
    return { status: "error", message: "Dieses Gerät ist nicht (mehr) eingetragen." };
  }
  await removeSubscriptionById(subscription.id);
  revalidatePath("/admin/einstellungen");
  return { status: "ok", message: `${subscription.device} bekommt keine Benachrichtigungen mehr.` };
}

export async function testPushAction(): Promise<ActionState> {
  const account = await requireAccount();
  const result = await sendPush(
    {
      title: "Test aus der Admin-App",
      body: "So sieht die Benachrichtigung bei einer neuen Anfrage aus.",
      url: "/admin/einstellungen#push",
      tag: "test",
    },
    (subscription) => subscription.accountId === account.id,
  );
  if (result.removed > 0) revalidatePath("/admin/einstellungen");
  if (result.sent === 0 && result.failed === 0) {
    return { status: "error", message: "Auf keinem Gerät dieses Zugangs ist Push eingeschaltet." };
  }
  if (result.failed > 0) {
    return {
      status: "error",
      message: `An ${result.failed} ${result.failed === 1 ? "Gerät" : "Geräte"} ließ sich nichts senden. Bitte Push dort aus- und wieder einschalten.`,
    };
  }
  return {
    status: "ok",
    message: `Gesendet an ${result.sent} ${result.sent === 1 ? "Gerät" : "Geräte"}. Die Nachricht kommt meist innerhalb weniger Sekunden.`,
  };
}

/**
 * Abgleich beim Öffnen der App: Hat der Browser sein Abo erneuert, wird das
 * neue eingetragen und das alte entfernt.
 */
export async function syncPushAction(input: unknown, previousEndpoint: unknown): Promise<void> {
  const account = await requireAccount();
  const device = readDevice(input);
  if (!device) return;
  try {
    await saveSubscription(device, account.id);
  } catch (error) {
    if (error instanceof PushError) return;
    throw error;
  }
  if (typeof previousEndpoint === "string" && previousEndpoint !== device.endpoint) {
    const previous = await findSubscription(previousEndpoint);
    if (previous && previous.accountId === account.id) await removeSubscriptionById(previous.id);
  }
}
