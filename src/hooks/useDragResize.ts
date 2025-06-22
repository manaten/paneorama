import { useCallback, useRef, useState } from "react";

export type Mode = "resize" | "crop";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CropTransform {
  x: number;
  y: number;
  scale: number;
}

interface DragResizeState {
  // Container position and size
  position: Position;
  size: Size;

  // Video crop transform
  cropTransform: CropTransform;

  // Current mode
  mode: Mode;

  // Drag state
  isDragging: boolean;
  isResizing: boolean;
  activeHandle: string | null;
}

export const useDragResize = (initialState: Partial<DragResizeState> = {}) => {
  const [state, setState] = useState<DragResizeState>({
    position: { x: 100, y: 100 },
    size: { width: 400, height: 300 },
    cropTransform: { x: 0, y: 0, scale: 1 },
    mode: "resize",
    isDragging: false,
    isResizing: false,
    activeHandle: null,
    ...initialState,
  });

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const initialStateRef = useRef<Partial<DragResizeState> | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const clientPos = { x: e.clientX, y: e.clientY };

    setState((prev) => {
      // eslint-disable-next-line functional/immutable-data
      dragStartRef.current = clientPos;
      // eslint-disable-next-line functional/immutable-data
      initialStateRef.current = { ...prev };
      return { ...prev, isDragging: true };
    });
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (
        !state.isDragging ||
        !dragStartRef.current ||
        !initialStateRef.current
      )
        return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setState((prev) => {
        if (prev.mode === "resize") {
          // Container drag mode
          return {
            ...prev,
            position: {
              x: (initialStateRef.current?.position?.x ?? 0) + deltaX,
              y: (initialStateRef.current?.position?.y ?? 0) + deltaY,
            },
          };
        } else {
          // Crop mode - move video within container
          return {
            ...prev,
            cropTransform: {
              ...prev.cropTransform,
              x: (initialStateRef.current?.cropTransform?.x ?? 0) + deltaX,
              y: (initialStateRef.current?.cropTransform?.y ?? 0) + deltaY,
            },
          };
        }
      });
    },
    [state.isDragging, state.mode],
  );

  const handleMouseUp = useCallback(() => {
    setState((prev) => {
      // eslint-disable-next-line functional/immutable-data
      dragStartRef.current = null;
      // eslint-disable-next-line functional/immutable-data
      initialStateRef.current = null;
      return {
        ...prev,
        isDragging: false,
        isResizing: false,
        activeHandle: null,
      };
    });
  }, []);

  const handleResizeStart = useCallback(
    (handle: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const clientPos = { x: e.clientX, y: e.clientY };

      setState((prev) => {
        // eslint-disable-next-line functional/immutable-data
        dragStartRef.current = clientPos;
        // eslint-disable-next-line functional/immutable-data
        initialStateRef.current = { ...prev };
        return {
          ...prev,
          isResizing: true,
          activeHandle: handle,
        };
      });
    },
    [],
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (
        !state.isResizing ||
        !state.activeHandle ||
        !dragStartRef.current ||
        !initialStateRef.current
      )
        return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setState((prev) => {
        if (prev.mode === "resize") {
          // Resize container
          const getNewSizeAndPosition = () => {
            switch (prev.activeHandle) {
              case "se": // bottom-right
                return {
                  size: {
                    width: Math.max(
                      100,
                      (initialStateRef.current?.size?.width ?? 0) + deltaX,
                    ),
                    height: Math.max(
                      100,
                      (initialStateRef.current?.size?.height ?? 0) + deltaY,
                    ),
                  },
                  position: prev.position,
                };
              case "sw": // bottom-left
                return {
                  size: {
                    width: Math.max(
                      100,
                      (initialStateRef.current?.size?.width ?? 0) - deltaX,
                    ),
                    height: Math.max(
                      100,
                      (initialStateRef.current?.size?.height ?? 0) + deltaY,
                    ),
                  },
                  position: {
                    ...prev.position,
                    x: (initialStateRef.current?.position?.x ?? 0) + deltaX,
                  },
                };
              case "ne": // top-right
                return {
                  size: {
                    width: Math.max(
                      100,
                      (initialStateRef.current?.size?.width ?? 0) + deltaX,
                    ),
                    height: Math.max(
                      100,
                      (initialStateRef.current?.size?.height ?? 0) - deltaY,
                    ),
                  },
                  position: {
                    ...prev.position,
                    y: (initialStateRef.current?.position?.y ?? 0) + deltaY,
                  },
                };
              case "nw": // top-left
                return {
                  size: {
                    width: Math.max(
                      100,
                      (initialStateRef.current?.size?.width ?? 0) - deltaX,
                    ),
                    height: Math.max(
                      100,
                      (initialStateRef.current?.size?.height ?? 0) - deltaY,
                    ),
                  },
                  position: {
                    x: (initialStateRef.current?.position?.x ?? 0) + deltaX,
                    y: (initialStateRef.current?.position?.y ?? 0) + deltaY,
                  },
                };
              default:
                return { size: prev.size, position: prev.position };
            }
          };

          const { size: newSize, position: newPosition } =
            getNewSizeAndPosition();
          return { ...prev, size: newSize, position: newPosition };
        } else {
          // Crop mode - adjust video scale and position
          const scaleChange = Math.max(0.1, 1 + (deltaX + deltaY) / 200);
          const newScale = Math.max(
            0.5,
            Math.min(
              3,
              (initialStateRef.current?.cropTransform?.scale ?? 1) *
                scaleChange,
            ),
          );

          return {
            ...prev,
            cropTransform: {
              ...prev.cropTransform,
              scale: newScale,
            },
          };
        }
      });
    },
    [state.isResizing, state.activeHandle, state.mode],
  );

  const setMode = useCallback((mode: Mode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  // Mouse event listeners
  const addEventListeners = useCallback(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleResizeMove, handleMouseUp]);

  const removeEventListeners = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mousemove", handleResizeMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleResizeMove, handleMouseUp]);

  return {
    state,
    handleMouseDown,
    handleResizeStart,
    setMode,
    addEventListeners,
    removeEventListeners,
  };
};
