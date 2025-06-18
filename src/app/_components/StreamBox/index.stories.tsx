import type { Meta, StoryObj } from "@storybook/nextjs";

import { StreamBox } from "./index";

const mockMediaStream = new MediaStream();

const meta: Meta<typeof StreamBox> = {
  title: "Components/StreamBox",
  component: StreamBox,
  parameters: {
    layout: "centered",
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
    onClickSwitchVideo: { action: "switch video clicked" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px", height: "300px", position: "relative" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "stream-1",
    media: mockMediaStream,
    color: "hsl(0, 60%, 80%)",
  },
};

export const WithPastelRed: Story = {
  args: {
    id: "stream-red",
    media: mockMediaStream,
    color: "hsl(0, 60%, 80%)",
  },
};

export const WithPastelBlue: Story = {
  args: {
    id: "stream-blue",
    media: mockMediaStream,
    color: "hsl(240, 60%, 80%)",
  },
};

export const WithPastelGreen: Story = {
  args: {
    id: "stream-green",
    media: mockMediaStream,
    color: "hsl(120, 60%, 80%)",
  },
};

export const WithPastelPurple: Story = {
  args: {
    id: "stream-purple",
    media: mockMediaStream,
    color: "hsl(300, 60%, 80%)",
  },
};

export const MultipleStreams: Story = {
  decorators: [
    () => (
      <div
        style={{
          width: "800px",
          height: "600px",
          position: "relative",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "300px", height: "200px", position: "relative" }}>
          <StreamBox
            id='stream-1'
            media={mockMediaStream}
            color='hsl(0, 60%, 80%)'
          />
        </div>
        <div style={{ width: "300px", height: "200px", position: "relative" }}>
          <StreamBox
            id='stream-2'
            media={mockMediaStream}
            color='hsl(120, 60%, 80%)'
          />
        </div>
        <div style={{ width: "300px", height: "200px", position: "relative" }}>
          <StreamBox
            id='stream-3'
            media={mockMediaStream}
            color='hsl(240, 60%, 80%)'
          />
        </div>
      </div>
    ),
  ],
};
