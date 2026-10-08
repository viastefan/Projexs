import type { Metadata, Viewport } from "next";
import ui from "@/components/admin/ui.module.css";

export const metadata: Metadata = {
  title: { default: "Admin-App", template: "%s · ProjeXs Admin" },
  description: "Verwaltung der Website von ProjeXs – Daniela Franzen.",
  /* Nie in Google & Co. — nur über den direkten Link erreichbar. */
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    googleBot: { index: false, follow: false, noimageindex: true, nosnippet: true, noarchive: true },
  },
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: { capable: true, title: "ProjeXs", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/app-icons/projexs-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/app-icons/projexs-apple-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: null,
  twitter: null,
  alternates: null,
};

/* Hell oder dunkel nach Systemeinstellung — in den Einstellungen lässt sich das festlegen. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f14" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={ui.root}>{children}</div>;
}
