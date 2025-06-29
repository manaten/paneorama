import { StreamBoxTransform } from "./types";

function adjust(
  value: number,
  { min = -Infinity, max = Infinity }: { min?: number; max?: number },
): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * デフォルトのStreamBoxデータを生成
 */
export function createDefaultTransform(
  width: number,
  height: number,
): StreamBoxTransform {
  return {
    crop: {
      x: 0,
      y: 0,
      width,
      height,
    },
    screenPosition: { x: 100, y: 100 },
    scale: 1,
  };
}

/**
 * トランスフォーム情報から表示用CSSプロパティを計算
 *
 * 表示ルール:
 * - ソースビデオは常にコンテナに内接表示
 * - cropRectで指定された範囲がコンテナサイズに拡大/縮小される
 */
export function calculateDisplayProperties(
  contentSize: { width: number; height: number },
  transform: StreamBoxTransform,
) {
  const { scale, screenPosition, crop } = transform;

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
      width: contentSize.width * scale,
      height: contentSize.height * scale,
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
  initialData: StreamBoxTransform,
  delta: MouseDelta,
): StreamBoxTransform {
  return {
    ...initialData,
    screenPosition: {
      x: initialData.screenPosition.x + delta.x,
      y: initialData.screenPosition.y + delta.y,
    },
  };
}

export function handleDragOnResize(
  initialData: StreamBoxTransform,
  delta: MouseDelta,
): StreamBoxTransform {
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

  // 左下･左上の場合はy座標を変えない
  const x =
    delta.handle === "se" || delta.handle === "ne"
      ? initialData.screenPosition.x
      : initialData.screenPosition.x - initialData.crop.width * scaleDelta;

  // 左下･右下の場合はy座標を変えない
  const y =
    delta.handle === "se" || delta.handle === "sw"
      ? initialData.screenPosition.y
      : initialData.screenPosition.y - initialData.crop.height * scaleDelta;

  return {
    ...initialData,
    scale,
    screenPosition: {
      x,
      y,
    },
  };
}

export function contentDragOnCrop(
  initialData: StreamBoxTransform,
  delta: MouseDelta,
  contentSize: { width: number; height: number },
): StreamBoxTransform {
  const deltaXScaled = delta.x / initialData.scale;
  const deltaYScaled = delta.y / initialData.scale;

  return {
    ...initialData,
    crop: {
      ...initialData.crop,
      x: adjust(initialData.crop.x - deltaXScaled, {
        min: 0,
        max: contentSize.width - initialData.crop.width,
      }),
      y: adjust(initialData.crop.y - deltaYScaled, {
        min: 0,
        max: contentSize.height - initialData.crop.height,
      }),
    },
  };
}

export function handleDragOnCrop(
  initialData: StreamBoxTransform,
  delta: MouseDelta,
  contentSize: { width: number; height: number },
): StreamBoxTransform {
  if (!delta.handle) {
    return initialData;
  }

  const minCropSize = MIN_SIZE / initialData.scale; // 最小クロップサイズをスケールに基づいて計算

  const newCropX = (() => {
    const deltaXScaled = delta.x / initialData.scale;

    switch (delta.handle) {
      case "se":
      case "ne": {
        // 右下/右上 - cropRectの右端を調整
        return {
          x: initialData.crop.x,
          width: adjust(initialData.crop.width + deltaXScaled, {
            min: minCropSize,
            max: contentSize.width - initialData.crop.x,
          }),
        };
      }
      case "sw":
      case "nw": {
        // 左下/左上 - cropRectの左端

        const newWidth = adjust(initialData.crop.width - deltaXScaled, {
          min: minCropSize,
        });

        // x座標が0未満にならないように調整
        const x = adjust(
          initialData.crop.x + initialData.crop.width - newWidth,
          { min: 0 },
        );
        return {
          x,
          width: initialData.crop.width + initialData.crop.x - x,
        };
      }
    }
  })();

  const newCropY = (() => {
    const deltaYScaled = delta.y / initialData.scale;

    switch (delta.handle) {
      case "se":
      case "sw": {
        // 右下/左下 - cropRectの下端を調整
        return {
          y: initialData.crop.y,
          height: adjust(initialData.crop.height + deltaYScaled, {
            min: minCropSize,
            max: contentSize.height - initialData.crop.y,
          }),
        };
      }
      case "ne":
      case "nw": {
        // 右上/左上 - cropRectの上端を調整
        const newHeight = adjust(initialData.crop.height - deltaYScaled, {
          min: minCropSize,
        });
        // y座標が0未満にならないように調整
        const y = adjust(
          initialData.crop.y + initialData.crop.height - newHeight,
          { min: 0 },
        );
        return {
          y,
          height: initialData.crop.y + initialData.crop.height - y,
        };
      }
    }
  })();

  return {
    ...initialData,
    screenPosition: {
      x:
        initialData.screenPosition.x +
        (newCropX.x - initialData.crop.x) * initialData.scale,
      y:
        initialData.screenPosition.y +
        (newCropY.y - initialData.crop.y) * initialData.scale,
    },
    crop: {
      ...newCropX,
      ...newCropY,
    },
  };
}
