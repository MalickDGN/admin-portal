import { Drawer } from "@ui/Drawer/Drawer";
import { Badge } from "@ui/Badge/Badge";
import { Button } from "@ui/Button/Button";
import { orderStatusConfig } from "./order-status";
import type { Order, OrderStatus } from "@/types/entities";

interface OrderDetailDrawerProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "shipped",
  shipped: "delivered",
};

export function OrderDetailDrawer({ order, onClose, onStatusChange }: OrderDetailDrawerProps) {
  if (!order) return null;
  const config = orderStatusConfig[order.status];
  const next = NEXT_STATUS[order.status];

  return (
    <Drawer open={Boolean(order)} onClose={onClose} title={order.reference}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>Client</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{order.customerName}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>Date</p>
          <p style={{ margin: 0 }}>{new Date(order.date).toLocaleDateString("fr-FR")}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>Montant</p>
          <p style={{ margin: 0, fontWeight: 600 }}>{order.amount.toLocaleString("fr-FR")} F</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>Articles</p>
          <p style={{ margin: 0 }}>{order.items}</p>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-muted)" }}>Statut</p>
          <Badge tone={config.tone}>{config.label}</Badge>
        </div>

        {next && order.status !== "cancelled" && (
          <Button onClick={() => onStatusChange(order.id, next)}>
            Marquer comme « {orderStatusConfig[next].label} »
          </Button>
        )}
        {order.status !== "cancelled" && order.status !== "delivered" && (
          <Button variant="outline" onClick={() => onStatusChange(order.id, "cancelled")}>
            Annuler la commande
          </Button>
        )}
      </div>
    </Drawer>
  );
}
