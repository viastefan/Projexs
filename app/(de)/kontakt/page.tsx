import { de } from "@/content/de";
import { ContactPage } from "@/components/sections/ContactPage";
import { buildMetadata } from "@/lib/metadata";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";

export const metadata = buildMetadata(de, "contact", {
  title: "Kontakt",
  description: de.contactPage.metaDescription,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={buildJsonLd(de, "contact")} />
      <ContactPage dict={de} />
    </>
  );
}
