import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Alte URLs der bisherigen Wix-Website → neue Seiten (erhält Google-Rankings)
      { source: "/home-a-1", destination: "/", permanent: true },
      { source: "/privacy-policy", destination: "/datenschutz", permanent: true },
      { source: "/privacy-policy-1", destination: "/impressum", permanent: true },
      { source: "/privacy-policy-2", destination: "/agb", permanent: true },
      { source: "/en/home-a-1", destination: "/en", permanent: true },
      { source: "/en/privacy-policy", destination: "/en/privacy", permanent: true },
      { source: "/en/privacy-policy-1", destination: "/en/legal-notice", permanent: true },
      { source: "/en/privacy-policy-2", destination: "/agb", permanent: true },
      // Naheliegende URLs auf die neuen Seiten lenken
      { source: "/de", destination: "/", permanent: true },
      { source: "/de/:path*", destination: "/:path*", permanent: true },
      { source: "/en/impressum", destination: "/en/legal-notice", permanent: true },
      { source: "/en/agb", destination: "/agb", permanent: true },
      { source: "/en/terms", destination: "/agb", permanent: true },
      { source: "/en/datenschutz", destination: "/en/privacy", permanent: true },
      { source: "/en/imprint", destination: "/en/legal-notice", permanent: true },
    ];
  },
};

export default nextConfig;
