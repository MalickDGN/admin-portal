import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@ui/Card/Card";
import { Button } from "@ui/Button/Button";
import { Badge } from "@ui/Badge/Badge";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable/DataTable";
import { useResourceQuery } from "@/hooks/useResourceQuery";
import { useToast } from "@/components/feedback/Toast/ToastProvider";
import { productsService } from "@services/api/products";
import { ProductFormModal } from "./ProductFormModal";
import type { Product } from "@/types/entities";
import type { ProductFormValues } from "./product-form.schema";

const formatPrice = (value: number) => `${value.toLocaleString("fr-FR")} F`;

export default function ProductsPage() {
  const { show } = useToast();
  const { items: products, isLoading, isError, refetch, create, update, remove } = useResourceQuery<Product>("products", productsService);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>(undefined);

  const columns: DataTableColumn<Product>[] = [
    { key: "name", header: "Produit", accessor: (p) => p.name, sortable: true, sortValue: (p) => p.name },
    { key: "category", header: "Catégorie", accessor: (p) => p.category, sortable: true, sortValue: (p) => p.category },
    { key: "price", header: "Prix", accessor: (p) => formatPrice(p.price), sortable: true, sortValue: (p) => p.price },
    {
      key: "stock",
      header: "Stock",
      accessor: (p) =>
        p.stock === 0 ? (
          <Badge tone="danger">Rupture</Badge>
        ) : p.stock < 15 ? (
          <Badge tone="warning">{p.stock} restants</Badge>
        ) : (
          <Badge tone="success">{p.stock} en stock</Badge>
        ),
      sortable: true,
      sortValue: (p) => p.stock,
      csvValue: (p) => p.stock,
    },
  ];

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setModalOpen(true);
  }

  async function handleDelete(product: Product) {
    await remove(product.id);
    show(`"${product.name}" supprimé`, "info");
  }

  async function handleSubmit(values: ProductFormValues) {
    if (editing) {
      await update(editing.id, values);
      show("Produit mis à jour", "success");
    } else {
      await create(values);
      show("Produit créé", "success");
    }
    setModalOpen(false);
  }

  return (
    <>
      <Card
        title="Catalogue produits"
        noPadding
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} /> Nouveau produit
          </Button>
        }
      >
        <DataTable
          columns={columns}
          data={products}
          getRowId={(p) => p.id}
          searchable
          searchPlaceholder="Rechercher un produit..."
          searchFields={(p) => `${p.name} ${p.category}`}
          selectable
          pageSize={5}
          loading={isLoading}
          error={isError}
          onRetry={refetch}
          exportable
          excelExportable
          exportFileName="produits"
          emptyDescription="Créez votre premier produit avec le bouton ci-dessus."
          rowActions={(p) => (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <Button size="sm" variant="ghost" onClick={() => openEdit(p)} aria-label="Modifier">
                <Pencil size={14} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(p)} aria-label="Supprimer">
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        />
      </Card>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialValues={editing}
      />
    </>
  );
}
