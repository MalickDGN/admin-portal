import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "info", label: "Informations", content: <p>Contenu de l'onglet Informations.</p> },
      { id: "history", label: "Historique", content: <p>Contenu de l'onglet Historique.</p> },
      { id: "settings", label: "Paramètres", content: <p>Contenu de l'onglet Paramètres.</p> },
    ],
  },
};
