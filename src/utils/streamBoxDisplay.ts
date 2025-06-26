import { StreamBoxData } from "../types/streamBox";

/**
 * StreamBoxデータから表示用CSSプロパティを計算
 *
 * 表示ルール:
 * - ソースビデオは常にコンテナに内接表示
 * - cropRectで指定された範囲がコンテナサイズに拡大/縮小される
 */
export function calculateDisplayProperties(data: StreamBoxData) {
  const { scale, screenPosition, crop } = data;

  return {
    containerStyle: {
      left: screenPosition.x,
      top: screenPosition.y,
      width: crop.width * scale,
      height: crop.height * scale,
    },
    contentStyle: {
      left: -crop.x * scale,
      top: -crop.y * scale,
      width: data.originalSize.width * scale,
      height: data.originalSize.height * scale,
    },
  };
}

/**
 * デフォルトのStreamBoxデータを生成
 */
export function createDefaultStreamBoxData(): StreamBoxData {
  return {
    originalSize: {
      width: 400,
      height: 300,
    },
    crop: {
      x: 0,
      y: 0,
      width: 400,
      height: 300,
    },
    screenPosition: { x: 100, y: 100 },
    scale: 1,
  };
}
