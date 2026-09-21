import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(6, "Numéro de téléphone invalide"),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
