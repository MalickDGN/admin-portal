import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  argTypes: {
    tone: { control: "select", options: ["primary", "success", "warning", "danger", "info", "neutral"] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { tone: "neutral", children: "Neutre" } };

export const AllTones: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Badge tone="primary">Primary</Badge>
      <Badge tone="success">Livrée</Badge>
      <Badge tone="warning">En cours</Badge>
      <Badge tone="danger">Rupture</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="neutral">Neutre</Badge>
    </div>
  ),
};
