import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { themeRegistry } from "./themes";
import { spacing, radius, shadow, typography } from "./tokens";
import type { ThemeMode, ThemeColors, ThemeName } from "./types";

interface ThemeContextValue {
  mode: ThemeMode;
  themeName: ThemeName;
  colors: ThemeColors;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MODE_STORAGE_KEY = "adaa-admin-theme-mode";
const THEME_STORAGE_KEY = "adaa-admin-theme-name";

function applyCssVariables(colors: ThemeColors) {
  const root = document.documentElement;
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${camelToKebab(key)}`, value);
  });
  Object.entries(spacing).forEach(([key, value]) => root.style.setProperty(`--space-${key}`, value));
  Object.entries(radius).forEach(([key, value]) => root.style.setProperty(`--radius-${key}`, value));
  Object.entries(shadow).forEach(([key, value]) => root.style.setProperty(`--shadow-${key}`, value));
  root.style.setProperty("--font-family-base", typography.fontFamily.base);
}

function camelToKebab(str: string) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;
    if (stored) return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [themeName, setThemeNameState] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    return stored && stored in themeRegistry ? stored : "default";
  });

  const colors = themeRegistry[themeName][mode];

  useEffect(() => {
    applyCssVariables(colors);
    document.documentElement.dataset.theme = mode;
    document.documentElement.dataset.themeName = themeName;
    localStorage.setItem(MODE_STORAGE_KEY, mode);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [colors, mode, themeName]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      themeName,
      colors,
      toggleMode: () => setModeState((m) => (m === "light" ? "dark" : "light")),
      setMode: setModeState,
      setThemeName: setThemeNameState,
    }),
    [mode, themeName, colors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
