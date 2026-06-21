import type { Explanation } from "./types";

const KEYS = {
  history: "eli5.history.v2",
  theme: "eli5.theme.v2",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function loadHistory(): Explanation[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEYS.history);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: Explanation[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEYS.history, JSON.stringify(history));
  } catch {
    // Storage might be full or disabled (private browsing). Silently no-op —
    // losing history is better than crashing the app over it.
  }
}

export type ThemeName = "dark" | "light";

export function loadStoredTheme(): ThemeName | null {
  if (!isBrowser()) return null;
  const stored = window.localStorage.getItem(KEYS.theme);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function saveTheme(theme: ThemeName): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.theme, theme);
}
