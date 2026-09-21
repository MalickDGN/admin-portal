import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    items: [
      { id: "1", title: "Comment créer un produit ?", content: "Via le bouton « Nouveau produit » sur la page Produits." },
      { id: "2", title: "Comment exporter les données ?", content: "Le bouton « Exporter » du DataTable génère un CSV compatible Excel." },
      { id: "3", title: "Comment changer de thème ?", content: "Icône soleil/lune dans le Header." },
    ],
  },
};
