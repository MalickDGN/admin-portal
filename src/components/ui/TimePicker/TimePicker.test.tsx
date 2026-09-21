import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TimePicker } from "./TimePicker";

describe("TimePicker", () => {
  it("affiche le placeholder quand aucune heure n'est sélectionnée", () => {
    render(<TimePicker value={null} onChange={vi.fn()} placeholder="Choisir une heure" />);
    expect(screen.getByText("Choisir une heure")).toBeInTheDocument();
  });

  it("affiche l'heure sélectionnée", () => {
    render(<TimePicker value="14:30" onChange={vi.fn()} />);
    expect(screen.getByRole("button")).toHaveTextContent("14:30");
  });

  it("appelle onChange avec l'heure et la minute combinées", async () => {
    const onChange = vi.fn();
    render(<TimePicker label="Heure" value={null} onChange={onChange} minuteStep={15} />);
    await userEvent.click(screen.getByRole("button", { name: /hh:mm/ }));
    await userEvent.click(screen.getByRole("button", { name: "09" }));
    expect(onChange).toHaveBeenCalledWith("09:00");
  });
});
