import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClockBox } from "./index";

const meta: Meta<typeof ClockBox> = {
  title: "Components/ClockBox",
  component: ClockBox,
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#000000",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: {
        type: "color",
      },
    },
    onClickClose: { action: "close clicked" },
    onClickMoveUp: { action: "move up clicked" },
    onClickMoveDown: { action: "move down clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: "hsl(180, 60%, 80%)",
  },
};

export const WithPastelRed: Story = {
  args: {
    color: "hsl(0, 60%, 80%)",
  },
};

export const WithPastelBlue: Story = {
  args: {
    color: "hsl(240, 60%, 80%)",
  },
};

export const WithPastelGreen: Story = {
  args: {
    color: "hsl(120, 60%, 80%)",
  },
};

export const WithPastelPurple: Story = {
  args: {
    color: "hsl(300, 60%, 80%)",
  },
};
