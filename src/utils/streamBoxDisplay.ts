import { StreamBoxData } from "../types/streamBox";

export interface DisplayProperties {
  containerStyle: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  videoStyle: {
    transform: string;
    transformOrigin: string;
  };
}

/**
 * StreamBoxデータから表示用CSSプロパティを計算
 *
 * 表示ルール:
 * - ソースビデオは常にコンテナに内接表示
 * - cropRectで指定された範囲がコンテナサイズに拡大/縮小される
 */
export function calculateDisplayProperties(
  data: StreamBoxData,
): DisplayProperties {
  const { containerPosition, containerSize, cropRect } = data;

  // コンテナスタイル（そのまま配置）
  const containerStyle = {
    left: containerPosition.x,
    top: containerPosition.y,
    width: containerSize.width,
    height: containerSize.height,
  };

  // ビデオ表示の拡大率を計算
  // cropRectの範囲をcontainerSizeに合わせる
  const scaleX = containerSize.width / cropRect.width;
  const scaleY = containerSize.height / cropRect.height;

  // ビデオの位置オフセット
  // cropRectの左上をコンテナの左上に合わせるため、負の値で移動
  const translateX = -cropRect.x * scaleX;
  const translateY = -cropRect.y * scaleY;

  const videoStyle = {
    transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
    transformOrigin: "top left",
  };

  return {
    containerStyle,
    videoStyle,
  };
}

/**
 * デフォルトのStreamBoxデータを生成
 */
export function createDefaultStreamBoxData(): StreamBoxData {
  const baseSize = { width: 400, height: 300 };
  return {
    containerPosition: { x: 100, y: 100 },
    containerSize: baseSize,
    cropRect: { x: 0, y: 0, width: 400, height: 300 },
    baseSize,
    scale: { x: 1, y: 1 },
  };
}
