import "../globals.css";
import type { ReactNode } from "react";
import { de } from "@/content/de";
import { SiteShell } from "@/components/site/SiteShell";
import { siteViewport } from "@/lib/viewport";

export const viewport = siteViewport;

export default function GermanLayout({ children }: { children: ReactNode }) {
  return <SiteShell dict={de}>{children}</SiteShell>;
}
