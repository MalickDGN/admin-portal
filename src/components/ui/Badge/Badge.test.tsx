import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("affiche son contenu avec le ton par défaut", () => {
    render(<Badge>En attente</Badge>);
    const badge = screen.getByText("En attente");
    expect(badge).toHaveClass("badge--neutral");
  });

  it("applique le ton demandé", () => {
    render(<Badge tone="danger">Rupture</Badge>);
    expect(screen.getByText("Rupture")).toHaveClass("badge--danger");
  });
});
