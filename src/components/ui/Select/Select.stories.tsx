import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";
import { MultiSelect } from "./MultiSelect";

const OPTIONS = [
  { value: "parfums", label: "Parfums" },
  { value: "maison", label: "Maison" },
  { value: "soin", label: "Soin" },
];

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <Select label="Catégorie" options={OPTIONS} value={value} onChange={setValue} />;
  },
};

export const MultiSelectStory: Story = {
  name: "MultiSelect",
  render: () => {
    const [values, setValues] = useState<string[]>(["parfums"]);
    return <MultiSelect label="Catégories" options={OPTIONS} values={values} onChange={setValues} />;
  },
};
