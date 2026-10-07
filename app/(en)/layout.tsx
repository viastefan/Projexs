import "../globals.css";
import type { ReactNode } from "react";
import { en } from "@/content/en";
import { SiteShell } from "@/components/site/SiteShell";
import { siteViewport } from "@/lib/viewport";

export const viewport = siteViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell dict={en}>{children}</SiteShell>;
}
