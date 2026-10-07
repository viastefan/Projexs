import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

/* Schriften werden zur Build-Zeit geladen und selbst gehostet –
   keine Verbindung zu Google beim Seitenaufruf (DSGVO-freundlich). */

export const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable} ${instrument.variable}`;
