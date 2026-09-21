import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("ne rend rien quand open=false", () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Titre">
        Contenu
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("affiche le titre, le contenu et le footer quand open=true", () => {
    render(
      <Modal open onClose={vi.fn()} title="Nouveau produit" footer={<button>Enregistrer</button>}>
        Contenu du formulaire
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Nouveau produit")).toBeInTheDocument();
    expect(screen.getByText("Contenu du formulaire")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();
  });

  it("appelle onClose au clic sur le bouton de fermeture", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Titre">
        Contenu
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("appelle onClose avec la touche Échap", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Titre">
        Contenu
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas onClose au clic à l'intérieur de la modale", async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Titre">
        Contenu cliquable
      </Modal>,
    );
    await userEvent.click(screen.getByText("Contenu cliquable"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
