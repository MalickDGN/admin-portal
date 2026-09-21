import type { Meta, StoryObj } from "@storybook/react";
import { Popover } from "./Popover";
import { Button } from "../Button/Button";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover
      trigger={({ onClick, ref }) => (
        <Button ref={ref as never} onClick={onClick} variant="outline">
          Ouvrir le popover
        </Button>
      )}
    >
      <div style={{ padding: 16, width: 220 }}>
        <p style={{ margin: 0, fontSize: 14 }}>Contenu libre : filtres, mini-formulaire, menu...</p>
      </div>
    </Popover>
  ),
};
