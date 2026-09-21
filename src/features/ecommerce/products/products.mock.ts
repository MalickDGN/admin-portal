import type { Product } from "@/types/entities";

export const mockProducts: Product[] = [
  { id: "1", name: "Coffret parfum Oud Royal", price: 45000, stock: 24, category: "Parfums" },
  { id: "2", name: "Bougie Ambre & Vanille", price: 12000, stock: 58, category: "Maison" },
  { id: "3", name: "Diffuseur Santal", price: 18500, stock: 12, category: "Maison" },
  { id: "4", name: "Eau de parfum Nuit Blanche", price: 39000, stock: 0, category: "Parfums" },
  { id: "5", name: "Savon artisanal Karité", price: 4500, stock: 130, category: "Soin" },
  { id: "6", name: "Coffret découverte", price: 25000, stock: 41, category: "Parfums" },
];
