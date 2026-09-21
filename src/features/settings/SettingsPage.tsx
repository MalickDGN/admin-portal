import { Card } from "@ui/Card/Card";
import { Select } from "@ui/Select/Select";
import { Button } from "@ui/Button/Button";
import { useTheme } from "@/theme/ThemeProvider";
import { themeOptions } from "@/theme/themes";
import type { ThemeName } from "@/theme/types";
import "./SettingsPage.css";

// Démontre la bascule de thème projet (§7 du cahier des charges) : chaque
// option ci-dessous correspond à une palette distincte dans theme/themes/,
// appliquée sans qu'aucun composant n'ait à être modifié.
export default function SettingsPage() {
  const { mode, themeName, setThemeName, toggleMode } = useTheme();

  return (
    <Card title="Apparence">
      <div className="settings-page__row">
        <div>
          <p className="settings-page__label">Thème du projet</p>
          <p className="settings-page__hint">
            Palette visuelle appliquée à l'ensemble de l'application. Un nouveau projet dupliquant ce socle choisit ici
            (ou en dur dans la config) sa propre identité.
          </p>
        </div>
        <div className="settings-page__control">
          <Select options={themeOptions} value={themeName} onChange={(value) => setThemeName(value as ThemeName)} />
        </div>
      </div>

      <div className="settings-page__row">
        <div>
          <p className="settings-page__label">Mode d'affichage</p>
          <p className="settings-page__hint">Bascule indépendamment du thème choisi ci-dessus.</p>
        </div>
        <div className="settings-page__control">
          <Button variant="outline" onClick={toggleMode}>
            {mode === "dark" ? "Passer en clair" : "Passer en sombre"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
