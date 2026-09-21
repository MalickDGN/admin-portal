import { describe, expect, it } from "vitest";
import { productFormSchema } from "./product-form.schema";

describe("productFormSchema", () => {
  it("accepte des valeurs valides", () => {
    const result = productFormSchema.safeParse({ name: "Bougie", price: 12000, stock: 10, category: "Maison" });
    expect(result.success).toBe(true);
  });

  it("rejette un nom trop court", () => {
    const result = productFormSchema.safeParse({ name: "B", price: 12000, stock: 10, category: "Maison" });
    expect(result.success).toBe(false);
  });

  it("rejette un prix négatif ou nul", () => {
    const result = productFormSchema.safeParse({ name: "Bougie", price: 0, stock: 10, category: "Maison" });
    expect(result.success).toBe(false);
  });

  it("rejette un stock négatif", () => {
    const result = productFormSchema.safeParse({ name: "Bougie", price: 12000, stock: -1, category: "Maison" });
    expect(result.success).toBe(false);
  });

  it("rejette une catégorie manquante", () => {
    const result = productFormSchema.safeParse({ name: "Bougie", price: 12000, stock: 10, category: "" });
    expect(result.success).toBe(false);
  });
});
