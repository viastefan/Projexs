// Rendert angebot.html und vertrag.html zu PDF (A4) mit Chromium.
// Aufruf: node angebot/render.mjs   (benötigt playwright-core; Chromium unter /opt/pw-browsers/chromium)
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium";

const docs = [
  { html: "angebot.html", pdf: "Angebot-ProjeXs-Website.pdf", title: "Angebot A-2026-10-01 · Website, Admin-App & Betreuung" },
  { html: "vertrag.html", pdf: "Vertrag-ProjeXs-Website.pdf", title: "Vertrag über Erstellung, Hosting und Betreuung einer Website" },
];

const footer = (title) => `
<div style="width:100%;font-family:'Source Sans 3',system-ui,sans-serif;font-size:7.5pt;color:#4f5b6b;
  padding:0 18mm;display:flex;justify-content:space-between;align-items:center;">
  <span><span style="color:#082078;font-weight:600;letter-spacing:-0.03em">Proje<span style="color:#0097b2">X</span>s</span>
    &nbsp;·&nbsp; ${title}</span>
  <span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span>
</div>`;

const browser = await chromium.launch({ executablePath, args: ["--no-sandbox"] });
try {
  for (const d of docs) {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(dir, d.html)).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: path.join(dir, d.pdf),
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: footer(d.title),
      margin: { top: "20mm", right: "18mm", bottom: "22mm", left: "18mm" },
    });
    console.log("PDF geschrieben:", d.pdf);
    await page.close();
  }
} finally {
  await browser.close();
}
