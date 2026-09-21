import * as defaultTheme from "./default";
import * as corporateTheme from "./corporate";
import * as fintechTheme from "./fintech";
import * as healthcareTheme from "./healthcare";
import type { ThemeName } from "../types";

/**
 * Registre central des thèmes projet. Pour ajouter un thème :
 * 1. Créer theme/themes/<nom>.ts (copier default.ts) avec une nouvelle palette
 * 2. L'enregistrer ici
 * 3. Ajouter le nom à ThemeName dans theme/types.ts
 * Aucun composant n'a besoin d'être modifié.
 */
export const themeRegistry: Record<ThemeName, { light: typeof defaultTheme.lightColors; dark: typeof defaultTheme.darkColors }> = {
  default: { light: defaultTheme.lightColors, dark: defaultTheme.darkColors },
  corporate: { light: corporateTheme.lightColors, dark: corporateTheme.darkColors },
  fintech: { light: fintechTheme.lightColors, dark: fintechTheme.darkColors },
  healthcare: { light: healthcareTheme.lightColors, dark: healthcareTheme.darkColors },
};

export const themeOptions: { value: ThemeName; label: string }[] = [
  { value: "default", label: "Adaa (défaut)" },
  { value: "corporate", label: "Corporate" },
  { value: "fintech", label: "Fintech" },
  { value: "healthcare", label: "Healthcare" },
];
