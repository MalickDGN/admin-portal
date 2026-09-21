import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DataTable, type DataTableColumn } from "./DataTable";
import { usePaginatedResourceQuery } from "@/hooks/usePaginatedResourceQuery";
import { createResourceService } from "@services/api/createResource";
import { Badge } from "@ui/Badge/Badge";

interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

function generateProducts(count: number): DemoProduct[] {
  const categories = ["Parfums", "Maison", "Soin"];
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: `Produit démo ${i + 1}`,
    category: categories[i % categories.length],
    price: 1000 + ((i * 137) % 50000),
    stock: (i * 7) % 60,
  }));
}

// Ressource dédiée à la démo, isolée du store "products" réel de l'application.
const demoService = createResourceService<DemoProduct>("storybook-demo-large-catalog", generateProducts(120));

const columns: DataTableColumn<DemoProduct>[] = [
  { key: "name", header: "Produit", accessor: (p) => p.name, sortable: true },
  { key: "category", header: "Catégorie", accessor: (p) => p.category, sortable: true },
  { key: "price", header: "Prix", accessor: (p) => `${p.price.toLocaleString("fr-FR")} F`, sortable: true },
  {
    key: "stock",
    header: "Stock",
    accessor: (p) => (p.stock === 0 ? <Badge tone="danger">Rupture</Badge> : <Badge tone="success">{p.stock} en stock</Badge>),
    sortable: true,
  },
];

function ServerPaginationDemo() {
  const { items, total, isLoading, page, setPage, query, setQuery, sortKey, sortDir, setSort } = usePaginatedResourceQuery(
    "storybook-demo-large-catalog",
    demoService,
    { pageSize: 10, searchFields: (p) => `${p.name} ${p.category}` },
  );

  return (
    <DataTable
      columns={columns}
      data={items}
      getRowId={(p) => p.id}
      searchable
      searchPlaceholder="Rechercher parmi 120 produits (recherche + tri + pagination côté serveur)..."
      loading={isLoading}
      pageSize={10}
      server={{
        totalCount: total,
        page,
        onPageChange: setPage,
        query,
        onQueryChange: setQuery,
        sortKey: (sortKey as string) ?? null,
        sortDir: sortDir ?? null,
        onSortChange: (key, dir) => setSort((key as keyof DemoProduct) ?? undefined, dir ?? undefined),
      }}
    />
  );
}

const queryClient = new QueryClient();

const meta: Meta<typeof DataTable> = {
  title: "Tables/DataTable (mode serveur)",
  parameters: {
    docs: {
      description: {
        component:
          "Démonstration du mode `server` : recherche, tri et pagination délégués à `usePaginatedResourceQuery`, " +
          "sur un catalogue synthétique de 120 produits. Chaque interaction déclenche un aller-retour simulé " +
          "(latence ~300ms, voir mockStore.ts) — voir ARCHITECTURE.md pour l'adopter sur un module à gros volume.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DataTable>;

export const ServerPagination: Story = {
  decorators: [(Story) => <QueryClientProvider client={queryClient}><Story /></QueryClientProvider>],
  render: () => <ServerPaginationDemo />,
};
