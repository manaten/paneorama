import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClockBoxView } from "./index";

const meta: Meta<typeof ClockBoxView> = {
  title: "Components/ClockBoxView",
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

export const Midnight: Story = {
  args: {
    currentTime: new Date("2025-10-05T00:00:00"),
    color: "hsl(0, 60%, 80%)",
  },
};

export const Noon: Story = {
  args: {
    currentTime: new Date("2025-10-04T12:00:00"),
    color: "hsl(120, 60%, 80%)",
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

export const AllTimes: Story = {
  render: () => (
    <div className='flex flex-col gap-4 p-4'>
      <div className='text-sm font-bold'>Morning (9:15)</div>
      <ClockBoxView
        currentTime={new Date("2025-10-04T09:15:30")}
        color='hsl(60, 60%, 80%)'
      />

      <div className='text-sm font-bold'>Noon (12:00)</div>
      <ClockBoxView
        currentTime={new Date("2025-10-04T12:00:00")}
        color='hsl(120, 60%, 80%)'
      />

      <div className='text-sm font-bold'>Afternoon (14:30)</div>
      <ClockBoxView
        currentTime={new Date("2025-10-04T14:30:45")}
        color='hsl(180, 60%, 80%)'
      />

      <div className='text-sm font-bold'>Evening (18:45)</div>
      <ClockBoxView
        currentTime={new Date("2025-10-04T18:45:10")}
        color='hsl(240, 60%, 80%)'
      />

      <div className='text-sm font-bold'>Midnight (0:00)</div>
      <ClockBoxView
        currentTime={new Date("2025-10-05T00:00:00")}
        color='hsl(0, 60%, 80%)'
      />
    </div>
  ),
};

export const DifferentColors: Story = {
  render: () => (
    <div className='flex flex-col gap-4 p-4'>
      <ClockBoxView
        currentTime={new Date("2025-10-04T14:30:45")}
        color='hsl(0, 60%, 80%)'
      />
      <ClockBoxView
        currentTime={new Date("2025-10-04T14:30:45")}
        color='hsl(120, 60%, 80%)'
      />
      <ClockBoxView
        currentTime={new Date("2025-10-04T14:30:45")}
        color='hsl(240, 60%, 80%)'
      />
      <ClockBoxView
        currentTime={new Date("2025-10-04T14:30:45")}
        color='hsl(300, 60%, 80%)'
      />
    </div>
  ),
};

export const NullState: Story = {
  args: {
    currentTime: null,
    color: "hsl(180, 60%, 80%)",
  },
};
