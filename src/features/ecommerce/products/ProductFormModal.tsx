import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@ui/Modal/Modal";
import { Button } from "@ui/Button/Button";
import { Select } from "@ui/Select/Select";
import { FormField } from "@/components/forms/FormField/FormField";
import { productFormSchema, type ProductFormValues } from "./product-form.schema";
import type { Product } from "@/types/entities";

const CATEGORY_OPTIONS = [
  { value: "Parfums", label: "Parfums" },
  { value: "Maison", label: "Maison" },
  { value: "Soin", label: "Soin" },
];

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  initialValues?: Product;
}

// Formulaire standardisé React Hook Form + Zod, réutilisable comme modèle
// pour les autres formulaires métier (commandes, clients...).
// Le champ "Catégorie" illustre comment brancher un composant contrôlé
// (Select) sur RHF via <Controller>, pour tout composant qui n'expose pas
// nativement l'API <input>.
export function ProductFormModal({ open, onClose, onSubmit, initialValues }: ProductFormModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues ?? { name: "", price: 0, stock: 0, category: "" },
  });

  function submit(values: ProductFormValues) {
    onSubmit(values);
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? "Modifier le produit" : "Nouveau produit"}
      footer={
        <>
          <Button variant="outline" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button type="submit" form="product-form" loading={isSubmitting}>
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="product-form" onSubmit={handleSubmit(submit)}>
        <FormField label="Nom du produit" error={errors.name?.message} {...register("name")} />
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              label="Catégorie"
              options={CATEGORY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />
        <FormField label="Prix (F CFA)" type="number" error={errors.price?.message} {...register("price")} />
        <FormField label="Stock" type="number" error={errors.stock?.message} {...register("stock")} />
      </form>
    </Modal>
  );
}
