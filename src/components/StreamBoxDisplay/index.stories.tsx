import type { Meta, StoryObj } from "@storybook/react-vite";

import { StreamBoxDisplay } from "./index";
import { StreamBoxData } from "../../types/streamBox";

const meta: Meta<typeof StreamBoxDisplay> = {
  title: "Components/StreamBoxDisplay",
  component: StreamBoxDisplay,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "StreamBoxの純粋表示コンポーネント。操作機能なし、表示のみ。",
      },
    },
  },
  argTypes: {
    data: {
      description: "StreamBoxの初期データモデル",
    },
    children: {
      description: "表示するコンテンツ",
    },
    mode: {
      control: "radio",
      options: ["resize", "crop"],
      description: "操作モード",
    },
    borderColor: {
      control: "color",
      description: "ボーダーの色",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ベースとなるデータ
const baseData: StreamBoxData = {
  containerPosition: { x: 50, y: 50 },
  containerSize: { width: 400, height: 300 },
  cropRect: { x: 0, y: 0, width: 400, height: 300 },
};

// クロッピングパターン

// サンプルSVGグリッドコンポーネント（videoタグと同じ挙動）
const TestGrid = () => (
  <svg
    width='400'
    height='300'
    viewBox='0 0 400 300'
    style={{ width: "100%", height: "100%" }}
  >
    {/* グラデーション背景 */}
    <defs>
      <linearGradient id='bg-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#3b82f6' />
        <stop offset='100%' stopColor='#8b5cf6' />
      </linearGradient>
    </defs>
    <rect width='400' height='300' fill='url(#bg-gradient)' />
    {/* グリッドライン */}
    <g stroke='white' strokeWidth='1' opacity='0.5'>
      {/* 縦線 */}
      {Array.from({ length: 22 }).map((_, i) => (
        <line key={`v-${i}`} x1={i * 25} y1='0' x2={i * 25} y2='300' />
      ))}
      {/* 横線 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`h-${i}`} x1='0' y1={i * 25} x2='400' y2={i * 25} />
      ))}
    </g>
    {/* 中央マーカー（赤） */}
    <circle
      cx='200'
      cy='150'
      r='8'
      fill='#ef4444'
      stroke='white'
      strokeWidth='2'
    />
    {/* コーナーマーカー */}
    <circle
      cx='20'
      cy='20'
      r='6'
      fill='#fbbf24'
      stroke='white'
      strokeWidth='1'
    />{" "}
    {/* 左上：黄 */}
    <circle
      cx='380'
      cy='20'
      r='6'
      fill='#22c55e'
      stroke='white'
      strokeWidth='1'
    />{" "}
    {/* 右上：緑 */}
    <circle
      cx='20'
      cy='280'
      r='6'
      fill='#f97316'
      stroke='white'
      strokeWidth='1'
    />{" "}
    {/* 左下：橙 */}
    <circle
      cx='380'
      cy='280'
      r='6'
      fill='#ec4899'
      stroke='white'
      strokeWidth='1'
    />{" "}
    {/* 右下：桃 */}
    {/* 座標ラベル */}
    <text x='5' y='15' fill='white' fontSize='12' fontFamily='monospace'>
      0,0
    </text>
    <text x='360' y='15' fill='white' fontSize='12' fontFamily='monospace'>
      400,0
    </text>
    <text x='5' y='295' fill='white' fontSize='12' fontFamily='monospace'>
      0,300
    </text>
    <text x='350' y='295' fill='white' fontSize='12' fontFamily='monospace'>
      400,300
    </text>
    {/* 中心線（十字） */}
    <g stroke='#ef4444' strokeWidth='2' opacity='0.7'>
      <line x1='200' y1='140' x2='200' y2='160' />
      <line x1='190' y1='150' x2='210' y2='150' />
    </g>
    {/* 追加の参考点（4分割点） */}
    <g fill='#38bdf8' stroke='white' strokeWidth='1'>
      <circle cx='100' cy='75' r='3' /> {/* 左上4分の1 */}
      <circle cx='300' cy='75' r='3' /> {/* 右上4分の1 */}
      <circle cx='100' cy='225' r='3' /> {/* 左下4分の1 */}
      <circle cx='300' cy='225' r='3' /> {/* 右下4分の1 */}
    </g>
  </svg>
);

export const Default: Story = {
  args: {
    data: baseData,
    borderColor: "#3b82f6",
    children: <TestGrid />,
  },
};

export const Interactive: Story = {
  args: {
    data: baseData,
    mode: "resize",
    borderColor: "#3b82f6",
    children: <TestGrid />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "インタラクティブモード。ドラッグで移動、ハンドルでリサイズが可能。",
      },
    },
  },
};

export const InteractiveCrop: Story = {
  args: {
    data: baseData,
    mode: "crop",
    borderColor: "#10b981",
    children: <TestGrid />,
  },
  parameters: {
    docs: {
      description: {
        story: "クロップモード。ドラッグでパン、ハンドルでズームが可能。",
      },
    },
  },
};

export const CroppedCenter: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: 100, y: 75, width: 200, height: 150 }, // 中央部分をクロップ
    },
    children: <TestGrid />,
    borderColor: "#10b981",
  },
  parameters: {
    docs: {
      description: {
        story:
          "ソースの中央部分(100,75から200x150)をクロップして表示。赤い丸が中央に表示されるはず",
      },
    },
  },
};

export const CroppedTopLeft: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: 0, y: 0, width: 200, height: 150 }, // 左上をクロップ
    },
    children: <TestGrid />,
    borderColor: "#f59e0b",
  },
  parameters: {
    docs: {
      description: {
        story:
          "ソースの左上部分(0,0から200x150)をクロップして表示。黄色い丸が左上に表示されるはず",
      },
    },
  },
};

export const CroppedBottomRight: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: 200, y: 150, width: 200, height: 150 }, // 右下をクロップ
    },
    children: <TestGrid />,
    borderColor: "#ef4444",
  },
  parameters: {
    docs: {
      description: {
        story:
          "ソースの右下部分(200,150から200x150)をクロップして表示。ピンクの丸が左上に表示されるはず",
      },
    },
  },
};

// ズームパターン

export const ZoomedIn: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: 150, y: 112.5, width: 100, height: 75 }, // 中央付近の小さい範囲
    },
    children: <TestGrid />,
    borderColor: "#8b5cf6",
  },
  parameters: {
    docs: {
      description: {
        story:
          "中央付近の小さいcropRect(100x75)でズームイン。赤い丸が拡大されて表示されるはず",
      },
    },
  },
};

export const ZoomedOut: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: -100, y: -75, width: 600, height: 450 }, // 大きい範囲 = ズームアウト
    },
    children: <TestGrid />,
    borderColor: "#06b6d4",
  },
  parameters: {
    docs: {
      description: {
        story:
          "大きいcropRect(600x450)でズームアウト。グリッドが縮小されて表示されるはず",
      },
    },
  },
};

// パンパターン

export const PannedLeft: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: -50, y: 0, width: 400, height: 300 }, // 左にパン
    },
    children: <TestGrid />,
    borderColor: "#f97316",
  },
  parameters: {
    docs: {
      description: {
        story:
          "cropRect.x = -50で左方向にパン。グリッドが右にシフトして表示されるはず",
      },
    },
  },
};

export const PannedUp: Story = {
  args: {
    data: {
      ...baseData,
      cropRect: { x: 0, y: -50, width: 400, height: 300 }, // 上にパン
    },
    children: <TestGrid />,
    borderColor: "#84cc16",
  },
  parameters: {
    docs: {
      description: {
        story:
          "cropRect.y = -50で上方向にパン。グリッドが下にシフトして表示されるはず",
      },
    },
  },
};

// サイズバリエーション

export const SmallContainer: Story = {
  args: {
    data: {
      containerPosition: { x: 50, y: 50 },
      containerSize: { width: 200, height: 150 },
      cropRect: { x: 0, y: 0, width: 400, height: 300 },
    },
    children: <TestGrid />,
    borderColor: "#ec4899",
  },
  parameters: {
    docs: {
      description: {
        story: "小さいコンテナ(200x150)に通常のcropRect。内接リサイズで表示",
      },
    },
  },
};

export const LargeContainer: Story = {
  args: {
    data: {
      containerPosition: { x: 50, y: 50 },
      containerSize: { width: 600, height: 450 },
      cropRect: { x: 0, y: 0, width: 400, height: 300 },
    },
    children: <TestGrid />,
    borderColor: "#6366f1",
  },
  parameters: {
    docs: {
      description: {
        story: "大きいコンテナ(600x450)に通常のcropRect。内接リサイズで表示",
      },
    },
  },
};

// 複合パターン

export const ComplexTransform: Story = {
  args: {
    data: {
      containerPosition: { x: 100, y: 100 },
      containerSize: { width: 300, height: 200 },
      cropRect: { x: 125, y: 125, width: 150, height: 100 }, // パン + ズーム
    },
    children: <TestGrid />,
    borderColor: "#be185d",
  },
  parameters: {
    docs: {
      description: {
        story:
          "パン(125,125) + ズーム(150x100) + 異なるコンテナサイズの複合変換。中央付近が拡大表示されるはず",
      },
    },
  },
};
