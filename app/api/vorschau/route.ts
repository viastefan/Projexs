import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPreview } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Vorschau-Link zum Weitergeben (`?bis=…&sig=…`) und „Vorschau beenden“
 * (`?ende=1`). Ein abgelaufener Link führt einfach auf die Website.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const draft = await draftMode();
  if (searchParams.get("ende") === "1") {
    draft.disable();
    redirect("/");
  }
  if (await verifyPreview(Number(searchParams.get("bis")), searchParams.get("sig") ?? "")) draft.enable();
  redirect("/");
}
