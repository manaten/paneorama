import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { StatusIndicator } from "./index";

const meta: Meta<typeof StatusIndicator> = {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
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
    streamCount: {
      control: { type: "number", min: 0, max: 10, step: 1 },
      description: "Number of active streams",
    },
    isCapturing: {
      control: "boolean",
      description: "Whether streams are actively capturing",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NoStreams: Story = {
  args: {
    streamCount: 0,
    isCapturing: false,
  },
  render: (args) => (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <div className='text-white text-center'>
        <h2 className='text-2xl font-bold mb-4'>No Streams</h2>
        <p className='text-white/70'>
          Status indicator is hidden when no streams are active
        </p>
      </div>
      <StatusIndicator {...args} />
    </div>
  ),
};

export const SingleStreamCapturing: Story = {
  args: {
    streamCount: 1,
    isCapturing: true,
  },
};

export const SingleStreamPaused: Story = {
  args: {
    streamCount: 1,
    isCapturing: false,
  },
};

export const MultipleStreamsCapturing: Story = {
  args: {
    streamCount: 3,
    isCapturing: true,
  },
};

export const MultipleStreamsPaused: Story = {
  args: {
    streamCount: 5,
    isCapturing: false,
  },
};

const AnimatedDemoComponent = () => {
  const [streamCount, setStreamCount] = React.useState(1);
  const [isCapturing, setIsCapturing] = React.useState(true);

  // Simulate stream count changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setStreamCount((prev) => {
        const next = prev === 5 ? 1 : prev + 1;
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate capture state changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsCapturing((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center'>
      <div className='text-white text-center'>
        <h2 className='text-2xl font-bold mb-4'>Animated Status Demo</h2>
        <p className='text-white/70 mb-2'>
          Stream count and capture state change automatically
        </p>
        <div className='text-sm text-white/50'>
          <p>
            Current: {streamCount} streams,{" "}
            {isCapturing ? "capturing" : "paused"}
          </p>
        </div>
      </div>
      <StatusIndicator streamCount={streamCount} isCapturing={isCapturing} />
    </div>
  );
};

export const AnimatedDemo: Story = {
  render: () => <AnimatedDemoComponent />,
};

export const AllStates: Story = {
  render: () => (
    <div className='h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8'>
      <h2 className='text-2xl font-bold text-white mb-8 text-center'>
        All Status States
      </h2>
      <div className='grid grid-cols-2 gap-8'>
        <div className='relative h-64 bg-slate-800/50 rounded-lg flex items-center justify-center'>
          <div className='text-white text-center'>
            <h3 className='font-semibold mb-2'>1 Stream - Capturing</h3>
            <StatusIndicator streamCount={1} isCapturing={true} />
          </div>
        </div>

        <div className='relative h-64 bg-slate-800/50 rounded-lg flex items-center justify-center'>
          <div className='text-white text-center'>
            <h3 className='font-semibold mb-2'>1 Stream - Paused</h3>
            <StatusIndicator streamCount={1} isCapturing={false} />
          </div>
        </div>

        <div className='relative h-64 bg-slate-800/50 rounded-lg flex items-center justify-center'>
          <div className='text-white text-center'>
            <h3 className='font-semibold mb-2'>3 Streams - Capturing</h3>
            <StatusIndicator streamCount={3} isCapturing={true} />
          </div>
        </div>

        <div className='relative h-64 bg-slate-800/50 rounded-lg flex items-center justify-center'>
          <div className='text-white text-center'>
            <h3 className='font-semibold mb-2'>5 Streams - Paused</h3>
            <StatusIndicator streamCount={5} isCapturing={false} />
          </div>
        </div>
      </div>
    </div>
  ),
};
