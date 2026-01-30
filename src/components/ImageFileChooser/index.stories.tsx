import type { Meta, StoryObj } from "@storybook/react-vite";

import { ImageFileChooser } from "./index";

const meta = {
  component: ImageFileChooser,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    onImageChoose: { action: "imageChosen" },
  },
} satisfies Meta<typeof ImageFileChooser>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onImageChoose: () => {},
  },
};
