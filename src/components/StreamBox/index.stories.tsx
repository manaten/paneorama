import type { Meta, StoryObj } from "@storybook/react-vite";

import { StreamBox } from "./index";

const mockMediaStream = new MediaStream();

const meta: Meta<typeof StreamBox> = {
  title: "Components/StreamBox",
  component: StreamBox,
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
    onClickSwitchVideo: { action: "switch video clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    media: mockMediaStream,
    color: "hsl(0, 60%, 80%)",
    contentWidth: 640,
    contentHeight: 480,
  },
} as const satisfies Story;

export const WithPastelRed: Story = {
  args: {
    ...Default.args,
    color: "hsl(0, 60%, 80%)",
  },
};

export const WithPastelBlue: Story = {
  args: {
    ...Default.args,
    color: "hsl(240, 44.44444444444444%, 3.5294117647058822%)",
  },
};

export const WithPastelGreen: Story = {
  args: {
    ...Default.args,
    color: "hsl(120, 60%, 80%)",
  },
};

export const WithPastelPurple: Story = {
  args: {
    ...Default.args,
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
          <StreamBox {...Default.args} color='hsl(0, 60%, 80%)' />
        </div>
        <div style={{ width: "300px", height: "200px", position: "relative" }}>
          <StreamBox {...Default.args} color='hsl(120, 60%, 80%)' />
        </div>
        <div style={{ width: "300px", height: "200px", position: "relative" }}>
          <StreamBox {...Default.args} color='hsl(240, 60%, 80%)' />
        </div>
      </div>
    ),
  ],
};
