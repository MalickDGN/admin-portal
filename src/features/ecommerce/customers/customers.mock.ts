import type { Customer } from "@/types/entities";

export const mockCustomers: Customer[] = [
  { id: "1", name: "Fatou Diop", email: "fatou.diop@example.sn", phone: "+221 77 123 45 67", ordersCount: 8, totalSpent: 340000 },
  { id: "2", name: "Moussa Sarr", email: "moussa.sarr@example.sn", phone: "+221 78 234 56 78", ordersCount: 3, totalSpent: 120000 },
  { id: "3", name: "Aïda Ndiaye", email: "aida.ndiaye@example.sn", phone: "+221 76 345 67 89", ordersCount: 1, totalSpent: 32500 },
  { id: "4", name: "Ibrahima Fall", email: "ibrahima.fall@example.sn", phone: "+221 70 456 78 90", ordersCount: 5, totalSpent: 210000 },
];
