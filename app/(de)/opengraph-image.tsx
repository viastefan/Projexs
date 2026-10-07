import { de } from "@/content/de";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = de.meta.ogTitle;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(de);
}
