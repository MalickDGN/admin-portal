import type { OrderStatus } from "@/types/entities";

export const orderStatusConfig: Record<OrderStatus, { label: string; tone: "success" | "warning" | "danger" | "info" }> = {
  pending: { label: "En attente", tone: "info" },
  shipped: { label: "Expédiée", tone: "warning" },
  delivered: { label: "Livrée", tone: "success" },
  cancelled: { label: "Annulée", tone: "danger" },
};
