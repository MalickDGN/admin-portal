import type { Order } from "@/types/entities";

export const mockOrders: Order[] = [
  { id: "1", reference: "CMD-1042", customerName: "Fatou Diop", date: "2026-09-10", amount: 45000, status: "delivered", items: 2 },
  { id: "2", reference: "CMD-1043", customerName: "Moussa Sarr", date: "2026-09-12", amount: 120000, status: "shipped", items: 4 },
  { id: "3", reference: "CMD-1044", customerName: "Aïda Ndiaye", date: "2026-09-13", amount: 32500, status: "cancelled", items: 1 },
  { id: "4", reference: "CMD-1045", customerName: "Ibrahima Fall", date: "2026-09-14", amount: 78000, status: "delivered", items: 3 },
  { id: "5", reference: "CMD-1046", customerName: "Khady Sow", date: "2026-09-15", amount: 15500, status: "pending", items: 1 },
  { id: "6", reference: "CMD-1047", customerName: "Ousmane Ba", date: "2026-09-16", amount: 62000, status: "pending", items: 2 },
];
