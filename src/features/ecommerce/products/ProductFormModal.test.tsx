import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFormModal } from "./ProductFormModal";

describe("ProductFormModal", () => {
  it("affiche les erreurs de validation quand le formulaire est vide", async () => {
    render(<ProductFormModal open onClose={vi.fn()} onSubmit={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByText("Le nom doit contenir au moins 2 caractères")).toBeInTheDocument();
    expect(screen.getByText("Catégorie requise")).toBeInTheDocument();
  });

  it("soumet des valeurs valides", async () => {
    const onSubmit = vi.fn();
    render(<ProductFormModal open onClose={vi.fn()} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Nom du produit"), "Bougie test");
    await userEvent.click(screen.getByRole("button", { name: "Catégorie" }));
    await userEvent.click(screen.getByRole("option", { name: "Maison" }));

    const priceInput = screen.getByLabelText("Prix (F CFA)");
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, "9900");

    const stockInput = screen.getByLabelText("Stock");
    await userEvent.clear(stockInput);
    await userEvent.type(stockInput, "5");

    await userEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Bougie test",
      category: "Maison",
      price: 9900,
      stock: 5,
    });
  });

  it("pré-remplit le formulaire en mode édition", () => {
    render(
      <ProductFormModal
        open
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        initialValues={{ id: "1", name: "Existant", category: "Soin", price: 5000, stock: 3 }}
      />,
    );
    expect(screen.getByLabelText("Nom du produit")).toHaveValue("Existant");
    expect(screen.getByText("Modifier le produit")).toBeInTheDocument();
  });
});
