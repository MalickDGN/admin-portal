export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  date: string;
  amount: number;
  status: OrderStatus;
  items: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
}
