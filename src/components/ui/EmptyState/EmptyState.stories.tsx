import type { Meta, StoryObj } from "@storybook/react";
import { PackageOpen } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { Button } from "../Button/Button";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: { title: "Aucune donnée" },
};

export const WithDescription: Story = {
  args: { title: "Aucun produit", description: "Créez votre premier produit pour commencer." },
};

export const WithAction: Story = {
  render: () => (
    <EmptyState
      icon={PackageOpen}
      title="Catalogue vide"
      description="Aucun produit n'a encore été ajouté."
      action={<Button size="sm">Nouveau produit</Button>}
    />
  ),
};
