/**
 * Macht die Admin-App installierbar: „Zum Home-Bildschirm“ auf dem iPhone,
 * „App installieren“ in Chrome und Edge, „Zum Dock hinzufügen“ in Safari am
 * Mac. Eigenes Manifest, damit die App direkt in /admin startet und nicht auf
 * der Website.
 */
export function GET() {
  return Response.json(
    {
      name: "ProjeXs Admin · Daniela Franzen",
      short_name: "ProjeXs",
      description: "Anfragen beantworten und Website-Texte pflegen.",
      id: "/admin",
      start_url: "/admin",
      scope: "/admin",
      display: "standalone",
      lang: "de",
      dir: "ltr",
      categories: ["productivity", "business"],
      background_color: "#f7f7f6",
      theme_color: "#f7f7f6",
      // Ein Tipp auf eine Benachrichtigung holt die offene App nach vorn statt ein zweites Fenster zu öffnen.
      launch_handler: { client_mode: "focus-existing" },
      icons: [
        { src: "/app-icons/projexs-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/app-icons/projexs-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/app-icons/projexs-1024.png", sizes: "1024x1024", type: "image/png", purpose: "any" },
        { src: "/app-icons/projexs-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
      // Lange auf das App-Symbol drücken (Android, Windows, macOS-Dock)
      shortcuts: [
        { name: "Anfragen", url: "/admin/anfragen", icons: [{ src: "/app-icons/projexs-192.png", sizes: "192x192" }] },
        { name: "Inhalte", url: "/admin/inhalte", icons: [{ src: "/app-icons/projexs-192.png", sizes: "192x192" }] },
        { name: "Einstellungen", url: "/admin/einstellungen", icons: [{ src: "/app-icons/projexs-192.png", sizes: "192x192" }] },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json", "Cache-Control": "public, max-age=3600" } },
  );
}
