import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { KeyboardShortcuts } from "./index";

const meta: Meta<typeof KeyboardShortcuts> = {
  title: "Components/KeyboardShortcuts",
  component: KeyboardShortcuts,
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
      description: "Whether the shortcuts panel is open",
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

const InteractiveShortcutsComponent = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <div className='text-center space-y-4'>
        <button
          onClick={() => setIsOpen(true)}
          className='px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors'
        >
          Open Keyboard Shortcuts
        </button>
        <p className='text-white/60 text-sm'>
          Or press{" "}
          <kbd className='px-2 py-1 bg-white/10 rounded text-xs font-mono'>
            ?
          </kbd>{" "}
          key
        </p>
      </div>
      <KeyboardShortcuts isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveShortcutsComponent />,
};

const KeyboardTriggerComponent = () => {
  const [message, setMessage] = React.useState("Press ? to open shortcuts");

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "?") {
        setMessage("Shortcuts opened via keyboard!");
      }
      if (event.key === "Escape") {
        setMessage("Press ? to open shortcuts");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-white mb-4'>
          Keyboard Shortcuts Demo
        </h2>
        <p className='text-white/70 mb-6'>{message}</p>
        <div className='space-y-2 text-white/60 text-sm'>
          <p>Try these keys:</p>
          <p>
            <kbd className='px-2 py-1 bg-white/10 rounded text-xs font-mono'>
              ?
            </kbd>{" "}
            - Open shortcuts
          </p>
          <p>
            <kbd className='px-2 py-1 bg-white/10 rounded text-xs font-mono'>
              Esc
            </kbd>{" "}
            - Close shortcuts
          </p>
        </div>
      </div>
      <KeyboardShortcuts isOpen={false} onClose={() => {}} />
    </div>
  );
};

export const KeyboardTrigger: Story = {
  render: () => <KeyboardTriggerComponent />,
};
