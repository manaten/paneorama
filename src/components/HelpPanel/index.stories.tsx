import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { HelpPanel } from "./index";

const meta: Meta<typeof HelpPanel> = {
  title: "Components/HelpPanel",
  component: HelpPanel,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "#1a1a1a",
        },
        {
          name: "gradient",
          value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the help panel is open",
    },
    onClose: {
      action: "onClose",
      description: "Callback fired when the panel is closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
};

const InteractiveComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <button
        onClick={() => setIsOpen(true)}
        className='px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors'
      >
        Open Help Panel
      </button>
      <HelpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveComponent />,
};
