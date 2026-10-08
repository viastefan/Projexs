# ProjeXs – Website von Daniela Franzen

Neue Website für **ProjeXs – Daniela Franzen** (SAP-Projektleitung, Programmmanagement & Interim Management).
Ersetzt die bisherige Wix-Seite unter [projexs.de](https://www.projexs.de) – mit denselben Inhalten,
neu strukturiert, schneller, zweisprachig und DSGVO-freundlich (keine Cookies, kein Tracking).

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) · React 19 · TypeScript |
| **Styling** | Tailwind CSS 4 · Farben aus dem ProjeXs-Logo (Navy + Türkis), Schrift Source Sans 3 |
| **Sprachen** | Deutsch unter `/`, Englisch unter `/en` |
| **Hosting** | Vercel, alle Seiten statisch vorgerendert |
| **Live (Vorschau)** | https://projexs-delta.vercel.app |

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

## Admin-App (`/admin`)

Unter **/admin** liegt die Verwaltung für Daniela — am Computer im Browser, auf dem Handy als
installierbare App („Zum Home-Bildschirm“, ohne App Store). Sie kann dort:

- **Anfragen beantworten.** Alles aus Anfrage-Dialog, Kontaktformular und Pop-up landet im Postfach der
  App — mit Zähler für Ungelesenes, Status (Neu / In Bearbeitung / Erledigt), Notiz und Antwort direkt aus
  der App (oder per Mailprogramm). Jede neue Anfrage meldet sich per Push aufs Handy und per E-Mail.
  Erledigte Anfragen löschen sich nach der eingestellten Frist von selbst.
- **Inhalte bearbeiten.** Alle Website-Texte (Deutsch und Englisch) und die Stammdaten (E-Mail, Telefon,
  Anschrift, USt-IdNr.) — jedes Feld zeigt, ob es vom Standardtext im Code abweicht, und lässt sich
  einzeln zurücksetzen. Gespeichert wird nur die Abweichung; die Website ist sofort aktuell.
- **Website pausieren / veröffentlichen.** Schalter „Website online“ auf der Übersicht und in den
  Einstellungen. Pausiert sehen Besucher nur einen Hinweis mit den Kontaktdaten (Impressum, Datenschutz
  und AGB bleiben erreichbar); die Vorschau zeigt weiterhin alles. Ein signierter Vorschau-Link (14 Tage
  gültig, ohne Anmeldung) lässt sich weitergeben. Jede Änderung steht im Verlauf.
- **Einstellungen.** Push pro Gerät, E-Mail-Benachrichtigung, Aufbewahrungsfrist, Darstellung
  (hell/dunkel), eigene PIN, weitere Zugänge (nur Inhaberin), Technik-Status, Testmail.

Gestaltet wie eine aktuelle iPhone- bzw. Mac-App: Systemschrift, schwebende Tab-Leiste am Handy,
Seitenleiste am Computer, hell und dunkel nach Systemeinstellung. Das App-Symbol ist das Logo-Zeichen
der Website (`public/app-icons/`, erzeugt mit `node scripts/build-app-icons.mjs`).

### Einrichtung in Vercel (einmalig)

1. **Speicher anlegen:** Projekt → Storage → Create → **Blob**, Region **Frankfurt (fra1)**, Zugriff
   **Private**, Häkchen bei „Add a read-write token env var“ → `BLOB_READ_WRITE_TOKEN`. Darin liegen
   Anfragen, Zugänge, Einstellungen, Inhalts-Änderungen und Push-Abos als JSON.
2. **Umgebungsvariablen** (Production und Preview; Vorlage in `.env.example`):
   - `ADMIN_SESSION_SECRET` — signiert Anmeldung und Vorschau-Links (mind. 32 Zeichen, z. B.
     `openssl rand -base64 48`)
   - `ADMIN_PIN` — sechsstellige PIN von Daniela. Legt beim ersten Öffnen ihren Zugang an und bleibt als
     Notzugang gültig, auch wenn sie in der App eine eigene PIN setzt.
   - `CRON_SECRET` — schützt die tägliche Löschung erledigter Anfragen (`vercel.json` → `crons`)
   - SMTP-Zugang (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, z. B. IONOS `smtp.ionos.de:587`)
     oder `RESEND_API_KEY`; dazu `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, optional `CONFIRMATION_FROM`
     (Eingangsbestätigung) und `REPLY_FROM` (Antworten aus der App)
   - optional `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — sonst erzeugt die App die Push-Schlüssel selbst
3. **Erster Login:** `https://…/admin` öffnen und die `ADMIN_PIN` eingeben. Danach unter Einstellungen →
   „PIN ändern“ eine eigene PIN wählen, Push auf dem Handy einschalten und eine Testmail senden.
4. **Aufs Handy:** Beim ersten Öffnen bietet die App die Installation selbst an (Safari: Teilen → „Zum
   Home-Bildschirm“; Chrome/Edge: „App installieren“). Push kommt auf iPhone und iPad nur in der
   installierten App an. Anleitung für Daniela: `/admin/anleitung` (ohne Anmeldung lesbar).

Ohne Speicher (z. B. im CI-Build oder lokal ohne Variablen) bleibt die Website statisch und online, die
Admin-App zeigt „Bald für Sie da“, und das Kontaktformular arbeitet wie bisher über E-Mail.

**Lokal testen:**

```bash
STORAGE_DRIVER=local ADMIN_SESSION_SECRET=$(openssl rand -base64 48) ADMIN_PIN=123456 npm run dev
```

Daten liegen dann unter `.data/` (nicht im Repository).

| Pfad | Zweck |
|---|---|
| `app/admin/` | Seiten der App (Anmelden, Übersicht, Anfragen, Inhalte, Einstellungen, Anleitung) |
| `app/admin/actions/` | Server Actions (Anmeldung, Anfragen, Inhalte, Push, Einstellungen) |
| `app/api/vorschau`, `app/api/admin/website`, `app/api/cron/aufbewahrung` | Vorschau-Link, Website ein/aus, tägliche Löschung |
| `components/admin/`, `components/admin-site/` | Bausteine der App bzw. Vorschau-Leiste und Pausenseite |
| `lib/auth/`, `lib/cms/`, `lib/storage/`, `lib/push.ts`, `lib/mail.ts` | Zugänge, Daten, Speicher, Push, E-Mail |
| `proxy.ts` | Schranke vor `/admin`: ohne gültige Sitzung zur Anmeldung |

---

## Deployment auf Vercel (wenn es so weit ist)

Das Repository ist mit dem Vercel-Projekt **projexs** (Team *Festag App*) verbunden. Jeder Push auf `main`
erzeugt ein Production-Deployment. `vercel.json` verhindert Deployments für Arbeits-Branches (`festagclaude/**`),
damit kein Nutzungsguthaben verbraucht wird.

Aktuelle Vorschau: **https://projexs-delta.vercel.app**

> Hinweis: Die Adresse `projexs-festag.vercel.app` ist durch Vercel-SSO geschützt und nur mit Team-Login
> erreichbar. Zum Teilen eignet sich `projexs-delta.vercel.app`.

Für den Livegang unter der eigenen Domain:

1. Umgebungsvariablen eintragen (`NEXT_PUBLIC_SITE_URL=https://www.projexs.de`, SMTP bzw. Resend sowie die Werte der Admin-App, siehe oben).
2. Unter **Settings → Domains** `projexs.de` und `www.projexs.de` hinzufügen und die von Vercel angezeigten
   DNS-Einträge beim Domain-Anbieter eintragen (dort, wo die Domain heute auf Wix zeigt).
3. Prüfen, ob der Vercel-Tarif für eine gewerbliche Seite ausreicht (der Hobby-Plan ist nur für
   nicht-kommerzielle Projekte zulässig).
4. Wix-Abo erst kündigen, wenn die neue Seite unter der Domain erreichbar ist.

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
