import { de } from "@/content/de";
import { LegalPage } from "@/components/legal/LegalPage";
import { PrivacyDe, privacyUpdated } from "@/components/legal/Privacy";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(de, "privacy", {
  title: "Datenschutz | ProjeXs – Daniela Franzen",
  description: "Datenschutzerklärung von ProjeXs: welche Daten verarbeitet werden, wofür und welche Rechte Sie haben.",
});

export default function Page() {
  return (
    <LegalPage dict={de} title="Datenschutz" updated={privacyUpdated.de}>
      <PrivacyDe />
    </LegalPage>
  );
}
