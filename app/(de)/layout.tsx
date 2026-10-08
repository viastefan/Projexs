import "../globals.css";
import type { ReactNode } from "react";
import { de } from "@/content/de";
import { SiteShell } from "@/components/site/SiteShell";
import { siteViewport } from "@/lib/viewport";
import { buildLayoutMetadata } from "@/lib/metadata";

export const viewport = siteViewport;
export const metadata = buildLayoutMetadata(de);

export default function GermanLayout({ children }: { children: ReactNode }) {
  return <SiteShell dict={de}>{children}</SiteShell>;
}
