import { useMemo, useState } from "react";
import { Card } from "@ui/Card/Card";
import { Badge } from "@ui/Badge/Badge";
import { DatePicker } from "@ui/DatePicker/DatePicker";
import { Button } from "@ui/Button/Button";
import { DataTable, type DataTableColumn } from "@/components/tables/DataTable/DataTable";
import { useResourceQuery } from "@/hooks/useResourceQuery";
import { useToast } from "@/components/feedback/Toast/ToastProvider";
import { ordersService } from "@services/api/orders";
import { orderStatusConfig } from "./order-status";
import { OrderDetailDrawer } from "./OrderDetailDrawer";
import type { Order, OrderStatus } from "@/types/entities";

const formatAmount = (value: number) => `${value.toLocaleString("fr-FR")} F`;

export default function OrdersPage() {
  const { show } = useToast();
  const { items: orders, isLoading, isError, refetch, update } = useResourceQuery<Order>("orders", ordersService);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sinceDate, setSinceDate] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId) ?? null;
  const filteredOrders = useMemo(
    () => (sinceDate ? orders.filter((o) => o.date >= sinceDate) : orders),
    [orders, sinceDate],
  );

  const columns: DataTableColumn<Order>[] = [
    { key: "reference", header: "Référence", accessor: (o) => o.reference, sortable: true, sortValue: (o) => o.reference },
    { key: "customer", header: "Client", accessor: (o) => o.customerName, sortable: true, sortValue: (o) => o.customerName },
    {
      key: "date",
      header: "Date",
      accessor: (o) => new Date(o.date).toLocaleDateString("fr-FR"),
      sortable: true,
      sortValue: (o) => o.date,
    },
    { key: "amount", header: "Montant", accessor: (o) => formatAmount(o.amount), sortable: true, sortValue: (o) => o.amount },
    {
      key: "status",
      header: "Statut",
      accessor: (o) => <Badge tone={orderStatusConfig[o.status].tone}>{orderStatusConfig[o.status].label}</Badge>,
      sortable: true,
      sortValue: (o) => o.status,
      csvValue: (o) => orderStatusConfig[o.status].label,
    },
  ];

  async function handleStatusChange(id: string, status: OrderStatus) {
    await update(id, { status });
    setSelectedId(null);
    show(`Commande ${status === "cancelled" ? "annulée" : "mise à jour"}`, status === "cancelled" ? "info" : "success");
  }

  return (
    <>
      <Card
        title="Commandes"
        noPadding
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
            <div style={{ marginBottom: 0 }}>
              <DatePicker value={sinceDate} onChange={setSinceDate} placeholder="Depuis le..." />
            </div>
            {sinceDate && (
              <Button size="sm" variant="ghost" onClick={() => setSinceDate(null)}>
                Réinitialiser
              </Button>
            )}
          </div>
        }
      >
        <DataTable
          columns={columns}
          data={filteredOrders}
          getRowId={(o) => o.id}
          searchable
          searchPlaceholder="Rechercher une commande..."
          searchFields={(o) => `${o.reference} ${o.customerName}`}
          pageSize={5}
          loading={isLoading}
          error={isError}
          onRetry={refetch}
          exportable
          excelExportable
          exportFileName="commandes"
          rowActions={(o) => (
            <button
              type="button"
              onClick={() => setSelectedId(o.id)}
              style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              Détails
            </button>
          )}
        />
      </Card>

      <OrderDetailDrawer order={selected} onClose={() => setSelectedId(null)} onStatusChange={handleStatusChange} />
    </>
  );
}
