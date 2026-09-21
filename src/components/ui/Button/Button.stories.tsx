import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "outline", "ghost", "danger"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Enregistrer", variant: "primary" } };
export const Secondary: Story = { args: { children: "Secondaire", variant: "secondary" } };
export const Outline: Story = { args: { children: "Annuler", variant: "outline" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Danger: Story = { args: { children: "Supprimer", variant: "danger" } };
export const Loading: Story = { args: { children: "Enregistrement...", loading: true } };
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus size={16} /> Nouveau produit
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
