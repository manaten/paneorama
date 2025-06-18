import type { Meta, StoryObj } from "@storybook/react-vite";

import { WelcomeOverlay } from "./index";

const meta: Meta<typeof WelcomeOverlay> = {
  title: "Components/WelcomeOverlay",
  component: WelcomeOverlay,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#000000",
        },
        {
          name: "light",
          value: "#ffffff",
        },
      ],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='relative h-screen w-screen bg-gray-100'>
      <WelcomeOverlay />
    </div>
  ),
};
