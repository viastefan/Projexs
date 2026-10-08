"use client";

import { usePathname } from "next/navigation";
import { InstallPrompt } from "@/components/install-prompt";

/** Das Installations-Pop-up, eingestellt für die ProjeXs Admin-App. */
export function AppInstallPrompt() {
  const pathname = usePathname();
  // Innerhalb der App sitzt unten die Tab-Leiste — das Banner schwebt darüber.
  const inApp = !pathname.startsWith("/admin/anmelden");
  return (
    <InstallPrompt
      appName="ProjeXs Admin"
      appIcon="/app-icons/projexs-512.png"
      tagline="Anfragen und Website-Texte immer dabei — direkt vom Home-Bildschirm, ohne App Store."
      features={["Startet wie eine App", "Push bei neuen Anfragen", "Immer aktuell"]}
      startPath="/admin"
      accent="#082078"
      storageKey="projexs-admin-install"
      bannerBottom={inApp ? "calc(max(0.75rem, env(safe-area-inset-bottom, 0px)) + 4.625rem)" : undefined}
    />
  );
}
