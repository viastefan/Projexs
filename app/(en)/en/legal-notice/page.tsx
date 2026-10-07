import { en } from "@/content/en";
import { LegalPage } from "@/components/legal/LegalPage";
import { ImprintEn } from "@/components/legal/Imprint";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(en, "imprint", {
  title: "Legal notice | ProjeXs – Daniela Franzen",
  description: "Legal notice of ProjeXs – Daniela Franzen, project leadership, programme and interim management.",
});

export default function Page() {
  return (
    <LegalPage dict={en} title="Legal notice">
      <ImprintEn />
    </LegalPage>
  );
}
