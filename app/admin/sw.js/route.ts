/**
 * Service Worker der Admin-App. Er zeigt Push-Benachrichtigungen an und
 * öffnet beim Antippen die passende Seite — sonst nichts. Seiten oder
 * Anfragen legt er bewusst nicht auf dem Gerät ab.
 *
 * Liegt unter /admin, damit er nur für die App gilt und nie für die Website.
 */
const SCRIPT = `'use strict';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {};
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'ProjeXs Admin', {
      body: data.body || '',
      icon: '/app-icons/projexs-192.png',
      badge: '/app-icons/projexs-192.png',
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { url: data.url || '/admin' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || '/admin', self.location.origin);
  if (target.origin !== self.location.origin) return;
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      const open = windows.find((client) => new URL(client.url).pathname.startsWith('/admin'));
      if (open) {
        await open.focus();
        if ('navigate' in open) {
          try {
            await open.navigate(target.href);
            return;
          } catch (error) {
            // Nicht gesteuertes Fenster — dann eben ein neues öffnen.
          }
        }
      }
      await self.clients.openWindow(target.href);
    })(),
  );
});
`;

export function GET() {
  return new Response(SCRIPT, {
    headers: {
      "Content-Type": "text/javascript; charset=utf-8",
      // Gilt für /admin selbst, nicht nur für Unterseiten.
      "Service-Worker-Allowed": "/admin",
    },
  });
}
