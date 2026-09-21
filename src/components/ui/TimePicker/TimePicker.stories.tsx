import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimePicker } from "./TimePicker";

const meta: Meta<typeof TimePicker> = {
  title: "UI/TimePicker",
  component: TimePicker,
};
export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Empty: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <TimePicker label="Heure de livraison" value={value} onChange={setValue} />;
  },
};

export const Preselected: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>("14:30");
    return <TimePicker label="Heure de rendez-vous" value={value} onChange={setValue} />;
  },
};

export const FineGrained: Story = {
  name: "Pas de 5 minutes",
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return <TimePicker label="Heure précise" value={value} onChange={setValue} minuteStep={5} />;
  },
};
