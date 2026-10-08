import type { Metadata } from "next";
import { PausedNotice } from "@/components/admin-site/SitePaused";
import { HomePage } from "@/components/HomePage";
import { resolveDictionary } from "@/lib/cms/content";
import { buildMetadata } from "@/lib/metadata";
import { sitePaused } from "@/lib/site-status";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await resolveDictionary("en");
  return buildMetadata(dict, "home");
}

export default async function Page() {
  const { dict } = await resolveDictionary("en");
  if (await sitePaused()) return <PausedNotice dict={dict} />;
  return <HomePage dict={dict} />;
}
