import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card } from "@ui/Card/Card";
import { Button } from "@ui/Button/Button";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable/DataTable";
import { useResourceQuery } from "@/hooks/useResourceQuery";
import { useToast } from "@/components/feedback/Toast/ToastProvider";
import { customersService } from "@services/api/customers";
import { CustomerFormModal } from "./CustomerFormModal";
import type { Customer } from "@/types/entities";
import type { CustomerFormValues } from "./customer-form.schema";

const formatAmount = (value: number) => `${value.toLocaleString("fr-FR")} F`;

// Route protégée (ADMIN, MANAGER) — voir app/router/routes.tsx
export default function CustomersPage() {
  const { show } = useToast();
  const { items: customers, isLoading, isError, refetch, create, update, remove } = useResourceQuery<Customer>("customers", customersService);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | undefined>(undefined);

  const columns: DataTableColumn<Customer>[] = [
    { key: "name", header: "Client", accessor: (c) => c.name, sortable: true, sortValue: (c) => c.name },
    { key: "email", header: "Email", accessor: (c) => c.email, sortable: true, sortValue: (c) => c.email },
    { key: "phone", header: "Téléphone", accessor: (c) => c.phone },
    { key: "orders", header: "Commandes", accessor: (c) => c.ordersCount, sortable: true, sortValue: (c) => c.ordersCount },
    { key: "spent", header: "Total dépensé", accessor: (c) => formatAmount(c.totalSpent), sortable: true, sortValue: (c) => c.totalSpent },
  ];

  function openCreate() {
    setEditing(undefined);
    setModalOpen(true);
  }

  function openEdit(customer: Customer) {
    setEditing(customer);
    setModalOpen(true);
  }

  async function handleDelete(customer: Customer) {
    await remove(customer.id);
    show(`"${customer.name}" supprimé`, "info");
  }

  async function handleSubmit(values: CustomerFormValues) {
    if (editing) {
      await update(editing.id, values);
      show("Client mis à jour", "success");
    } else {
      await create({ ...values, ordersCount: 0, totalSpent: 0 });
      show("Client créé", "success");
    }
    setModalOpen(false);
  }

  return (
    <>
      <Card
        title="Clients"
        noPadding
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} /> Nouveau client
          </Button>
        }
      >
        <DataTable
          columns={columns}
          data={customers}
          getRowId={(c) => c.id}
          searchable
          searchPlaceholder="Rechercher un client..."
          searchFields={(c) => `${c.name} ${c.email}`}
          pageSize={5}
          loading={isLoading}
          error={isError}
          onRetry={refetch}
          exportable
          excelExportable
          exportFileName="clients"
          rowActions={(c) => (
            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
              <Button size="sm" variant="ghost" onClick={() => openEdit(c)} aria-label="Modifier">
                <Pencil size={14} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(c)} aria-label="Supprimer">
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        />
      </Card>

      <CustomerFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialValues={editing} />
    </>
  );
}
