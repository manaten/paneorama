import type { Meta, StoryObj } from "@storybook/react-vite";

import { MemoBoxView } from "./index";

const meta = {
  component: MemoBoxView,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MemoBoxView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    memo: "",
    color: "#60a5fa",
    onMemoChange: () => {},
  },
};

export const WithText: Story = {
  args: {
    memo: "これはサンプルのメモです。\n複数行のテキストも入力できます。",
    color: "#34d399",
    onMemoChange: () => {},
  },
};

export const LongText: Story = {
  args: {
    memo: `長いテキストのサンプルです。
これはプレゼンテーション用のメモボックスです。
複数行にわたる長いテキストを入力することができます。

- 箇条書き
- リスト形式
- なども使えます

スクロールして全文を確認できます。
サイズを変更することで、より多くのテキストを表示できます。`,
    color: "#f87171",
    onMemoChange: () => {},
  },
};
