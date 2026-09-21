import type { Meta, StoryObj } from "@storybook/react";
import { DollarSign } from "lucide-react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "UI/StatCard",
  component: StatCard,
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Positive: Story = {
  args: { title: "Revenu", value: "125 000 €", trend: "+12.5%", trendType: "positive", icon: <DollarSign size={18} /> },
};
export const Negative: Story = {
  args: { title: "Clients", value: "892", trend: "-1.2%", trendType: "negative" },
};
export const Neutral: Story = {
  args: { title: "Produits", value: "214", trend: "stable", trendType: "neutral" },
};
