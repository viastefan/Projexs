import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

/** Erzeugt das Social-Media-Vorschaubild (Open Graph) im schlichten Markendesign. */
export async function renderOgImage(dict: Dictionary) {
  const root = process.cwd();
  const [regular, semibold, photo] = await Promise.all([
    readFile(join(root, "assets/fonts/SourceSans3-400.ttf")),
    readFile(join(root, "assets/fonts/SourceSans3-600.ttf")),
    readFile(join(root, "public", site.images.portrait)),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", position: "relative" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={440}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, width: 440, height: 630, objectFit: "cover" }}
        />
        <div style={{ position: "absolute", left: 0, top: 0, width: 16, height: 630, background: "#082078" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px 72px 80px",
            width: 740,
          }}
        >
          <div style={{ display: "flex", fontFamily: "Source Sans 3", fontWeight: 600, fontSize: 34, color: "#082078" }}>
            ProjeXs
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontFamily: "Source Sans 3",
                fontWeight: 600,
                fontSize: 62,
                lineHeight: 1.12,
                color: "#082078",
              }}
            >
              {dict.meta.ogTitle}
            </div>
            <div style={{ marginTop: 26, display: "flex", fontFamily: "Source Sans 3", fontWeight: 400, fontSize: 28, color: "#4f5b6b" }}>
              {`${site.owner.name} · ${dict.meta.ogSubtitle}`}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Source Sans 3", fontWeight: 400, fontSize: 22, color: "#1f2a3a" }}>
            {`${site.address.zip} ${site.address.city} · ${site.contact.phone}`}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Source Sans 3", data: regular, weight: 400, style: "normal" },
        { name: "Source Sans 3", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
