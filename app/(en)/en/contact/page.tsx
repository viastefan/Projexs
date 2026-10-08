import { en } from "@/content/en";
import { ContactPage } from "@/components/sections/ContactPage";
import { buildMetadata } from "@/lib/metadata";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";

export const metadata = buildMetadata(en, "contact", {
  title: "Contact",
  description: en.contactPage.metaDescription,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={buildJsonLd(en, "contact")} />
      <ContactPage dict={en} />
    </>
  );
}
