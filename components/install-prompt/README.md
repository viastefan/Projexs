# Installations-Pop-up für Web-Apps

Ein Baustein, der eine Web-App (PWA) „installieren“ lässt — mit Glas-Optik im
Stil von iOS 26 / macOS Tahoe, einem kurzen Film der Handgriffe und
Ein-Klick-Installation, wo der Browser es erlaubt. Gebaut für die Praxis-App,
gedacht zum Wiederverwenden in anderen Projekten.

## Was es kann

| Gerät | Verhalten |
| --- | --- |
| iPhone / iPad (Safari, Chrome, Edge) | Film + Schritte: `···` → Teilen → „Zum Home-Bildschirm“ → „Hinzufügen“ |
| Android (Chrome, Edge, Samsung) | Knopf „Jetzt installieren“ (ein Tipp); sonst Film: Menü `⋮` → „App installieren“ |
| Chrome / Edge am Computer | Knopf „Jetzt installieren“; sonst Film: Symbol in der Adressleiste |
| Safari am Mac (ab 17) | Film: Teilen → „Zum Dock hinzufügen“ |
| Firefox am Computer | Hinweis auf Chrome/Edge/Safari |
| Computer allgemein | QR-Code, „Link kopieren“, „Per E-Mail senden“ — um die App aufs Handy zu holen |
| App schon installiert | zeigt nichts |

- **Beim ersten Besuch** öffnet sich das Pop-up nach 1,4 s von selbst.
- **„Später“** → in den nächsten 7 Tagen nur ein schmales Banner; danach
  fragt das Pop-up wieder, höchstens dreimal insgesamt.
- Auf dem Handy läuft zum Film ein Untertitel mit dem jeweils aktuellen
  Schritt; am Computer steht die ganze Liste daneben und leuchtet mit.
- Hell und dunkel nach Systemeinstellung, ohne Bewegung bei
  „Bewegung reduzieren“, Escape und Klick daneben schließen.

## Einbinden (Next.js / React)

1. Den Ordner `install-prompt/` ins Projekt kopieren.
2. `npm install qrcode` (für den QR-Code; wird erst am Computer nachgeladen).
3. Die Web-App braucht ein Manifest mit `name`, `start_url`, `display:
   "standalone"` und Symbolen in 192 und 512 px — sonst bietet Chrome keine
   Installation an.
4. Irgendwo, wo es auf jeder Seite der App gerendert wird:

```tsx
import { InstallPrompt } from '@/components/install-prompt';

<InstallPrompt
  appName="Meine App"
  appIcon="/icons/app-512.png"
  tagline="Kurz, warum sich das lohnt."
  features={['Startet wie eine App', 'Mitteilungen aufs Handy', 'Immer aktuell']}
  startPath="/"
  accent="#50694f"
  storageKey="meine-app-install"
/>
```

Aus einem Menüpunkt öffnen:

```tsx
import { openInstallPrompt } from '@/components/install-prompt';

<button onClick={openInstallPrompt}>App installieren</button>
```

## Einstellungen

| Eigenschaft | Standard | Wofür |
| --- | --- | --- |
| `appName`, `appIcon` | — | Name und quadratisches Symbol (mind. 192 px) |
| `tagline`, `features` | allgemeine Texte | Unterzeile und drei Vorteile |
| `startPath` / `shareUrl` | `/` | Adresse für QR-Code und Link |
| `accent` | `#50694f` | Knöpfe, Schrittnummern, Farbschimmer |
| `videos` | — | echte Bildschirmaufnahmen statt Film: `{ ios: '/…mp4', android: …, desktop: …, mac: … }` |
| `storageKey` | `install-prompt` | pro App eigenen Namen wählen |
| `autoOpenDelayMs` | `1400` | Verzögerung beim ersten Besuch |
| `snoozeDays` | `7` | Tage mit Banner nach „Später“ |
| `maxAutoOpens` | `3` | wie oft das Pop-up höchstens von selbst kommt |
| `banner` | `true` | Banner nach „Später“ zeigen |
| `bannerBottom` | `calc(1rem + env(safe-area-inset-bottom))` | Höhe des Banners, z. B. über einer Tab-Leiste |

## Dateien

- `InstallPrompt.tsx` — Pop-up, Banner, Ablauf
- `InstallDemo.tsx` — der Film (HTML/CSS, kein Video) und die Schrittliste
- `platform.ts` — Geräteerkennung, `beforeinstallprompt`, `openInstallPrompt()`
- `install-prompt.module.css`, `install-demo.module.css` — Gestaltung

Texte sind auf Deutsch in der Sie-Form; für eine andere Sprache die Texte in
`InstallPrompt.tsx` und `DEMO_STEPS` in `InstallDemo.tsx` anpassen.
