import { de } from "@/content/de";
import { LegalPage } from "@/components/legal/LegalPage";
import { ImprintDe } from "@/components/legal/Imprint";
import { buildMetadata } from "@/lib/metadata";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";

export const metadata = buildMetadata(de, "imprint", {
  title: "Impressum",
  description: "Impressum von ProjeXs – Daniela Franzen, Projektleitung, Programmmanagement und Interim Management.",
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={buildJsonLd(de, "imprint")} />
      <LegalPage dict={de} title="Impressum">
      <ImprintDe />
    </LegalPage>
    </>
  );
}
