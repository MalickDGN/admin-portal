import type { Meta, StoryObj } from "@storybook/react";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "UI/ErrorState",
  component: ErrorState,
};
export default meta;

type Story = StoryObj<typeof ErrorState>;

export const Default: Story = { args: {} };

export const WithRetry: Story = {
  args: { onRetry: () => alert("Nouvelle tentative...") },
};

export const CustomMessage: Story = {
  args: {
    title: "Impossible de charger les commandes",
    description: "Vérifiez votre connexion et réessayez.",
    onRetry: () => alert("Nouvelle tentative..."),
  },
};
