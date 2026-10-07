import { de } from "@/content/de";
import { LegalPage } from "@/components/legal/LegalPage";
import { TermsDe, termsUpdated } from "@/components/legal/Terms";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(de, "terms", {
  title: "AGB | ProjeXs – Daniela Franzen",
  description:
    "Allgemeine Geschäftsbedingungen von ProjeXs für Beratung, Projektleitung, Programmmanagement und Interim Management.",
});

export default function Page() {
  return (
    <LegalPage dict={de} title="AGB" updated={termsUpdated}>
      <TermsDe />
    </LegalPage>
  );
}
