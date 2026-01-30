import type { Meta, StoryObj } from "@storybook/react-vite";

import { ImageBox } from "./index";

const meta = {
  component: ImageBox,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ImageBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: "https://picsum.photos/800/600",
    naturalWidth: 800,
    naturalHeight: 600,
    color: "#60a5fa",
  },
};
