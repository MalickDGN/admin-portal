import type { Meta, StoryObj } from "@storybook/react";
import { Bell } from "lucide-react";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Top: Story = {
  render: () => (
    <Tooltip content="Notifications" side="top">
      <button
        type="button"
        style={{ width: 36, height: 36, border: "1px solid var(--color-border)", borderRadius: 8, background: "transparent" }}
      >
        <Bell size={18} />
      </button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip content="Basculer le thème" side="bottom">
      <button
        type="button"
        style={{ width: 36, height: 36, border: "1px solid var(--color-border)", borderRadius: 8, background: "transparent" }}
      >
        <Bell size={18} />
      </button>
    </Tooltip>
  ),
};
