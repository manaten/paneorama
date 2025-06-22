import { FC, ReactNode } from "react";

import { StreamBoxData } from "../../types/streamBox";
import { calculateDisplayProperties } from "../../utils/streamBoxDisplay";

interface Props {
  /**
   * StreamBoxのデータモデル
   */
  data: StreamBoxData;

  /**
   * 表示するコンテンツ
   */
  children: ReactNode;

  /**
   * ボーダーカラー（オプション）
   */
  borderColor?: string;

  /**
   * ホバー状態（オプション）
   */
  isHovered?: boolean;
}

/**
 * コンテンツの変形・クロッピング表示コンポーネント
 *
 * StreamBoxDataに基づいて、コンテナサイズとクロッピング変形を適用してコンテンツを表示します。
 * 操作機能は一切含まず、表示のみに特化しています。
 */
export const TransformDisplay: FC<Props> = ({
  data,
  children,
  borderColor = "#3b82f6",
  isHovered = false,
}) => {
  // 表示用プロパティを計算
  const displayProps = calculateDisplayProperties(data);

  return (
    <div className='absolute select-none' style={displayProps.containerStyle}>
      <div className='relative flex size-full items-center justify-center bg-black overflow-hidden'>
        {/* コンテンツ */}
        <div
          className='size-full pointer-events-none'
          style={displayProps.videoStyle}
        >
          {children}
        </div>

        {/* ボーダー */}
        <div
          className='pointer-events-none absolute inset-0 border-4 transition-opacity duration-200'
          style={{
            borderColor,
            opacity: isHovered ? 1 : 0.3,
          }}
        />

        {/* データ情報表示（デバッグ用） */}
        <div className='absolute bottom-1 left-1 text-xs text-white/70 bg-black/50 px-1 rounded'>
          Container: {data.containerSize.width}×{data.containerSize.height}
          <br />
          Crop: {data.cropRect.x},{data.cropRect.y} {data.cropRect.width}×
          {data.cropRect.height}
        </div>
      </div>
    </div>
  );
};

// 後方互換性のため
export const StreamBoxDisplay = TransformDisplay;
