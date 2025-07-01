import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./index";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    iconType: {
      control: {
        type: "select",
      },
      options: [
        "add",
        "close",
        "crop",
        "fullscreen_exit",
        "move_up",
        "move_down",
        "switch_video",
      ],
    },
    iconColor: {
      control: {
        type: "color",
      },
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Add: Story = {
  args: {
    iconType: "add",
  },
};

export const Close: Story = {
  args: {
    iconType: "close",
  },
};

export const MoveUp: Story = {
  args: {
    iconType: "move_up",
  },
};

export const MoveDown: Story = {
  args: {
    iconType: "move_down",
  },
};

export const SwitchVideo: Story = {
  args: {
    iconType: "switch_video",
  },
};

export const Help: Story = {
  args: {
    iconType: "help",
  },
};

export const Crop: Story = {
  args: {
    iconType: "crop",
  },
};

export const FullscreenExit: Story = {
  args: {
    iconType: "fullscreen_exit",
  },
};

export const WithCustomColor: Story = {
  args: {
    iconType: "add",
    iconColor: "#ff6b6b",
  },
};

export const AllButtonTypes: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2 p-4'>
      <Button iconType='add' />
      <Button iconType='close' />
      <Button iconType='crop' />
      <Button iconType='fullscreen_exit' />
      <Button iconType='help' />
      <Button iconType='move_up' />
      <Button iconType='move_down' />
      <Button iconType='switch_video' />
    </div>
  ),
};

export const WithPastelColors: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2 p-4'>
      <Button iconType='add' iconColor='hsl(0, 60%, 80%)' />
      <Button iconType='close' iconColor='hsl(120, 60%, 80%)' />
      <Button iconType='crop' iconColor='hsl(60, 60%, 80%)' />
      <Button iconType='help' iconColor='hsl(180, 60%, 80%)' />
      <Button iconType='move_up' iconColor='hsl(240, 60%, 80%)' />
      <Button iconType='move_down' iconColor='hsl(300, 60%, 80%)' />
      <Button iconType='switch_video' iconColor='hsl(320, 60%, 80%)' />
    </div>
  ),
};
