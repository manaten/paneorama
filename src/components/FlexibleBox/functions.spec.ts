import { describe, it, expect } from "vitest";

import {
  createDefaultTransform,
  calculateDisplayProperties,
  contentDragOnResize,
  handleDragOnResize,
  contentDragOnCrop,
  handleDragOnCrop,
  handleDragOnResizeContent,
} from "./functions";
import { FlexibleBoxTransform } from "./types";

describe("functions", () => {
  describe("createDefaultTransform", () => {
    it("should create default transform with correct crop dimensions", () => {
      const result = createDefaultTransform(800, 600);

      expect(result).toEqual({
        crop: {
          x: 0,
          y: 0,
          width: 800,
          height: 600,
        },
        screenPosition: { x: 100, y: 100 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      });
    });

    it("should handle different dimensions", () => {
      const result = createDefaultTransform(1920, 1080);

      expect(result.crop.width).toBe(1920);
      expect(result.crop.height).toBe(1080);
      expect(result.crop.x).toBe(0);
      expect(result.crop.y).toBe(0);
    });
  });

  describe("calculateDisplayProperties", () => {
    it("should calculate display properties with scale 1", () => {
      const transform: FlexibleBoxTransform = {
        crop: { x: 0, y: 0, width: 400, height: 300 },
        screenPosition: { x: 100, y: 50 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };

      const result = calculateDisplayProperties(transform);

      expect(result.containerStyle).toEqual({
        left: 100,
        top: 50,
        width: 400,
        height: 300,
      });
      expect(result.contentStyle).toEqual({
        left: -0,
        top: -0,
        width: 800,
        height: 600,
      });
    });

    it("should calculate display properties with scale 2", () => {
      const transform: FlexibleBoxTransform = {
        crop: { x: 100, y: 50, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 2,
        contentSize: { width: 800, height: 600 },
      };

      const result = calculateDisplayProperties(transform);

      expect(result.containerStyle).toEqual({
        left: 200,
        top: 150,
        width: 800, // 400 * 2
        height: 600, // 300 * 2
      });
      expect(result.contentStyle).toEqual({
        left: -200, // -100 * 2
        top: -100, // -50 * 2
        width: 1600, // 800 * 2
        height: 1200, // 600 * 2
      });
    });

    it("should handle crop offset correctly", () => {
      const transform: FlexibleBoxTransform = {
        crop: { x: 200, y: 100, width: 500, height: 400 },
        screenPosition: { x: 0, y: 0 },
        scale: 1,
        contentSize: { width: 1000, height: 800 },
      };

      const result = calculateDisplayProperties(transform);

      expect(result.contentStyle.left).toBe(-200);
      expect(result.contentStyle.top).toBe(-100);
    });
  });

  describe("contentDragOnResize", () => {
    it("should update screen position based on delta", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 0, y: 0, width: 400, height: 300 },
        screenPosition: { x: 100, y: 50 },
        scale: 1,
        contentSize: { width: 1000, height: 800 },
      };
      const delta = { x: 20, y: 15 };

      const result = contentDragOnResize(initialData, delta);

      expect(result.screenPosition).toEqual({ x: 120, y: 65 });
      expect(result.crop).toEqual(initialData.crop);
      expect(result.scale).toBe(initialData.scale);
    });

    it("should handle negative delta", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 0, y: 0, width: 400, height: 300 },
        screenPosition: { x: 100, y: 50 },
        scale: 1,
        contentSize: { width: 1000, height: 800 },
      };
      const delta = { x: -30, y: -25 };

      const result = contentDragOnResize(initialData, delta);

      expect(result.screenPosition).toEqual({ x: 70, y: 25 });
    });
  });

  describe("handleDragOnResize", () => {
    const baseTransform: FlexibleBoxTransform = {
      crop: { x: 0, y: 0, width: 400, height: 300 },
      screenPosition: { x: 100, y: 50 },
      scale: 1,
      contentSize: { width: 1000, height: 800 },
    };

    it("should return unchanged data when no handle is provided", () => {
      const delta = { x: 20, y: 15 };
      const result = handleDragOnResize(baseTransform, delta);

      expect(result).toEqual(baseTransform);
    });

    it('should handle "se" (southeast) resize - increase scale', () => {
      const delta = { x: 40, y: 30, handle: "se" as const };
      const result = handleDragOnResize(baseTransform, delta);

      expect(result.scale).toBe(1.1);
      expect(result.screenPosition).toEqual(baseTransform.screenPosition); // SE doesn't change position
    });

    it('should handle "sw" (southwest) resize - adjust x position', () => {
      const delta = { x: -40, y: 30, handle: "sw" as const };
      const result = handleDragOnResize(baseTransform, delta);

      expect(result.scale).toBe(1.1);
      expect(Math.round(result.screenPosition.x)).toBe(60);
      expect(result.screenPosition.y).toBe(baseTransform.screenPosition.y);
    });

    it('should handle "ne" (northeast) resize - adjust y position', () => {
      const delta = { x: 40, y: -30, handle: "ne" as const };
      const result = handleDragOnResize(baseTransform, delta);

      expect(result.scale).toBe(1.1);
      expect(result.screenPosition.x).toBe(baseTransform.screenPosition.x);
      expect(Math.round(result.screenPosition.y)).toBe(20);
    });

    it('should handle "nw" (northwest) resize - adjust both x and y position', () => {
      const delta = { x: -40, y: -30, handle: "nw" as const };
      const result = handleDragOnResize(baseTransform, delta);

      expect(result.scale).toBe(1.1);
      expect(Math.round(result.screenPosition.x)).toBe(60);
      expect(Math.round(result.screenPosition.y)).toBe(20);
    });

    it("should enforce minimum size constraint", () => {
      const smallTransform: FlexibleBoxTransform = {
        crop: { x: 0, y: 0, width: 60, height: 60 },
        screenPosition: { x: 100, y: 50 },
        scale: 1,
        contentSize: { width: 1000, height: 800 },
      };
      const delta = { x: -100, y: -100, handle: "se" as const }; // Try to shrink significantly

      const result = handleDragOnResize(smallTransform, delta);

      // Scale should be limited to maintain minimum size (100px)
      const expectedMinScale = 100 / 60; // MIN_SIZE / crop.width
      expect(result.scale).toBe(expectedMinScale);
    });

    it("should handle resize with initial scale 0.5", () => {
      const scaledTransform: FlexibleBoxTransform = {
        crop: { x: 0, y: 0, width: 400, height: 300 },
        screenPosition: { x: 200, y: 100 },
        scale: 0.5,
        contentSize: { width: 1000, height: 800 },
      };
      const delta = { x: 40, y: 30, handle: "se" as const };
      const result = handleDragOnResize(scaledTransform, delta);

      expect(result.scale).toBe(0.6); // 0.5 + (40/400) = 0.5 + 0.1 = 0.6
      expect(result.screenPosition).toEqual(scaledTransform.screenPosition); // SE doesn't change position
    });

    it("should handle resize with initial scale 2", () => {
      const scaledTransform: FlexibleBoxTransform = {
        crop: { x: 0, y: 0, width: 400, height: 300 },
        screenPosition: { x: 50, y: 25 },
        scale: 2,
        contentSize: { width: 1000, height: 800 },
      };
      const delta = { x: -40, y: -30, handle: "nw" as const };
      const result = handleDragOnResize(scaledTransform, delta);

      // scaleX = 2 + (-1) * (-40/400) = 2 + 0.1 = 2.1
      // scaleY = 2 + (-1) * (-30/300) = 2 + 0.1 = 2.1
      // scale = min(2.1, 2.1) = 2.1
      expect(result.scale).toBe(2.1);
      expect(Math.round(result.screenPosition.x)).toBe(10); // 50 - 400 * 0.1 = 50 - 40 = 10
      expect(Math.round(result.screenPosition.y)).toBe(-5); // 25 - 300 * 0.1 = 25 - 30 = -5
    });
  });

  describe("contentDragOnCrop", () => {
    it("should update crop position based on scaled delta", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 100, y: 50, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 2,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: 40, y: 20 };

      const result = contentDragOnCrop(initialData, delta);

      expect(result.crop.x).toBe(80); // 100 - (40/2)
      expect(result.crop.y).toBe(40); // 50 - (20/2)
      expect(result.crop.width).toBe(initialData.crop.width);
      expect(result.crop.height).toBe(initialData.crop.height);
      expect(result.screenPosition).toEqual(initialData.screenPosition);
      expect(result.scale).toBe(initialData.scale);
    });

    it("should handle scale 1 correctly", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 100, y: 50, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: 30, y: 15 };

      const result = contentDragOnCrop(initialData, delta);

      expect(result.crop.x).toBe(70); // 100 - 30
      expect(result.crop.y).toBe(35); // 50 - 15
    });

    it("should handle negative delta", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 100, y: 50, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: -20, y: -10 };

      const result = contentDragOnCrop(initialData, delta);

      expect(result.crop.x).toBe(120); // 100 - (-20)
      expect(result.crop.y).toBe(60); // 50 - (-10)
    });

    it("should clamp crop position to content bounds", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 50, y: 50, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: 100, y: 100 }; // Try to move beyond bounds (positive delta moves crop left/up)

      const result = contentDragOnCrop(initialData, delta);

      // 50 - 100 = -50, but clamped to 0
      expect(result.crop.x).toBe(0); // Clamped to 0
      expect(result.crop.y).toBe(0); // Clamped to 0
    });

    it("should prevent crop from going beyond content right/bottom edge", () => {
      const initialData: FlexibleBoxTransform = {
        crop: { x: 200, y: 200, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: -300, y: -200 }; // Move opposite direction to test boundary

      const result = contentDragOnCrop(initialData, delta);

      // 200 - (-300) = 500, but clamped to max 400 (800 - 400)
      // 200 - (-200) = 400, but clamped to max 300 (600 - 300)
      expect(result.crop.x).toBe(400); // 800 - 400 (content width - crop width)
      expect(result.crop.y).toBe(300); // 600 - 300 (content height - crop height)
    });
  });

  describe("handleDragOnCrop", () => {
    const baseTransform: FlexibleBoxTransform = {
      crop: { x: 100, y: 50, width: 400, height: 300 },
      screenPosition: { x: 200, y: 150 },
      scale: 1,
      contentSize: { width: 800, height: 600 },
    };

    it("should return unchanged data when no handle is provided", () => {
      const delta = { x: 20, y: 15 };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result).toEqual(baseTransform);
    });

    it('should handle "se" (southeast) crop resize', () => {
      const delta = { x: 50, y: 40, handle: "se" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.x).toBe(100); // unchanged
      expect(result.crop.y).toBe(50); // unchanged
      expect(result.crop.width).toBe(450); // 400 + 50
      expect(result.crop.height).toBe(340); // 300 + 40
      expect(result.screenPosition).toEqual(baseTransform.screenPosition);
    });

    it('should handle "sw" (southwest) crop resize', () => {
      const delta = { x: -50, y: 40, handle: "sw" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.width).toBe(450); // 400 - (-50)
      expect(result.crop.height).toBe(340); // 300 + 40
      expect(result.crop.x).toBe(50); // adjusted to maintain right edge
      expect(result.crop.y).toBe(50); // unchanged
    });

    it('should handle "ne" (northeast) crop resize', () => {
      const delta = { x: 50, y: -40, handle: "ne" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.width).toBe(450); // 400 + 50
      expect(result.crop.height).toBe(340); // 300 - (-40)
      expect(result.crop.x).toBe(100); // unchanged
      expect(result.crop.y).toBe(10); // adjusted to maintain bottom edge
    });

    it('should handle "nw" (northwest) crop resize', () => {
      const delta = { x: -50, y: -40, handle: "nw" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.width).toBe(450); // 400 - (-50)
      expect(result.crop.height).toBe(340); // 300 - (-40)
      expect(result.crop.x).toBe(50); // adjusted to maintain right edge
      expect(result.crop.y).toBe(10); // adjusted to maintain bottom edge
    });

    it("should enforce minimum crop size", () => {
      const delta = { x: -500, y: -400, handle: "se" as const }; // Try to shrink below minimum
      const result = handleDragOnCrop(baseTransform, delta);

      // Should enforce minimum size (100px at scale 1)
      expect(result.crop.width).toBeGreaterThanOrEqual(100);
      expect(result.crop.height).toBeGreaterThanOrEqual(100);
    });

    it("should adjust screen position when crop position changes", () => {
      const delta = { x: -50, y: -40, handle: "nw" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      // Screen position should be adjusted based on crop position change
      const xDiff = result.crop.x - baseTransform.crop.x;
      const yDiff = result.crop.y - baseTransform.crop.y;

      expect(result.screenPosition.x).toBe(
        baseTransform.screenPosition.x + xDiff * baseTransform.scale,
      );
      expect(result.screenPosition.y).toBe(
        baseTransform.screenPosition.y + yDiff * baseTransform.scale,
      );
    });

    it("should handle scaled crop operations", () => {
      const scaledTransform: FlexibleBoxTransform = {
        crop: { x: 100, y: 50, width: 400, height: 300 },
        screenPosition: { x: 200, y: 150 },
        scale: 2,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: 100, y: 80, handle: "se" as const };
      const result = handleDragOnCrop(scaledTransform, delta);

      // Delta should be scaled down for crop calculations
      expect(result.crop.width).toBe(450); // 400 + (100/2)
      expect(result.crop.height).toBe(340); // 300 + (80/2)
    });

    it("should prevent crop from extending beyond content bounds", () => {
      const transform: FlexibleBoxTransform = {
        crop: { x: 700, y: 500, width: 50, height: 50 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: 200, y: 200, handle: "se" as const }; // Try to extend beyond content

      const result = handleDragOnCrop(transform, delta);

      // Should be limited by content size
      expect(result.crop.width).toBe(100); // 800 - 700 = 100 max width
      expect(result.crop.height).toBe(100); // 600 - 500 = 100 max height
    });

    it("should handle boundary constraints for nw handle", () => {
      const transform: FlexibleBoxTransform = {
        crop: { x: 50, y: 50, width: 100, height: 100 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: -100, y: -100, handle: "nw" as const }; // Try to extend beyond (0,0)

      const result = handleDragOnCrop(transform, delta);

      // Should be clamped to (0,0) and adjust size accordingly
      expect(result.crop.x).toBe(0);
      expect(result.crop.y).toBe(0);
      expect(result.crop.width).toBe(150); // Original right edge was at 150
      expect(result.crop.height).toBe(150); // Original bottom edge was at 150
    });

    it('should handle "n" (north) edge crop resize - Y axis only', () => {
      const delta = { x: 50, y: -40, handle: "n" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.x).toBe(100); // X unchanged
      expect(result.crop.width).toBe(400); // Width unchanged
      expect(result.crop.height).toBe(340); // 300 - (-40)
      expect(result.crop.y).toBe(10); // Adjusted to maintain bottom edge
    });

    it('should handle "s" (south) edge crop resize - Y axis only', () => {
      const delta = { x: 50, y: 40, handle: "s" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.x).toBe(100); // X unchanged
      expect(result.crop.width).toBe(400); // Width unchanged
      expect(result.crop.y).toBe(50); // Y unchanged
      expect(result.crop.height).toBe(340); // 300 + 40
    });

    it('should handle "e" (east) edge crop resize - X axis only', () => {
      const delta = { x: 50, y: 40, handle: "e" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.y).toBe(50); // Y unchanged
      expect(result.crop.height).toBe(300); // Height unchanged
      expect(result.crop.x).toBe(100); // X unchanged
      expect(result.crop.width).toBe(450); // 400 + 50
    });

    it('should handle "w" (west) edge crop resize - X axis only', () => {
      const delta = { x: -50, y: 40, handle: "w" as const };
      const result = handleDragOnCrop(baseTransform, delta);

      expect(result.crop.y).toBe(50); // Y unchanged
      expect(result.crop.height).toBe(300); // Height unchanged
      expect(result.crop.width).toBe(450); // 400 - (-50)
      expect(result.crop.x).toBe(50); // Adjusted to maintain right edge
    });

    it("should enforce minimum size for edge handles", () => {
      const transform: FlexibleBoxTransform = {
        crop: { x: 100, y: 50, width: 60, height: 60 },
        screenPosition: { x: 200, y: 150 },
        scale: 1,
        contentSize: { width: 800, height: 600 },
      };
      const delta = { x: -100, y: 0, handle: "w" as const }; // Try to shrink below minimum

      const result = handleDragOnCrop(transform, delta);

      // Should enforce minimum size (100px at scale 1)
      expect(result.crop.width).toBeGreaterThanOrEqual(100);
    });
  });

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
});
