import "../globals.css";
import type { ReactNode } from "react";
import { en } from "@/content/en";
import { SiteShell } from "@/components/site/SiteShell";
import { siteViewport } from "@/lib/viewport";
import { buildLayoutMetadata } from "@/lib/metadata";

export const viewport = siteViewport;
export const metadata = buildLayoutMetadata(en);

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell dict={en}>{children}</SiteShell>;
}
