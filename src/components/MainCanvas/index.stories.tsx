import type { Meta, StoryObj } from "@storybook/react-vite";

import { MainCanvas } from "./index";
import { StreamBox } from "../StreamBox";

const mockMediaStream = new MediaStream();

const meta: Meta<typeof MainCanvas> = {
  title: "Components/MainCanvas",
  component: MainCanvas,
  parameters: {
    layout: "fullscreen",
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
    onClickAdd: { action: "add clicked" },
    isEmpty: {
      control: {
        type: "boolean",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    isEmpty: true,
  },
};

export const WithOneStream: Story = {
  args: {
    isEmpty: false,
  },
  render: (args) => (
    <MainCanvas {...args}>
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "100px",
          width: "300px",
          height: "200px",
        }}
      >
        <StreamBox
          id='stream-1'
          media={mockMediaStream}
          color='hsl(0, 60%, 80%)'
        />
      </div>
    </MainCanvas>
  ),
};

export const WithMultipleStreams: Story = {
  args: {
    isEmpty: false,
  },
  render: (args) => (
    <MainCanvas {...args}>
      <div
        style={{
          position: "absolute",
          top: "50px",
          left: "50px",
          width: "250px",
          height: "150px",
          zIndex: 3,
        }}
      >
        <StreamBox
          id='stream-1'
          media={mockMediaStream}
          color='hsl(0, 60%, 80%)'
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "150px",
          left: "300px",
          width: "300px",
          height: "200px",
          zIndex: 2,
        }}
      >
        <StreamBox
          id='stream-2'
          media={mockMediaStream}
          color='hsl(120, 60%, 80%)'
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: "300px",
          left: "100px",
          width: "200px",
          height: "150px",
          zIndex: 1,
        }}
      >
        <StreamBox
          id='stream-3'
          media={mockMediaStream}
          color='hsl(240, 60%, 80%)'
        />
      </div>
    </MainCanvas>
  ),
};
