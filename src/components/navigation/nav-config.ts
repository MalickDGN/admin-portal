import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, ShoppingBag, Package, Users, Receipt, Settings } from "lucide-react";
import type { Role } from "@services/auth/AuthProvider";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles?: Role[];
  children?: { label: string; path: string }[];
}

// Source unique de vérité pour la sidebar : ajouter un module = ajouter une entrée ici.
export const navConfig: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  {
    label: "E-commerce",
    path: "/ecommerce",
    icon: ShoppingBag,
    children: [
      { label: "Produits", path: "/ecommerce/products" },
      { label: "Commandes", path: "/ecommerce/orders" },
      { label: "Clients", path: "/ecommerce/customers" },
    ],
  },
  { label: "Commandes", path: "/ecommerce/orders", icon: Receipt },
  { label: "Clients", path: "/ecommerce/customers", icon: Users, roles: ["ADMIN", "MANAGER"] },
  { label: "Catalogue", path: "/ecommerce/products", icon: Package },
  { label: "Paramètres", path: "/settings", icon: Settings },
];
