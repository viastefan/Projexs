import { Source_Sans_3 } from "next/font/google";

/* Schrift wird zur Build-Zeit geladen und selbst gehostet –
   keine Verbindung zu Google beim Seitenaufruf (DSGVO-freundlich). */

export const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});

export const fontVariables = sourceSans.variable;
