import type { Metadata } from "next";
import { PausedNotice } from "@/components/admin-site/SitePaused";
import { ContactPage } from "@/components/sections/ContactPage";
import { resolveDictionary } from "@/lib/cms/content";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { sitePaused } from "@/lib/site-status";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await resolveDictionary("en");
  return buildMetadata(dict, "contact", { title: "Contact", description: dict.contactPage.metaDescription });
}

export default async function Page() {
  const { dict } = await resolveDictionary("en");
  if (await sitePaused()) return <PausedNotice dict={dict} />;
  return (
    <>
      <JsonLdScript data={buildJsonLd(dict, "contact")} />
      <ContactPage dict={dict} />
    </>
  );
}
