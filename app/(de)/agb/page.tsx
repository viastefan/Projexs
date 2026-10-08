import { de } from "@/content/de";
import { LegalPage } from "@/components/legal/LegalPage";
import { TermsDe, termsUpdated } from "@/components/legal/Terms";
import { buildMetadata } from "@/lib/metadata";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";

export const metadata = buildMetadata(de, "terms", {
  title: "AGB",
  description:
    "Allgemeine Geschäftsbedingungen von ProjeXs für Beratung, Projektleitung, Programmmanagement und Interim Management.",
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={buildJsonLd(de, "terms")} />
      <LegalPage dict={de} title="AGB" updated={termsUpdated}>
      <TermsDe />
    </LegalPage>
    </>
  );
}
