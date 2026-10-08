import { de } from "@/content/de";
import { LegalPage } from "@/components/legal/LegalPage";
import { PrivacyDe, privacyUpdated } from "@/components/legal/Privacy";
import { buildMetadata } from "@/lib/metadata";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";

export const metadata = buildMetadata(de, "privacy", {
  title: "Datenschutz",
  description: "Datenschutzerklärung von ProjeXs: welche Daten verarbeitet werden, wofür und welche Rechte Sie haben.",
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={buildJsonLd(de, "privacy")} />
      <LegalPage dict={de} title="Datenschutz" updated={privacyUpdated.de}>
      <PrivacyDe />
    </LegalPage>
    </>
  );
}
