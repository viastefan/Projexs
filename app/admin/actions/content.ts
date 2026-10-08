"use server";

import { requireAccount } from "@/lib/auth/server";
import {
  allContentFields,
  sanitizeOverrides,
  saveContentOverrides,
  saveSiteOverrides,
  SITE_FIELDS,
  type Locale,
} from "@/lib/cms/content";
import type { ActionState } from "./state";

interface ContentInput {
  locale?: unknown;
  changes?: unknown;
  reset?: unknown;
}

function readReset(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").slice(0, 500) : [];
}

/** Website-Texte speichern: geänderte Felder plus Felder, die auf den Standard zurückgehen. */
export async function saveContentAction(input: ContentInput): Promise<ActionState> {
  await requireAccount();
  const locale: Locale = input.locale === "en" ? "en" : "de";
  let changes;
  try {
    changes = sanitizeOverrides(input.changes ?? {}, allContentFields());
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Ungültige Eingabe." };
  }
  const reset = readReset(input.reset);
  await saveContentOverrides(locale, changes, reset);
  return { status: "ok", message: "Gespeichert — die Website ist aktualisiert." };
}

/** Stammdaten (E-Mail, Telefon, Anschrift …) speichern. */
export async function saveSiteDataAction(input: ContentInput): Promise<ActionState> {
  await requireAccount();
  let changes;
  try {
    changes = sanitizeOverrides(input.changes ?? {}, SITE_FIELDS);
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Ungültige Eingabe." };
  }
  await saveSiteOverrides(changes, readReset(input.reset));
  return { status: "ok", message: "Gespeichert — die Website ist aktualisiert." };
}
