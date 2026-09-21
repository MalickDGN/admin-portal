import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("affiche son contenu", () => {
    render(<Button>Enregistrer</Button>);
    expect(screen.getByRole("button", { name: "Enregistrer" })).toBeInTheDocument();
  });

  it("déclenche onClick au clic", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Cliquer</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("est désactivé et n'appelle pas onClick quand loading", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Enregistrement...
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applique la classe du variant demandé", () => {
    render(<Button variant="danger">Supprimer</Button>);
    expect(screen.getByRole("button")).toHaveClass("btn--danger");
  });
});
