import { en } from "@/content/en";
import { HomePage } from "@/components/HomePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata(en, "home");

export default function Page() {
  return <HomePage dict={en} />;
}
