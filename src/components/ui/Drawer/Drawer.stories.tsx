import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { Button } from "../Button/Button";
import { Badge } from "../Badge/Badge";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
};
export default meta;

type Story = StoryObj<typeof Drawer>;

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Voir le détail</Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="CMD-1046">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ margin: 0 }}>Client : Khady Sow</p>
            <p style={{ margin: 0 }}>Montant : 15 500 F</p>
            <Badge tone="info">En attente</Badge>
          </div>
        </Drawer>
      </>
    );
  },
};
