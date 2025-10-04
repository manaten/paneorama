import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClockBoxView } from "./index";

const meta: Meta<typeof ClockBoxView> = {
  component: ClockBoxView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    currentTime: {
      control: {
        type: "date",
      },
    },
    color: {
      control: {
        type: "color",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentTime: new Date("2025-10-04T14:30:45"),
    color: "hsl(180, 60%, 80%)",
  },
};

export const Morning: Story = {
  args: {
    currentTime: new Date("2025-10-04T09:15:30"),
    color: "hsl(60, 60%, 80%)",
  },
};

export const Evening: Story = {
  args: {
    currentTime: new Date("2025-10-04T18:45:10"),
    color: "hsl(240, 60%, 80%)",
  },
};

export const YearEnd: Story = {
  args: {
    currentTime: new Date("2025-12-31T23:59:59"),
    color: "hsl(300, 60%, 80%)",
  },
};

export const NewYear: Story = {
  args: {
    currentTime: new Date("2025-01-01T01:23:45"),
    color: "hsl(320, 60%, 80%)",
  },
};

export const NullState: Story = {
  args: {
    currentTime: null,
    color: "hsl(180, 60%, 80%)",
  },
};
