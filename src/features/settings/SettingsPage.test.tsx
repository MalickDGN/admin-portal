import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/theme/ThemeProvider";
import SettingsPage from "./SettingsPage";

function renderWithTheme() {
  return render(
    <ThemeProvider>
      <SettingsPage />
    </ThemeProvider>,
  );
}

describe("SettingsPage", () => {
  it("affiche le thème par défaut sélectionné", () => {
    renderWithTheme();
    expect(screen.getByRole("button", { name: /Adaa \(défaut\)/ })).toBeInTheDocument();
  });

  it("change la palette appliquée au document quand on sélectionne un autre thème", async () => {
    renderWithTheme();
    await userEvent.click(screen.getByRole("button", { name: /Adaa \(défaut\)/ }));
    await userEvent.click(screen.getByRole("option", { name: "Fintech" }));

    expect(document.documentElement.dataset.themeName).toBe("fintech");
  });

  it("bascule le mode clair/sombre", async () => {
    renderWithTheme();
    const toggle = screen.getByRole("button", { name: /Passer en/ });
    const initialLabel = toggle.textContent;
    await userEvent.click(toggle);
    expect(toggle.textContent).not.toBe(initialLabel);
  });
});
