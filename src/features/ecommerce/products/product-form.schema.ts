import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  price: z.coerce.number().positive("Le prix doit être positif"),
  stock: z.coerce.number().int().min(0, "Le stock ne peut pas être négatif"),
  category: z.string().min(1, "Catégorie requise"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
