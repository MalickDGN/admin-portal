import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type DataTableColumn } from "./DataTable";

interface Row {
  id: string;
  name: string;
}

const columns: DataTableColumn<Row>[] = [{ key: "name", header: "Nom", accessor: (r) => r.name, sortable: true }];

// En mode serveur, `data` représente déjà la page courante : le composant
// ne doit ni filtrer, ni trier, ni paginer localement — il délègue tout au parent.
describe("DataTable (mode serveur)", () => {
  it("affiche les données telles quelles, sans filtrage local", () => {
    const page = [{ id: "1", name: "Seule ligne de cette page" }];
    render(
      <DataTable
        columns={columns}
        data={page}
        getRowId={(r) => r.id}
        searchable
        server={{ totalCount: 42, page: 1, onPageChange: vi.fn(), query: "texte sans rapport", onQueryChange: vi.fn() }}
      />,
    );
    expect(screen.getByText("Seule ligne de cette page")).toBeInTheDocument();
  });

  it("délègue la saisie de recherche au parent via onQueryChange", async () => {
    const onQueryChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        searchable
        searchPlaceholder="Rechercher..."
        server={{ totalCount: 0, page: 1, onPageChange: vi.fn(), query: "", onQueryChange }}
      />,
    );
    await userEvent.type(screen.getByPlaceholderText("Rechercher..."), "x");
    expect(onQueryChange).toHaveBeenCalledWith("x");
  });

  it("délègue le changement de page au parent via onPageChange", async () => {
    const onPageChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={[{ id: "1", name: "A" }]}
        getRowId={(r) => r.id}
        pageSize={10}
        server={{ totalCount: 100, page: 2, onPageChange }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Page suivante" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByText(/Page 2 \/ 10/)).toBeInTheDocument();
  });

  it("délègue le tri au parent via onSortChange", async () => {
    const onSortChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        server={{ totalCount: 0, page: 1, onPageChange: vi.fn(), onSortChange }}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: /Nom/ }));
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");
  });

  it("n'affiche pas les boutons d'export en mode serveur, même si exportable est activé", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowId={(r) => r.id}
        exportable
        excelExportable
        server={{ totalCount: 0, page: 1, onPageChange: vi.fn() }}
      />,
    );
    expect(screen.queryByRole("button", { name: /Exporter/ })).not.toBeInTheDocument();
  });
});
