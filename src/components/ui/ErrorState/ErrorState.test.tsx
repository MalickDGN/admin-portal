import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("affiche un titre et une description par défaut", () => {
    render(<ErrorState />);
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("n'affiche pas de bouton Réessayer si onRetry n'est pas fourni", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("appelle onRetry au clic sur Réessayer", async () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
