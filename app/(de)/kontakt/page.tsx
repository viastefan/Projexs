import { de } from "@/content/de";
import { ContactPage } from "@/components/sections/ContactPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(de, "contact", {
  title: de.contactPage.metaTitle,
  description: de.contactPage.metaDescription,
});

export default function Page() {
  return <ContactPage dict={de} />;
}
