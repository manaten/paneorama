import { FlexibleBoxTransform } from "./types";

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
): FlexibleBoxTransform {
  return {
    crop: {
      x: 0,
      y: 0,
      width,
      height,
    },
    screenPosition: { x: 100, y: 100 },
    scale: 1,
    contentSize: { width, height },
  };
}

/**
 * トランスフォーム情報から表示用CSSプロパティを計算
 *
 * 表示ルール:
 * - ソースビデオは常にコンテナに内接表示
 * - cropRectで指定された範囲がコンテナサイズに拡大/縮小される
 */
export function calculateDisplayProperties(transform: FlexibleBoxTransform) {
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
      width: transform.contentSize.width * scale,
      height: transform.contentSize.height * scale,
    },
  };
}

const MIN_SIZE = 100;

type MouseDelta = {
  x: number;
  y: number;
  handle?: "se" | "sw" | "ne" | "nw" | "n" | "s" | "e" | "w";
};

export function contentDragOnResize(
  current: FlexibleBoxTransform,
  delta: MouseDelta,
): FlexibleBoxTransform {
  return {
    ...current,
    screenPosition: {
      x: current.screenPosition.x + delta.x,
      y: current.screenPosition.y + delta.y,
    },
  };
}

export function handleDragOnResize(
  current: FlexibleBoxTransform,
  delta: MouseDelta,
): FlexibleBoxTransform {
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

export function handleDragOnResizeContent(
  current: FlexibleBoxTransform,
  delta: MouseDelta,
): FlexibleBoxTransform {
  if (!delta.handle) {
    return current;
  }

  const isWest =
    delta.handle === "nw" || delta.handle === "sw" || delta.handle === "w";
  const isNorth =
    delta.handle === "nw" || delta.handle === "ne" || delta.handle === "n";
  const isEast =
    delta.handle === "ne" || delta.handle === "se" || delta.handle === "e";
  const isSouth =
    delta.handle === "sw" || delta.handle === "se" || delta.handle === "s";

  // 新しいcontentSize widthとheightを計算
  const newWidth = (() => {
    if (isEast) {
      return Math.max(MIN_SIZE, current.contentSize.width + delta.x);
    } else if (isWest) {
      return Math.max(MIN_SIZE, current.contentSize.width - delta.x);
    }
    return current.contentSize.width;
  })();

  const newHeight = (() => {
    if (isSouth) {
      return Math.max(MIN_SIZE, current.contentSize.height + delta.y);
    } else if (isNorth) {
      return Math.max(MIN_SIZE, current.contentSize.height - delta.y);
    }
    return current.contentSize.height;
  })();

  // screen positionの調整（西・北側のハンドルの場合）
  const widthDelta = newWidth - current.contentSize.width;
  const heightDelta = newHeight - current.contentSize.height;

  const x = isWest
    ? current.screenPosition.x - widthDelta
    : current.screenPosition.x;

  const y = isNorth
    ? current.screenPosition.y - heightDelta
    : current.screenPosition.y;

  return {
    ...current,
    contentSize: {
      width: newWidth,
      height: newHeight,
    },
    crop: {
      ...current.crop,
      width: newWidth,
      height: newHeight,
    },
    screenPosition: { x, y },
  };
}

export function contentDragOnCrop(
  current: FlexibleBoxTransform,
  delta: MouseDelta,
): FlexibleBoxTransform {
  return {
    ...current,
    crop: {
      ...current.crop,
      x: adjust(current.crop.x - delta.x / current.scale, {
        min: 0,
        max: current.contentSize.width - current.crop.width,
      }),
      y: adjust(current.crop.y - delta.y / current.scale, {
        min: 0,
        max: current.contentSize.height - current.crop.height,
      }),
    },
  };
}

export function handleDragOnCrop(
  current: FlexibleBoxTransform,
  delta: MouseDelta,
): FlexibleBoxTransform {
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
            max: current.contentSize.width - current.crop.x,
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
            max: current.contentSize.height - current.crop.y,
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

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("handleDragOnResizeContent", () => {
    const baseTransform: FlexibleBoxTransform = {
      crop: {
        x: 0,
        y: 0,
        width: 400,
        height: 300,
      },
      scale: 1,
      screenPosition: { x: 100, y: 100 },
      contentSize: { width: 400, height: 300 },
    };

    it("should resize content width when dragging east handle", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 50,
        y: 0,
        handle: "e",
      });

      expect(result.contentSize.width).toBe(450);
      expect(result.contentSize.height).toBe(300);
      expect(result.crop.width).toBe(450);
      expect(result.crop.height).toBe(300);
      expect(result.screenPosition).toEqual({ x: 100, y: 100 });
    });

    it("should resize content height when dragging south handle", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 0,
        y: 80,
        handle: "s",
      });

      expect(result.contentSize.width).toBe(400);
      expect(result.contentSize.height).toBe(380);
      expect(result.crop.width).toBe(400);
      expect(result.crop.height).toBe(380);
      expect(result.screenPosition).toEqual({ x: 100, y: 100 });
    });

    it("should resize both width and height when dragging southeast corner", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 50,
        y: 80,
        handle: "se",
      });

      expect(result.contentSize.width).toBe(450);
      expect(result.contentSize.height).toBe(380);
      expect(result.crop.width).toBe(450);
      expect(result.crop.height).toBe(380);
      expect(result.screenPosition).toEqual({ x: 100, y: 100 });
    });

    it("should resize and adjust position when dragging west handle", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 50,
        y: 0,
        handle: "w",
      });

      expect(result.contentSize.width).toBe(350);
      expect(result.contentSize.height).toBe(300);
      expect(result.crop.width).toBe(350);
      expect(result.crop.height).toBe(300);
      // x position should move left by 50 (widthDelta = 350 - 400 = -50)
      expect(result.screenPosition.x).toBe(150);
      expect(result.screenPosition.y).toBe(100);
    });

    it("should resize and adjust position when dragging north handle", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 0,
        y: 40,
        handle: "n",
      });

      expect(result.contentSize.width).toBe(400);
      expect(result.contentSize.height).toBe(260);
      expect(result.crop.width).toBe(400);
      expect(result.crop.height).toBe(260);
      expect(result.screenPosition.x).toBe(100);
      // y position should move up by 40 (heightDelta = 260 - 300 = -40)
      expect(result.screenPosition.y).toBe(140);
    });

    it("should resize and adjust position when dragging northwest corner", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 30,
        y: 20,
        handle: "nw",
      });

      expect(result.contentSize.width).toBe(370);
      expect(result.contentSize.height).toBe(280);
      expect(result.crop.width).toBe(370);
      expect(result.crop.height).toBe(280);
      // x: 100 + (370 - 400) = 70
      expect(result.screenPosition.x).toBe(130);
      // y: 100 + (280 - 300) = 80
      expect(result.screenPosition.y).toBe(120);
    });

    it("should enforce minimum size", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: -500,
        y: -500,
        handle: "e",
      });

      // MIN_SIZE is 100
      expect(result.contentSize.width).toBe(100);
      expect(result.crop.width).toBe(100);
    });

    it("should return unchanged transform when handle is undefined", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: 50,
        y: 50,
      });

      expect(result).toEqual(baseTransform);
    });

    it("should handle negative delta correctly on east handle", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: -50,
        y: 0,
        handle: "e",
      });

      expect(result.contentSize.width).toBe(350);
      expect(result.crop.width).toBe(350);
      expect(result.screenPosition.x).toBe(100);
    });

    it("should handle negative delta correctly on west handle", () => {
      const result = handleDragOnResizeContent(baseTransform, {
        x: -50,
        y: 0,
        handle: "w",
      });

      expect(result.contentSize.width).toBe(450);
      expect(result.crop.width).toBe(450);
      // widthDelta = 450 - 400 = 50, so x = 100 - 50 = 50
      expect(result.screenPosition.x).toBe(50);
    });
  });
}
