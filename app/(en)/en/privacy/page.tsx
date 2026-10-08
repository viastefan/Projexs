import { en } from "@/content/en";
import { LegalPage } from "@/components/legal/LegalPage";
import { PrivacyEn, privacyUpdated } from "@/components/legal/Privacy";
import { buildMetadata } from "@/lib/metadata";
import { buildJsonLd, JsonLdScript } from "@/lib/jsonld";

export const metadata = buildMetadata(en, "privacy", {
  title: "Privacy policy",
  description: "Privacy policy of ProjeXs: what data is processed, why, and what rights you have.",
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={buildJsonLd(en, "privacy")} />
      <LegalPage dict={en} title="Privacy policy" updated={privacyUpdated.en}>
      <PrivacyEn />
    </LegalPage>
    </>
  );
}
