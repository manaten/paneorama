import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClockBox } from "./index";

const meta: Meta<typeof ClockBox> = {
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
    fixedTime: new Date("2025-10-04T14:30:45"),
  },
};
