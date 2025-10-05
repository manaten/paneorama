import type { Meta, StoryObj } from "@storybook/react-vite";

import { MemoBox } from "./index";

const meta = {
  component: MemoBox,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className='h-screen w-screen bg-gray-800'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MemoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: "#60a5fa",
  },
};
