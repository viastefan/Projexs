import { readJson, updateJson } from "@/lib/storage";
import { DEFAULT_SETTINGS, PATHS, type Settings } from "./types";

export async function getSettings(): Promise<Settings> {
  const stored = await readJson<Settings>(PATHS.settings);
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function updateSettings(patch: (current: Settings) => Settings): Promise<Settings> {
  return updateJson<Settings>(PATHS.settings, () => DEFAULT_SETTINGS, (current) =>
    patch({ ...DEFAULT_SETTINGS, ...current }),
  );
}
