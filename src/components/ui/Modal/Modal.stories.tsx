import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../Button/Button";

const meta: Meta<typeof Modal> = {
  title: "UI/Modal",
  component: Modal,
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Ouvrir la modale</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirmer l'action"
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => setOpen(false)}>Confirmer</Button>
            </>
          }
        >
          Contenu de la modale — formulaires, confirmations, détails.
        </Modal>
      </>
    );
  },
};
