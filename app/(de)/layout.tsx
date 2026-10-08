import "../globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SitePausedShell } from "@/components/admin-site/SitePaused";
import { SiteShell } from "@/components/site/SiteShell";
import { resolveDictionary } from "@/lib/cms/content";
import { buildLayoutMetadata } from "@/lib/metadata";
import { siteView } from "@/lib/site-status";
import { siteViewport } from "@/lib/viewport";

export const viewport = siteViewport;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await resolveDictionary("de");
  return buildLayoutMetadata(dict);
}

/*
 * Texte kommen aus dem Code plus den Änderungen aus der Admin-App. Ist die
 * Website dort pausiert, sehen Besucher nur den Hinweis mit Kontaktdaten;
 * Impressum, Datenschutz und AGB bleiben lesbar. Die Vorschau zeigt alles.
 */
export default async function Layout({ children }: { children: ReactNode }) {
  const [{ dict }, view] = await Promise.all([resolveDictionary("de"), siteView()]);
  if (!view.live && !view.preview) return <SitePausedShell dict={dict}>{children}</SitePausedShell>;
  return (
    <SiteShell dict={dict} preview={view.preview ? { live: view.live } : undefined}>
      {children}
    </SiteShell>
  );
}
