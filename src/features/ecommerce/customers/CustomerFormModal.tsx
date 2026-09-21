import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@ui/Modal/Modal";
import { Button } from "@ui/Button/Button";
import { FormField } from "@/components/forms/FormField/FormField";
import { customerFormSchema, type CustomerFormValues } from "./customer-form.schema";
import type { Customer } from "@/types/entities";

interface CustomerFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
  initialValues?: Customer;
}

export function CustomerFormModal({ open, onClose, onSubmit, initialValues }: CustomerFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: initialValues
      ? { name: initialValues.name, email: initialValues.email, phone: initialValues.phone }
      : { name: "", email: "", phone: "" },
  });

  function submit(values: CustomerFormValues) {
    onSubmit(values);
    reset();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialValues ? "Modifier le client" : "Nouveau client"}
      footer={
        <>
          <Button variant="outline" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button type="submit" form="customer-form" loading={isSubmitting}>
            Enregistrer
          </Button>
        </>
      }
    >
      <form id="customer-form" onSubmit={handleSubmit(submit)}>
        <FormField label="Nom complet" error={errors.name?.message} {...register("name")} />
        <FormField label="Email" type="email" error={errors.email?.message} {...register("email")} />
        <FormField label="Téléphone" error={errors.phone?.message} {...register("phone")} />
      </form>
    </Modal>
  );
}
