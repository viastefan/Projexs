import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ProjeXs – Daniela Franzen",
    short_name: "ProjeXs",
    description: "SAP-Projektmanagement, Programmmanagement & Interim Management",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#082078",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
