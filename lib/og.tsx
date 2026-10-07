import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Dictionary } from "@/lib/i18n";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };

/** Erzeugt das Social-Media-Vorschaubild (Open Graph) im Markendesign. */
export async function renderOgImage(dict: Dictionary) {
  const root = process.cwd();
  const [semibold, regular, serif, photo] = await Promise.all([
    readFile(join(root, "assets/fonts/Geist-SemiBold.ttf")),
    readFile(join(root, "assets/fonts/Geist-Regular.ttf")),
    readFile(join(root, "assets/fonts/InstrumentSerif-Italic.ttf")),
    readFile(join(root, "public", site.images.hero)),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const [lead, tail] = [dict.hero.titleLead, `${dict.hero.titleAccent} ${dict.hero.titleTail}`];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0a0f16",
          backgroundImage: "radial-gradient(circle at 12% 8%, rgba(11,37,128,0.7) 0%, rgba(10,15,22,0) 60%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={504}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, width: 504, height: 630, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 504,
            height: 630,
            background: "linear-gradient(90deg, #0a0f16 0%, rgba(10,15,22,0.2) 45%, rgba(10,15,22,0) 100%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 800 }}>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist", fontWeight: 600, fontSize: 40, color: "#f6f5f1", letterSpacing: -1.5 }}>
            Proje
            <svg width="27" height="27" viewBox="0 0 100 100" style={{ margin: "0 2px" }}>
              <path d="M14 14 86 86" stroke="#f6f5f1" strokeWidth="17" strokeLinecap="square" />
              <path d="M86 14 14 86" stroke="#0aa5c0" strokeWidth="17" strokeLinecap="square" />
            </svg>
            s
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 18,
                fontFamily: "Geist",
                fontWeight: 600,
                fontSize: 68,
                lineHeight: 1.04,
                letterSpacing: -3,
                color: "#f6f5f1",
              }}
            >
              {lead.split(" ").map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
            <div style={{ fontFamily: "Instrument Serif", fontStyle: "italic", fontSize: 82, lineHeight: 1.05, color: "#2fc2dc" }}>
              {tail}
            </div>
            <div style={{ marginTop: 28, fontFamily: "Geist", fontWeight: 400, fontSize: 26, color: "#98a4b4" }}>
              {`${site.owner.name} · ${dict.meta.ogSubtitle}`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            {["PMP®", "PSM I", "S/4HANA", dict.locale === "de" ? "23+ Jahre" : "23+ years"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontFamily: "Geist",
                  fontSize: 20,
                  color: "#f6f5f1",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Instrument Serif", data: serif, weight: 400, style: "italic" },
      ],
    },
  );
}
