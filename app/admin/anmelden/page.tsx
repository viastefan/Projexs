import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { getCurrentAccount, isAdminConfigured } from "@/lib/auth/server";
import { AuthFrame } from "../AuthFrame";
import { SetupNeeded } from "../SetupNeeded";
import { LoginFlow } from "./LoginFlow";

export const metadata: Metadata = { title: "Anmelden" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ weiter?: string }> }) {
  const { weiter } = await searchParams;

  /* Ohne Speicher und Sitzungsschlüssel kann sich niemand anmelden. */
  if (!isAdminConfigured()) return <SetupNeeded />;
  if (await getCurrentAccount()) redirect("/admin");

  return (
    <AuthFrame layout="pin" installPrompt title="PIN eingeben" lead={`Zugang zur Admin-App von ${site.owner.name}.`}>
      <LoginFlow next={weiter ?? "/admin"} />
    </AuthFrame>
  );
}
