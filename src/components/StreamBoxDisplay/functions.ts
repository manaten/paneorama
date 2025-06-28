import { StreamBoxData } from "@/types/streamBox";

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

const MIN_SIZE = 50;

type MouseDelta = {
  x: number;
  y: number;
  handle?: "se" | "sw" | "ne" | "nw";
};

export function contentDragOnResize(
  initialData: StreamBoxData,
  delta: MouseDelta,
): StreamBoxData {
  return {
    ...initialData,
    screenPosition: {
      x: initialData.screenPosition.x + delta.x,
      y: initialData.screenPosition.y + delta.y,
    },
  };
}

export function handleDragOnResize(
  initialData: StreamBoxData,
  delta: MouseDelta,
): StreamBoxData {
  if (!delta.handle) {
    return initialData;
  }

  const scaleX =
    initialData.scale +
    (delta.handle === "sw" || delta.handle === "nw" ? -1 : 1) *
      (delta.x / initialData.crop.width);
  const scaleY =
    initialData.scale +
    (delta.handle === "ne" || delta.handle === "nw" ? -1 : 1) *
      (delta.y / initialData.crop.height);
  const scale = Math.min(
    Math.max(scaleX, MIN_SIZE / initialData.crop.width),
    Math.max(scaleY, MIN_SIZE / initialData.crop.height),
  );

  const scaleDelta = scale - initialData.scale;

  const screenPosition = (() => {
    switch (delta.handle) {
      case "se": // 右下
        return initialData.screenPosition;
      case "sw": // 左下
        return {
          ...initialData.screenPosition,
          x: initialData.screenPosition.x - initialData.crop.width * scaleDelta,
        };
      case "ne": // 右上
        return {
          ...initialData.screenPosition,
          y:
            initialData.screenPosition.y - initialData.crop.height * scaleDelta,
        };
      case "nw": // 左上
        return {
          x: initialData.screenPosition.x - initialData.crop.width * scaleDelta,
          y:
            initialData.screenPosition.y - initialData.crop.height * scaleDelta,
        };
    }
  })();

  return {
    ...initialData,
    scale,
    screenPosition,
  };
}

export function contentDragOnCrop(
  initialData: StreamBoxData,
  delta: MouseDelta,
): StreamBoxData {
  const deltaXScaled = delta.x / initialData.scale;
  const deltaYScaled = delta.y / initialData.scale;

  return {
    ...initialData,
    crop: {
      ...initialData.crop,
      x: initialData.crop.x - deltaXScaled,
      y: initialData.crop.y - deltaYScaled,
    },
  };
}

export function handleDragOnCrop(
  initialData: StreamBoxData,
  delta: MouseDelta,
): StreamBoxData {
  if (!delta.handle) {
    return initialData;
  }

  const deltaXScaled = delta.x / initialData.scale;
  const deltaYScaled = delta.y / initialData.scale;

  const minCropSize = MIN_SIZE / initialData.scale; // 最小クロップサイズをスケールに基づいて計算

  // 新しいcropRect（基準座標系で）
  const newCrop = (() => {
    switch (delta.handle) {
      case "se": {
        // 右下 - cropRectの右端・下端を調整
        return {
          x: initialData.crop.x,
          y: initialData.crop.y,
          width: Math.max(minCropSize, initialData.crop.width + deltaXScaled),
          height: Math.max(minCropSize, initialData.crop.height + deltaYScaled),
        };
      }
      case "sw": {
        // 左下 - cropRectの左端・下端を調整
        const newWidth = Math.max(
          minCropSize,
          initialData.crop.width - deltaXScaled,
        );
        return {
          x: initialData.crop.x + initialData.crop.width - newWidth,
          y: initialData.crop.y,
          width: newWidth,
          height: Math.max(minCropSize, initialData.crop.height + deltaYScaled),
        };
      }
      case "ne": {
        // 右上 - cropRectの右端・上端を調整
        const newHeight = Math.max(
          minCropSize,
          initialData.crop.height - deltaYScaled,
        );
        return {
          x: initialData.crop.x,
          y: initialData.crop.y + initialData.crop.height - newHeight,
          width: Math.max(minCropSize, initialData.crop.width + deltaXScaled),
          height: newHeight,
        };
      }
      case "nw": {
        // 左上 - cropRectの左端・上端を調整
        const newW = Math.max(
          minCropSize,
          initialData.crop.width - deltaXScaled,
        );
        const newH = Math.max(
          minCropSize,
          initialData.crop.height - deltaYScaled,
        );
        return {
          x: initialData.crop.x + initialData.crop.width - newW,
          y: initialData.crop.y + initialData.crop.height - newH,
          width: newW,
          height: newH,
        };
      }
    }
  })();

  return {
    ...initialData,
    screenPosition: {
      x:
        initialData.screenPosition.x +
        (newCrop.x - initialData.crop.x) * initialData.scale,
      y:
        initialData.screenPosition.y +
        (newCrop.y - initialData.crop.y) * initialData.scale,
    },
    crop: newCrop,
  };
}
