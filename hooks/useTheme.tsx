"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { loadStoredTheme, saveTheme, type ThemeName } from "@/lib/storage";

interface ThemeContextValue {
  theme: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Inline script injected into <head> so the correct theme attribute is set
 * before React hydrates — otherwise dark-mode visitors get a flash of the
 * light theme (or vice versa) on every load.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('eli5.theme.v2');
    var theme = stored === 'light' || stored === 'dark'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
  }
})();
`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("dark");

  useEffect(() => {
    // The inline head script already set the DOM attribute before paint
    // (to avoid a flash of the wrong theme). This just syncs React's copy
    // of that value after mount, since the script runs outside React.
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next: ThemeName = previous === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      saveTheme(next);
      return next;
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

// Re-exported so callers that just want to peek at storage without the
// context (e.g. very first paint logic) don't need to import lib/storage too.
export { loadStoredTheme };
