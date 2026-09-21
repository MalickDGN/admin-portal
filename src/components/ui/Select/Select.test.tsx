import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const OPTIONS = [
  { value: "parfums", label: "Parfums" },
  { value: "maison", label: "Maison" },
];

describe("Select", () => {
  it("affiche le placeholder quand aucune valeur n'est sélectionnée", () => {
    render(<Select options={OPTIONS} value="" onChange={vi.fn()} placeholder="Choisir..." />);
    expect(screen.getByText("Choisir...")).toBeInTheDocument();
  });

  it("affiche le libellé de l'option sélectionnée", () => {
    render(<Select options={OPTIONS} value="maison" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("Maison");
  });

  it("ouvre la liste au clic et appelle onChange à la sélection", async () => {
    const onChange = vi.fn();
    render(<Select label="Catégorie" options={OPTIONS} value="" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Catégorie" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("option", { name: "Parfums" }));
    expect(onChange).toHaveBeenCalledWith("parfums");
  });

  it("ferme la liste avec Échap", async () => {
    render(<Select label="Catégorie" options={OPTIONS} value="" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: "Catégorie" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("affiche le message d'erreur fourni", () => {
    render(<Select options={OPTIONS} value="" onChange={vi.fn()} error="Catégorie requise" />);
    expect(screen.getByText("Catégorie requise")).toBeInTheDocument();
  });
});
