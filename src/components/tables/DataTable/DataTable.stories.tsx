import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type DataTableColumn } from "./DataTable";
import { Badge } from "@ui/Badge/Badge";

interface DemoProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

const demoData: DemoProduct[] = [
  { id: "1", name: "Coffret parfum Oud Royal", category: "Parfums", price: 45000, stock: 24 },
  { id: "2", name: "Bougie Ambre & Vanille", category: "Maison", price: 12000, stock: 58 },
  { id: "3", name: "Diffuseur Santal", category: "Maison", price: 18500, stock: 12 },
  { id: "4", name: "Eau de parfum Nuit Blanche", category: "Parfums", price: 39000, stock: 0 },
  { id: "5", name: "Savon artisanal Karité", category: "Soin", price: 4500, stock: 130 },
  { id: "6", name: "Coffret découverte", category: "Parfums", price: 25000, stock: 41 },
  { id: "7", name: "Huile de massage Argan", category: "Soin", price: 8500, stock: 22 },
];

const columns: DataTableColumn<DemoProduct>[] = [
  { key: "name", header: "Produit", accessor: (p) => p.name, sortable: true, sortValue: (p) => p.name },
  { key: "category", header: "Catégorie", accessor: (p) => p.category, sortable: true, sortValue: (p) => p.category },
  {
    key: "price",
    header: "Prix",
    accessor: (p) => `${p.price.toLocaleString("fr-FR")} F`,
    sortable: true,
    sortValue: (p) => p.price,
  },
  {
    key: "stock",
    header: "Stock",
    accessor: (p) => (p.stock === 0 ? <Badge tone="danger">Rupture</Badge> : <Badge tone="success">{p.stock} en stock</Badge>),
    sortable: true,
    sortValue: (p) => p.stock,
    csvValue: (p) => p.stock,
  },
];

const meta: Meta<typeof DataTable> = {
  title: "Tables/DataTable",
  component: DataTable,
};
export default meta;

type Story = StoryObj<typeof DataTable<DemoProduct>>;

export const Basic: Story = {
  render: () => <DataTable columns={columns} data={demoData} getRowId={(p) => p.id} pageSize={4} />,
};

export const WithSearchSelectionAndExport: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={demoData}
      getRowId={(p) => p.id}
      searchable
      searchPlaceholder="Rechercher un produit..."
      selectable
      exportable
      exportFileName="demo-produits"
      pageSize={4}
    />
  ),
};

export const Loading: Story = {
  render: () => <DataTable columns={columns} data={[]} getRowId={(p) => p.id} loading />,
};

export const ErrorWithRetry: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      getRowId={(p) => p.id}
      error
      errorLabel="Impossible de charger les produits"
      onRetry={() => alert("Nouvelle tentative...")}
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      getRowId={(p) => p.id}
      emptyLabel="Aucun produit trouvé"
      emptyDescription="Créez votre premier produit pour commencer."
    />
  ),
};
