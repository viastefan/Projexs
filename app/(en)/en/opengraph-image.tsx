import { en } from "@/content/en";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = en.meta.ogTitle;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(en);
}
