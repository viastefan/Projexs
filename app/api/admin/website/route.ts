import { getCurrentAccount } from "@/lib/auth/server";
import { setSiteLive } from "@/lib/cms/site-release";

export const dynamic = "force-dynamic";

/**
 * Website veröffentlichen (`{ live: true }`) oder pausieren — aus der Admin-App
 * und aus der Vorschau-Leiste. Nur angemeldet und nur von der eigenen Seite aus.
 */
export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account) return Response.json({ error: "Bitte in der Admin-App anmelden." }, { status: 401 });

  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) {
    return Response.json({ error: "Nicht erlaubt." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { live?: unknown } | null;
  if (typeof body?.live !== "boolean") return Response.json({ error: "Ungültige Anfrage." }, { status: 400 });

  await setSiteLive(body.live, account.name);
  return Response.json({ ok: true, live: body.live });
}
