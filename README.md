# ProjeXs – Website von Daniela Franzen

Neue Website für **ProjeXs – Daniela Franzen** (SAP-Projektleitung, Programmmanagement & Interim Management).
Ersetzt die bisherige Wix-Seite unter [projexs.de](https://www.projexs.de) – mit denselben Inhalten,
neu strukturiert, schneller, zweisprachig und DSGVO-freundlich (keine Cookies, kein Tracking).

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) · React 19 · TypeScript |
| **Styling** | Tailwind CSS 4 · Farben aus dem ProjeXs-Logo (Navy + Türkis), Schrift Source Sans 3 |
| **Sprachen** | Deutsch unter `/`, Englisch unter `/en` |
| **Hosting** | vorbereitet für Vercel (alle Seiten statisch vorgerendert) |

---

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) 20.9 oder neuer (empfohlen: 22, siehe `.nvmrc`).

```bash
npm install
npm run dev
```

Danach im Browser öffnen: **http://localhost:3000** (Deutsch) bzw. **http://localhost:3000/en** (Englisch).

Weitere Befehle:

| Befehl | Zweck |
|---|---|
| `npm run build` | Produktions-Build erstellen (prüft auch TypeScript) |
| `npm run start` | Produktions-Build lokal ausliefern (nach `build`) |
| `npm run lint` | Code-Qualität prüfen (ESLint) |
| `npm run typecheck` | Typen prüfen |

---

## Inhalte bearbeiten

Alle Texte und Stammdaten liegen zentral im Ordner `content/` – für Textänderungen muss keine Komponente angefasst werden.

| Datei | Inhalt |
|---|---|
| `content/site.ts` | Stammdaten: E-Mail, Telefon, LinkedIn, Anschrift, USt-ID, Bildpfade |
| `content/de.ts` | Alle deutschen Texte (Hero, Leistungen, Projekte, FAQ, Formular …) |
| `content/en.ts` | Alle englischen Texte – gleiche Struktur wie `de.ts` (TypeScript prüft das) |
| `components/legal/` | Impressum, Datenschutzerklärung, AGB |
| `public/images/` | Porträtfotos (aus der Wix-Mediathek übernommen, web-optimiert) |

**Bilder austauschen:** Neue Datei nach `public/images/` legen und den Pfad in `content/site.ts` unter `images` anpassen.
Empfohlen: Hochformat 4:5, mindestens 1280 × 1600 px, JPEG.

---

## Anfrage & Kontakt

Es gibt drei Wege, Daniela zu erreichen – alle nutzen dieselbe Server-Logik (`lib/contact.ts`):

- **Anfrage-Dialog** („Projekt anfragen“ im Header, im Hero, in der Ablauf-Sektion und in der mobilen Leiste):
  mehrstufiges Formular im Overlay, eine Frage pro Schritt, Enter springt weiter (`components/inquiry/`).
  Deep-Link: `/#anfrage` öffnet den Dialog direkt.
- **Kontaktseite** `/kontakt` bzw. `/en/contact`: dieselben Schritte als Seite plus direkte Kontaktwege.
- **Klassisches Formular** am Ende der Startseite (`components/sections/ContactForm.tsx`).

Das Formular funktioniert sofort – auch ohne Konfiguration:

- **Ohne Mail-Dienst:** Nach dem Absenden wird die Nachricht vorbereitet und per Knopfdruck im E-Mail-Programm
  der Besucherin/des Besuchers geöffnet (an `Daniela.Franzen@projexs.de`).
- **Mit [Resend](https://resend.com) (empfohlen):** Anfragen kommen direkt per E-Mail an – inkl. „Antworten an“ die
  Absender-Adresse.
  1. Konto bei Resend anlegen und die Domain `projexs.de` verifizieren (DNS-Einträge laut Resend).
  2. API-Key erstellen.
  3. Umgebungsvariablen setzen (lokal in `.env.local`, später in Vercel unter *Settings → Environment Variables*):

```bash
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=Daniela.Franzen@projexs.de
CONTACT_FROM_EMAIL=ProjeXs Website <website@projexs.de>
```

Spam-Schutz ist eingebaut (unsichtbares Honeypot-Feld + Mindest-Ausfüllzeit), ganz ohne Captcha oder Cookies.
Eine Vorlage aller Variablen liegt in `.env.example`.

---

## Deployment auf Vercel (wenn es so weit ist)

> **Aktuell bewusst deaktiviert:** `vercel.json` verhindert automatische Deployments für Arbeits-Branches
> (`festagclaude/**`), damit kein Vercel-Nutzungsguthaben verbraucht wird. Entwickelt und geprüft wird lokal.

Für den Livegang:

1. In Vercel **Add New → Project** und das GitHub-Repository `viastefan/Projexs` importieren
   (Framework wird automatisch als Next.js erkannt, keine weiteren Build-Einstellungen nötig).
2. Umgebungsvariablen eintragen (`NEXT_PUBLIC_SITE_URL=https://www.projexs.de` sowie optional die Resend-Werte).
3. Branch `main` als Production-Branch nutzen – jeder Merge nach `main` erzeugt ein Production-Deployment.
4. Unter **Settings → Domains** `projexs.de` und `www.projexs.de` hinzufügen und die von Vercel angezeigten
   DNS-Einträge beim Domain-Anbieter eintragen (dort, wo die Domain heute auf Wix zeigt).
5. Wix-Abo erst kündigen, wenn die neue Seite unter der Domain erreichbar ist.

**SEO beim Umzug:** Die alten Wix-Adressen werden dauerhaft (308) auf die neuen Seiten umgeleitet
(`/privacy-policy` → `/datenschutz`, `/privacy-policy-1` → `/impressum`, `/privacy-policy-2` → `/agb`,
`/home-a-1` → `/`, jeweils auch unter `/en`). Nach dem Livegang die neue Sitemap
`https://www.projexs.de/sitemap.xml` in der Google Search Console einreichen.

---

## Checkliste vor dem Livegang

- [ ] **Texte von Daniela freigeben lassen** – insbesondere Hero, Leistungen, FAQ und die Kennzahlen
      (23+ Jahre, 15+ Jahre Führung, 13 Go-lives, 90 Projektmitglieder).
- [ ] **E-Mail-Adresse bestätigen:** Auf der alten Seite kamen `Daniela.Franzen@projexs.de` und
      `DanielaFranzen@projexs.de` vor. Verwendet wird `Daniela.Franzen@projexs.de` (wie im bisherigen Impressum).
- [ ] **LinkedIn-Profil prüfen:** verlinkt ist `linkedin.com/in/daniela-franzen-8b927219b`.
- [ ] **USt-IdNr.** in `content/site.ts` eintragen, falls vorhanden (wird dann automatisch im Impressum angezeigt).
- [ ] **Datenschutzerklärung rechtlich prüfen lassen** – sie wurde an die neue Technik angepasst
      (Hosting bei Vercel, keine Cookies, optional Resend).
- [ ] **Bildrechte:** Porträtfotos stammen aus der bisherigen Wix-Mediathek – Nutzungsrechte für die neue Seite bestätigen.
- [ ] Resend einrichten (siehe oben) und eine Testanfrage senden.

---

## Projektstruktur

```
app/
  (de)/            Deutsche Seiten: Startseite, Kontakt, Impressum, Datenschutz, AGB
  (en)/en/         Englische Seiten: Startseite, Contact, Legal notice, Privacy
  globals.css      Design-System (Farben, Schrift, Rechtstext-Styles)
  global-not-found.tsx   404-Seite
  sitemap.ts · robots.ts · manifest.ts · icon.svg · apple-icon.tsx
components/
  inquiry/         Anfrage-Dialog: mehrstufiges Formular, Overlay, Auslöser-Button
  sections/        Abschnitte der Startseite (Hero, Leistungen, Ablauf, Projekte, …) und Kontaktseite
  site/            Header, Footer, Logo, Seitengerüst
  legal/           Rechtstexte
  ui/              Wiederverwendbare Bausteine (Buttons, Icons, …)
content/           Alle Texte und Stammdaten (siehe oben)
lib/               Kontaktformular (Server Action), SEO-Metadaten, JSON-LD, OG-Bild
assets/fonts/      Schriftdateien für das automatisch erzeugte Social-Media-Vorschaubild
public/images/     Fotos
```

### Qualitätsmerkmale

- **Performance:** komplett statisch vorgerendert, Bilder über `next/image` (AVIF/WebP, responsive), selbst gehostete Schriften.
- **SEO:** Titel/Beschreibungen je Seite, `hreflang` DE/EN, kanonische URLs, strukturierte Daten
  (ProfessionalService, Person, FAQ), Sitemap, robots.txt, automatisch erzeugte Social-Media-Vorschaubilder.
- **Barrierefreiheit:** semantisches HTML, „Zum Inhalt springen“-Link, Tastaturbedienung inkl. Mobil-Menü,
  sichtbare Fokuszustände, Formularfehler mit Screenreader-Bezug, Rücksicht auf „Bewegung reduzieren“.
- **Sicherheit:** Security-Header (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy), Formular-Validierung serverseitig.
- **Datenschutz:** keine Cookies, kein Tracking, keine Verbindungen zu Drittanbietern beim Seitenaufruf → kein Cookie-Banner nötig.
