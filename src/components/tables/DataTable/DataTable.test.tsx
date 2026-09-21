import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as XLSX from "xlsx";
import { DataTable, type DataTableColumn } from "./DataTable";

vi.mock("xlsx", async () => {
  const actual = await vi.importActual<typeof XLSX>("xlsx");
  return { ...actual, writeFile: vi.fn() };
});

interface Row {
  id: string;
  name: string;
  amount: number;
}

const rows: Row[] = [
  { id: "1", name: "Zèbre", amount: 30 },
  { id: "2", name: "Autruche", amount: 10 },
  { id: "3", name: "Bison", amount: 20 },
];

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Nom", accessor: (r) => r.name, sortable: true, sortValue: (r) => r.name, csvValue: (r) => r.name },
  { key: "amount", header: "Montant", accessor: (r) => r.amount, sortable: true, sortValue: (r) => r.amount, csvValue: (r) => r.amount },
];

function getBodyRowNames() {
  const rowsInDom = screen.getAllByRole("row").slice(1); // exclut l'en-tête
  return rowsInDom.map((row) => within(row).getAllByRole("cell")[0].textContent);
}

describe("DataTable", () => {
  it("affiche toutes les lignes par défaut", () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} />);
    expect(getBodyRowNames()).toEqual(["Zèbre", "Autruche", "Bison"]);
  });

  it("filtre les lignes via la recherche", async () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} searchable searchPlaceholder="Rechercher..." />);
    await userEvent.type(screen.getByPlaceholderText("Rechercher..."), "bison");
    expect(getBodyRowNames()).toEqual(["Bison"]);
  });

  it("trie les lignes au clic sur une colonne triable, puis inverse au second clic", async () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} />);
    const sortButton = screen.getByRole("button", { name: /Nom/ });
    await userEvent.click(sortButton);
    expect(getBodyRowNames()).toEqual(["Autruche", "Bison", "Zèbre"]);
    await userEvent.click(sortButton);
    expect(getBodyRowNames()).toEqual(["Zèbre", "Bison", "Autruche"]);
  });

  it("pagine les résultats selon pageSize", async () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} pageSize={2} />);
    expect(getBodyRowNames()).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Page suivante" }));
    expect(getBodyRowNames()).toHaveLength(1);
  });

  it("affiche le libellé vide quand il n'y a aucune donnée", () => {
    render(<DataTable columns={columns} data={[]} getRowId={(r) => r.id} emptyLabel="Rien à afficher" />);
    expect(screen.getByText("Rien à afficher")).toBeInTheDocument();
  });

  it("affiche un état vide contextuel quand la recherche ne donne aucun résultat", async () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} searchable searchPlaceholder="Rechercher..." />);
    await userEvent.type(screen.getByPlaceholderText("Rechercher..."), "inexistant");
    expect(screen.getByText("Aucun résultat")).toBeInTheDocument();
    expect(screen.getByText('Aucune ligne ne correspond à "inexistant".')).toBeInTheDocument();
  });

  it("affiche un état d'erreur avec un bouton Réessayer quand error=true", async () => {
    const onRetry = vi.fn();
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} error onRetry={onRetry} errorLabel="Chargement impossible" />);
    expect(screen.getByText("Chargement impossible")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("déclenche un téléchargement CSV au clic sur Exporter", async () => {
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === "a") el.click = clickSpy;
      return el;
    });
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();

    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} exportable exportFileName="animaux" />);
    await userEvent.click(screen.getByRole("button", { name: /Exporter/ }));

    expect(clickSpy).toHaveBeenCalledTimes(1);
    createElementSpy.mockRestore();
  });

  it("déclenche la génération d'un classeur Excel au clic sur Exporter Excel", async () => {
    render(<DataTable columns={columns} data={rows} getRowId={(r) => r.id} exportable excelExportable exportFileName="animaux" />);

    expect(screen.getByRole("button", { name: "Exporter CSV" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Exporter Excel" }));

    await waitFor(() => expect(XLSX.writeFile).toHaveBeenCalledTimes(1));
    expect(XLSX.writeFile).toHaveBeenCalledWith(expect.anything(), "animaux.xlsx");
  });
});
