/**
 * Erzeugt die App-Icons der Admin-App aus dem ProjeXs-Logo-Zeichen
 * (dasselbe Motiv wie `app/icon.svg`: Navy-Kachel mit weißem und türkisem
 * Strich als „X“). Aufruf: `node scripts/build-app-icons.mjs`
 *
 * Ergebnis in `public/app-icons/`:
 *   projexs-192.png, projexs-512.png, projexs-1024.png  (purpose: any)
 *   projexs-maskable-512.png                             (Android, mit Sicherheitsrand)
 *   projexs-apple-180.png                                (iOS Home-Bildschirm)
 *   projexs-32.png                                       (Favicon der App)
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "app-icons");
const NAVY = "#082078";
const TEAL = "#0097b2";

/** Das Zeichen: Kachel mit zwei Strichen. `inset` schiebt das Motiv nach innen (maskable). */
function svg(size, { radius, inset }) {
  const s = 64; // Koordinatensystem wie app/icon.svg
  const scale = (s - 2 * inset) / s;
  const t = inset;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${radius}" fill="${NAVY}"/>
  <g transform="translate(${t} ${t}) scale(${scale})">
    <path d="M19 19 45 45" stroke="#ffffff" stroke-width="7" stroke-linecap="square"/>
    <path d="M45 19 19 45" stroke="${TEAL}" stroke-width="7" stroke-linecap="square"/>
  </g>
</svg>`;
}

async function render(name, size, options) {
  const png = await sharp(Buffer.from(svg(size, options))).resize(size, size).png().toBuffer();
  await writeFile(path.join(OUT, name), png);
  console.log(`✓ ${name} (${size}×${size})`);
}

await mkdir(OUT, { recursive: true });
// iOS rundet die Ecken selbst — darum ohne Rundung; Android mit „any“ ebenfalls eckig.
await render("projexs-apple-180.png", 180, { radius: 0, inset: 0 });
for (const size of [32, 192, 512, 1024]) await render(`projexs-${size}.png`, size, { radius: 0, inset: 0 });
// Maskable: Android schneidet bis zu 20 % am Rand ab — Motiv in die sichere Zone.
await render("projexs-maskable-512.png", 512, { radius: 0, inset: 9 });
