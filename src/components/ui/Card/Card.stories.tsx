import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { Button } from "../Button/Button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {
  args: {
    title: "Titre de la carte",
    children: "Contenu libre de la carte.",
  },
  render: (args) => <Card {...args} style={{ maxWidth: 360 }} />,
};

export const WithActions: Story = {
  render: () => (
    <Card title="Catalogue produits" actions={<Button size="sm">Nouveau</Button>} style={{ maxWidth: 400 }}>
      Contenu de la carte avec une action dans l'en-tête.
    </Card>
  ),
};
