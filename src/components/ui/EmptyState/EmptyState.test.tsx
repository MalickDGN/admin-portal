import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("affiche le titre et la description", () => {
    render(<EmptyState title="Aucun produit" description="Créez-en un pour commencer." />);
    expect(screen.getByText("Aucun produit")).toBeInTheDocument();
    expect(screen.getByText("Créez-en un pour commencer.")).toBeInTheDocument();
  });

  it("affiche l'action fournie", async () => {
    const onClick = vi.fn();
    render(<EmptyState title="Vide" action={<button onClick={onClick}>Créer</button>} />);
    await userEvent.click(screen.getByRole("button", { name: "Créer" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
