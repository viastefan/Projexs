import { en } from "@/content/en";
import { ContactPage } from "@/components/sections/ContactPage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(en, "contact", {
  title: en.contactPage.metaTitle,
  description: en.contactPage.metaDescription,
});

export default function Page() {
  return <ContactPage dict={en} />;
}
