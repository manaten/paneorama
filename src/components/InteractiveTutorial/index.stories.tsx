import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { InteractiveTutorial } from "./index";

const meta: Meta<typeof InteractiveTutorial> = {
  title: "Components/InteractiveTutorial",
  component: InteractiveTutorial,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "gradient",
      values: [
        {
          name: "gradient",
          value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isEmpty: {
      control: "boolean",
      description:
        "Whether the canvas is empty (triggers tutorial for first-time users)",
    },
    onClose: {
      action: "onClose",
      description: "Callback fired when the tutorial is closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const FirstTimeUserComponent = (args: {
  isEmpty: boolean;
  onClose: () => void;
}) => {
  // Clear tutorial seen flag for demo
  React.useEffect(() => {
    localStorage.removeItem("paneorama-tutorial-seen");
  }, []);

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800'>
      <InteractiveTutorial {...args} />
    </div>
  );
};

export const FirstTimeUser: Story = {
  args: {
    isEmpty: true,
    onClose: () => {},
  },
  render: (args) => <FirstTimeUserComponent {...args} />,
};

const ReturningUserComponent = (args: {
  isEmpty: boolean;
  onClose: () => void;
}) => {
  // Set tutorial as seen for demo
  React.useEffect(() => {
    localStorage.setItem("paneorama-tutorial-seen", "true");
  }, []);

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <div className='text-white text-center'>
        <h2 className='text-2xl font-bold mb-4'>Welcome Back!</h2>
        <p className='text-white/70'>Tutorial won't show for returning users</p>
      </div>
      <InteractiveTutorial {...args} />
    </div>
  );
};

export const ReturningUser: Story = {
  args: {
    isEmpty: true,
    onClose: () => {},
  },
  render: (args) => <ReturningUserComponent {...args} />,
};

export const NotEmpty: Story = {
  args: {
    isEmpty: false,
    onClose: () => {},
  },
  render: (args) => (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <div className='text-white text-center'>
        <h2 className='text-2xl font-bold mb-4'>Canvas Not Empty</h2>
        <p className='text-white/70'>
          Tutorial only shows when canvas is empty
        </p>
      </div>
      <InteractiveTutorial {...args} />
    </div>
  ),
};

const ManualTriggerComponent = () => {
  const [showTutorial, setShowTutorial] = React.useState(false);

  // Clear tutorial flag when manually triggering
  const handleShow = () => {
    localStorage.removeItem("paneorama-tutorial-seen");
    setShowTutorial(true);
  };

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <button
        onClick={handleShow}
        className='px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors'
      >
        Start Tutorial
      </button>
      {showTutorial && (
        <InteractiveTutorial
          isEmpty={true}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
};

export const ManualTrigger: Story = {
  render: () => <ManualTriggerComponent />,
};
