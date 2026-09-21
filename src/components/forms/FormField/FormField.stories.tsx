import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Forms/FormField",
  component: FormField,
};
export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <FormField label="Nom du produit" value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};

export const WithError: Story = {
  render: () => {
    const [value, setValue] = useState("B");
    return (
      <FormField
        label="Nom du produit"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        error="Le nom doit contenir au moins 2 caractères"
      />
    );
  },
};

export const Number: Story = {
  render: () => {
    const [value, setValue] = useState("12000");
    return <FormField label="Prix (F CFA)" type="number" value={value} onChange={(e) => setValue(e.target.value)} />;
  },
};
