import { NextResponse, type NextRequest } from "next/server";
import { readSessionToken, SESSION_COOKIE } from "@/lib/auth/session";

/**
 * Erste Schranke vor der Admin-App: Ohne gültig signiertes Cookie geht es zur
 * Anmeldung. Ob das Konto noch existiert und die PIN noch gilt, prüft danach
 * jede Seite selbst — der Proxy allein ist keine Sicherung.
 */

// Der Service Worker enthält nichts Vertrauliches; Browser laden ihn auch ohne
// Sitzung neu. Die Anleitung wird per Link verschickt und ist vor dem Anmelden lesbar.
const OPEN_PATHS = ["/admin/anmelden", "/admin/anleitung", "/admin/manifest.webmanifest", "/admin/sw.js"];

function withAdminHeaders(response: NextResponse): NextResponse {
  /* Extra-Schutz neben robots.txt: Crawler sollen /admin nie indexieren. */
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (OPEN_PATHS.some((open) => pathname === open || pathname.startsWith(`${open}/`))) {
    return withAdminHeaders(NextResponse.next());
  }

  const session = await readSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return withAdminHeaders(NextResponse.json({ error: "Bitte anmelden." }, { status: 401 }));
    }
    const login = new URL("/admin/anmelden", request.url);
    if (pathname !== "/admin") login.searchParams.set("weiter", pathname);
    return withAdminHeaders(NextResponse.redirect(login));
  }

  return withAdminHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
