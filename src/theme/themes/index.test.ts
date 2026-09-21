import { describe, expect, it } from "vitest";
import { themeRegistry, themeOptions } from "./index";

describe("themeRegistry", () => {
  it("contient une palette claire et sombre pour chaque thème listé dans themeOptions", () => {
    for (const option of themeOptions) {
      const theme = themeRegistry[option.value];
      expect(theme, `thème manquant : ${option.value}`).toBeDefined();
      expect(theme.light).toBeDefined();
      expect(theme.dark).toBeDefined();
    }
  });

  it("chaque palette définit toutes les couleurs requises", () => {
    const requiredKeys = [
      "primary", "primaryHover", "secondary", "success", "warning", "danger",
      "info", "background", "surface", "surfaceMuted", "border", "text",
      "textMuted", "textInverted",
    ];
    for (const theme of Object.values(themeRegistry)) {
      for (const mode of ["light", "dark"] as const) {
        for (const key of requiredKeys) {
          expect(theme[mode], `clé "${key}" manquante en mode ${mode}`).toHaveProperty(key);
        }
      }
    }
  });
});
