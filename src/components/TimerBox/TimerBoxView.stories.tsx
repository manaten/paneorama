import type { Meta, StoryObj } from "@storybook/react-vite";

import { TimerBoxView } from "./index";

const meta: Meta<typeof TimerBoxView> = {
  component: TimerBoxView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: {
        type: "color",
      },
    },
    onClickMinus30s: { action: "minus 30s clicked" },
    onClickStartPause: { action: "start/pause clicked" },
    onClickReset: { action: "reset clicked" },
    onClickPlus30s: { action: "plus 30s clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const now = new Date("2025-10-04T09:15:30").getTime();

export const StoppedDefault: Story = {
  args: {
    timerState: {
      targetDuration: 5 * 60 * 1000, // 5分
      pausedElapsed: 0,
      status: "stopped",
    },
    color: "hsl(180, 60%, 80%)",
  },
};

export const StoppedPartial: Story = {
  args: {
    timerState: {
      targetDuration: 5 * 60 * 1000, // 5分
      pausedElapsed: 2 * 60 * 1000 + 30 * 1000, // 2分30秒経過
      status: "stopped",
    },
    color: "hsl(120, 60%, 80%)",
  },
};

export const Running: Story = {
  args: {
    timerState: {
      targetDuration: 5 * 60 * 1000, // 5分
      pausedElapsed: 0,
      status: "running",
      startedAt: now - 1 * 60 * 1000 - 15 * 1000, // 1分15秒前に開始
      currentTime: now,
    },
    color: "hsl(240, 60%, 80%)",
  },
};

export const RunningNearEnd: Story = {
  args: {
    timerState: {
      targetDuration: 5 * 60 * 1000, // 5分
      pausedElapsed: 0,
      status: "running",
      startedAt: now - 4 * 60 * 1000 - 50 * 1000, // 4分50秒前に開始（残り10秒）
      currentTime: now,
    },
    color: "hsl(60, 60%, 80%)",
  },
};

export const RunningOvertime: Story = {
  args: {
    timerState: {
      targetDuration: 5 * 60 * 1000, // 5分
      pausedElapsed: 0,
      status: "running",
      startedAt: now - 5 * 60 * 1000 - 15 * 1000, // 5分15秒前に開始（15秒オーバー）
      currentTime: now,
    },
    color: "hsl(0, 60%, 80%)",
  },
};

export const StoppedOvertime: Story = {
  args: {
    timerState: {
      targetDuration: 3 * 60 * 1000, // 3分
      pausedElapsed: 4 * 60 * 1000 + 23 * 1000, // 4分23秒経過（1分23秒オーバー）
      status: "stopped",
    },
    color: "hsl(320, 60%, 80%)",
  },
};

export const LongDuration: Story = {
  args: {
    timerState: {
      targetDuration: 60 * 60 * 1000, // 60分
      pausedElapsed: 1 * 1000, // 1秒経過（残り59分59秒）
      status: "stopped",
    },
    color: "hsl(300, 60%, 80%)",
  },
};
