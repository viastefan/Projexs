import { de } from "@/content/de";
import { HomePage } from "@/components/HomePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(de, "home");

export default function Page() {
  return <HomePage dict={de} />;
}
