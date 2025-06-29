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
  handle?: "se" | "sw" | "ne" | "nw" | "n" | "s" | "e" | "w";
};

export function contentDragOnResize(
  current: StreamBoxTransform,
  delta: MouseDelta,
): StreamBoxTransform {
  return {
    ...current,
    screenPosition: {
      x: current.screenPosition.x + delta.x,
      y: current.screenPosition.y + delta.y,
    },
  };
}

export function handleDragOnResize(
  current: StreamBoxTransform,
  delta: MouseDelta,
): StreamBoxTransform {
  if (!delta.handle) {
    return current;
  }

  const isWest = delta.handle === "nw" || delta.handle === "sw";
  const isNorth = delta.handle === "nw" || delta.handle === "ne";

  const scaleX =
    current.scale + (isWest ? -1 : 1) * (delta.x / current.crop.width);

  const scaleY =
    current.scale + (isNorth ? -1 : 1) * (delta.y / current.crop.height);

  const scale = Math.min(
    Math.max(scaleX, MIN_SIZE / current.crop.width),
    Math.max(scaleY, MIN_SIZE / current.crop.height),
  );

  const scaleDelta = scale - current.scale;

  // ハンドルが左下･左上の場合はx座標を変更
  const x = isWest
    ? current.screenPosition.x - current.crop.width * scaleDelta
    : current.screenPosition.x;

  // ハンドルが左上･右上の場合はy座標を変更
  const y = isNorth
    ? current.screenPosition.y - current.crop.height * scaleDelta
    : current.screenPosition.y;

  return {
    ...current,
    scale,
    screenPosition: { x, y },
  };
}

export function contentDragOnCrop(
  current: StreamBoxTransform,
  delta: MouseDelta,
  contentSize: { width: number; height: number },
): StreamBoxTransform {
  return {
    ...current,
    crop: {
      ...current.crop,
      x: adjust(current.crop.x - delta.x / current.scale, {
        min: 0,
        max: contentSize.width - current.crop.width,
      }),
      y: adjust(current.crop.y - delta.y / current.scale, {
        min: 0,
        max: contentSize.height - current.crop.height,
      }),
    },
  };
}

export function handleDragOnCrop(
  current: StreamBoxTransform,
  delta: MouseDelta,
  contentSize: { width: number; height: number },
): StreamBoxTransform {
  if (!delta.handle) {
    return current;
  }

  const minCropSize = MIN_SIZE / current.scale; // 最小クロップサイズをスケールに基づいて計算

  const newCropX = (() => {
    const deltaXScaled = delta.x / current.scale;

    switch (delta.handle) {
      case "se":
      case "ne":
      case "e": {
        // 右下/右上/右 - cropRectの右端を調整
        return {
          x: current.crop.x,
          width: adjust(current.crop.width + deltaXScaled, {
            min: minCropSize,
            max: contentSize.width - current.crop.x,
          }),
        };
      }
      case "sw":
      case "nw":
      case "w": {
        // 左下/左上/左 - cropRectの左端
        const width = adjust(current.crop.width - deltaXScaled, {
          min: minCropSize,
          max: current.crop.x + current.crop.width,
        });
        return {
          x: current.crop.x + current.crop.width - width,
          width,
        };
      }
      case "n":
      case "s": {
        // 上/下 - X軸は変更しない
        return {
          x: current.crop.x,
          width: current.crop.width,
        };
      }
    }
  })();

  const newCropY = (() => {
    const deltaYScaled = delta.y / current.scale;

    switch (delta.handle) {
      case "se":
      case "sw":
      case "s": {
        // 右下/左下/下 - cropRectの下端を調整
        return {
          y: current.crop.y,
          height: adjust(current.crop.height + deltaYScaled, {
            min: minCropSize,
            max: contentSize.height - current.crop.y,
          }),
        };
      }
      case "ne":
      case "nw":
      case "n": {
        // 右上/左上/上 - cropRectの上端を調整
        const height = adjust(current.crop.height - deltaYScaled, {
          min: minCropSize,
          max: current.crop.y + current.crop.height,
        });
        return {
          y: current.crop.y + current.crop.height - height,
          height,
        };
      }
      case "e":
      case "w": {
        // 左/右 - Y軸は変更しない
        return {
          y: current.crop.y,
          height: current.crop.height,
        };
      }
    }
  })();

  return {
    ...current,
    screenPosition: {
      x:
        current.screenPosition.x +
        (newCropX.x - current.crop.x) * current.scale,
      y:
        current.screenPosition.y +
        (newCropY.y - current.crop.y) * current.scale,
    },
    crop: {
      ...newCropX,
      ...newCropY,
    },
  };
}
