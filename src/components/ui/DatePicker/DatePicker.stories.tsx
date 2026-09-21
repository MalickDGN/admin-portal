import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "./DatePicker";

const meta: Meta<typeof DatePicker> = {
  title: "UI/DatePicker",
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <DatePicker label="Depuis le..." value={value} onChange={setValue} />;
  },
};

export const Preselected: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("2026-09-15");
    return <DatePicker label="Date de commande" value={value} onChange={setValue} />;
  },
};
