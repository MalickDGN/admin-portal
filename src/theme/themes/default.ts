/**
 * Thème "default" — palette calquée sur l'esprit du template de référence Rizz
 * (bleu primaire vif, surfaces neutres, accents sémantiques).
 * Un nouveau thème projet = copier ce fichier et changer les valeurs.
 */
import type { ThemeColors } from "../types";

export const lightColors: ThemeColors = {
  primary: "#4f46e5",
  primaryHover: "#4338ca",
  secondary: "#0ea5e9",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  info: "#0891b2",
  background: "#f5f6fa",
  surface: "#ffffff",
  surfaceMuted: "#f1f2f6",
  border: "#e5e7eb",
  text: "#111827",
  textMuted: "#6b7280",
  textInverted: "#ffffff",
};

export const darkColors: ThemeColors = {
  primary: "#6366f1",
  primaryHover: "#818cf8",
  secondary: "#38bdf8",
  success: "#22c55e",
  warning: "#fbbf24",
  danger: "#f87171",
  info: "#22d3ee",
  background: "#0f1117",
  surface: "#171a23",
  surfaceMuted: "#1e2230",
  border: "#2a2f3d",
  text: "#f3f4f6",
  textMuted: "#9aa1b1",
  textInverted: "#111827",
};
