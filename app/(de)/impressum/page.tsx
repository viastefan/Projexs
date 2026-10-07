import { de } from "@/content/de";
import { LegalPage } from "@/components/legal/LegalPage";
import { ImprintDe } from "@/components/legal/Imprint";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(de, "imprint", {
  title: "Impressum | ProjeXs – Daniela Franzen",
  description: "Impressum von ProjeXs – Daniela Franzen, Projektleitung, Programmmanagement und Interim Management.",
});

export default function Page() {
  return (
    <LegalPage dict={de} title="Impressum">
      <ImprintDe />
    </LegalPage>
  );
}
