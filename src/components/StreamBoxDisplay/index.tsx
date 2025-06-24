import classNames from "classnames";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Mode, StreamBoxData } from "../../types/streamBox";
import { calculateDisplayProperties } from "../../utils/streamBoxDisplay";

interface ResizeHandleProps {
  handle: string;
  onMouseDown: (handle: string, e: React.MouseEvent) => void;
  mode: Mode;
}

const ResizeHandle: FC<ResizeHandleProps> = ({ handle, onMouseDown, mode }) => {
  const getPosition = (): string => {
    switch (handle) {
      case "nw":
        return "top-0 left-0 -translate-x-1/2 -translate-y-1/2";
      case "ne":
        return "top-0 right-0 translate-x-1/2 -translate-y-1/2";
      case "sw":
        return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2";
      case "se":
        return "bottom-0 right-0 translate-x-1/2 translate-y-1/2";
      default:
        return "";
    }
  };

  const getCursor = (): string => {
    switch (handle) {
      case "nw":
      case "se":
        return "cursor-nw-resize";
      case "ne":
      case "sw":
        return "cursor-ne-resize";
      default:
        return "cursor-pointer";
    }
  };

  return (
    <button
      type='button'
      className={classNames(
        "absolute w-3 h-3 border-2 border-white bg-blue-500 rounded-full z-50",
        "hover:bg-blue-600 transition-colors",
        getPosition(),
        getCursor(),
      )}
      onMouseDown={(e) => onMouseDown(handle, e)}
      title={mode === "resize" ? "Resize" : "Crop"}
      aria-label={`${mode === "resize" ? "Resize" : "Crop"} handle ${handle}`}
    />
  );
};

interface Props {
  className?: string;
  /**
   * StreamBoxの初期データモデル
   */
  data: StreamBoxData;

  /**
   * 表示するコンテンツ
   */
  children: ReactNode;

  /**
   * モード（オプション）
   */
  mode?: Mode;

  /**
   * ボーダーカラー（オプション）
   */
  borderColor?: string;

  /**
   * データ変更時のコールバック（オプション）
   */
  onDataChange?: (data: StreamBoxData) => void;
}

/**
 * コンテンツの変形・クロッピング表示コンポーネント
 *
 * StreamBoxDataに基づいて、コンテナサイズとクロッピング変形を適用してコンテンツを表示します。
 * interactive=trueの場合、ユーザー操作も可能です。
 */
export const TransformDisplay: FC<Props> = ({
  className,
  data: initialData,
  children,
  mode = "resize",
  borderColor = "#3b82f6",
  onDataChange,
}) => {
  // 内部状態
  const [internalData, setInternalData] = useState<StreamBoxData>(initialData);
  const [isHovered, setIsHovered] = useState(false);

  // ドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    data: StreamBoxData;
  } | null>(null);

  // 使用するデータとモード
  const currentData = internalData;
  const currentMode = mode;

  // 表示用プロパティを計算
  const displayProps = calculateDisplayProperties(currentData);

  // データ変更ハンドラー
  const updateData = useCallback(
    (newData: StreamBoxData) => {
      setInternalData(newData);
      onDataChange?.(newData);
    },
    [onDataChange],
  );

  // マウスイベントハンドラー（interactiveの場合のみ）
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const initialData = dragStartRef.current.data;

      if (isDragging) {
        if (currentMode === "resize") {
          // コンテナの移動
          updateData({
            ...currentData,
            containerPosition: {
              x: initialData.containerPosition.x + deltaX,
              y: initialData.containerPosition.y + deltaY,
            },
          });
        } else {
          // クロップモード：cropRectの位置を変更（パン）
          updateData({
            ...currentData,
            cropRect: {
              ...currentData.cropRect,
              x: initialData.cropRect.x - deltaX,
              y: initialData.cropRect.y - deltaY,
            },
          });
        }
      } else if (isResizing && activeHandle) {
        if (currentMode === "resize") {
          // コンテナのリサイズ
          const getNewContainerData = () => {
            const minSize = 100;
            switch (activeHandle) {
              case "se": // 右下
                return {
                  containerSize: {
                    width: Math.max(
                      minSize,
                      initialData.containerSize.width + deltaX,
                    ),
                    height: Math.max(
                      minSize,
                      initialData.containerSize.height + deltaY,
                    ),
                  },
                  containerPosition: initialData.containerPosition,
                };
              case "sw": // 左下
                return {
                  containerSize: {
                    width: Math.max(
                      minSize,
                      initialData.containerSize.width - deltaX,
                    ),
                    height: Math.max(
                      minSize,
                      initialData.containerSize.height + deltaY,
                    ),
                  },
                  containerPosition: {
                    ...initialData.containerPosition,
                    x: initialData.containerPosition.x + deltaX,
                  },
                };
              case "ne": // 右上
                return {
                  containerSize: {
                    width: Math.max(
                      minSize,
                      initialData.containerSize.width + deltaX,
                    ),
                    height: Math.max(
                      minSize,
                      initialData.containerSize.height - deltaY,
                    ),
                  },
                  containerPosition: {
                    ...initialData.containerPosition,
                    y: initialData.containerPosition.y + deltaY,
                  },
                };
              case "nw": // 左上
                return {
                  containerSize: {
                    width: Math.max(
                      minSize,
                      initialData.containerSize.width - deltaX,
                    ),
                    height: Math.max(
                      minSize,
                      initialData.containerSize.height - deltaY,
                    ),
                  },
                  containerPosition: {
                    x: initialData.containerPosition.x + deltaX,
                    y: initialData.containerPosition.y + deltaY,
                  },
                };
              default:
                return {
                  containerSize: initialData.containerSize,
                  containerPosition: initialData.containerPosition,
                };
            }
          };

          const { containerSize, containerPosition } = getNewContainerData();

          // リサイズ時は、cropRectをコンテナサイズに比例して調整
          const scaleX = containerSize.width / initialData.containerSize.width;
          const scaleY =
            containerSize.height / initialData.containerSize.height;

          updateData({
            ...currentData,
            containerSize,
            containerPosition,
            cropRect: {
              x: initialData.cropRect.x * scaleX,
              y: initialData.cropRect.y * scaleY,
              width: initialData.cropRect.width * scaleX,
              height: initialData.cropRect.height * scaleY,
            },
          });
        } else {
          // クロップモード：倍率ベースの計算
          const baseSize = initialData.baseSize || initialData.containerSize;

          const getNewContainerData = () => {
            const minContainerSize = 100;
            switch (activeHandle) {
              case "se": // 右下
                return {
                  containerSize: {
                    width: Math.max(
                      minContainerSize,
                      initialData.containerSize.width + deltaX,
                    ),
                    height: Math.max(
                      minContainerSize,
                      initialData.containerSize.height + deltaY,
                    ),
                  },
                  containerPosition: initialData.containerPosition,
                };
              case "sw": // 左下
                return {
                  containerSize: {
                    width: Math.max(
                      minContainerSize,
                      initialData.containerSize.width - deltaX,
                    ),
                    height: Math.max(
                      minContainerSize,
                      initialData.containerSize.height + deltaY,
                    ),
                  },
                  containerPosition: {
                    ...initialData.containerPosition,
                    x: initialData.containerPosition.x + deltaX,
                  },
                };
              case "ne": // 右上
                return {
                  containerSize: {
                    width: Math.max(
                      minContainerSize,
                      initialData.containerSize.width + deltaX,
                    ),
                    height: Math.max(
                      minContainerSize,
                      initialData.containerSize.height - deltaY,
                    ),
                  },
                  containerPosition: {
                    ...initialData.containerPosition,
                    y: initialData.containerPosition.y + deltaY,
                  },
                };
              case "nw": // 左上
                return {
                  containerSize: {
                    width: Math.max(
                      minContainerSize,
                      initialData.containerSize.width - deltaX,
                    ),
                    height: Math.max(
                      minContainerSize,
                      initialData.containerSize.height - deltaY,
                    ),
                  },
                  containerPosition: {
                    x: initialData.containerPosition.x + deltaX,
                    y: initialData.containerPosition.y + deltaY,
                  },
                };
              default:
                return {
                  containerSize: initialData.containerSize,
                  containerPosition: initialData.containerPosition,
                };
            }
          };

          const { containerSize, containerPosition } = getNewContainerData();

          // 基準サイズからの倍率を計算
          const newScaleX = containerSize.width / baseSize.width;
          const newScaleY = containerSize.height / baseSize.height;

          // cropRectは基準サイズを倍率で割り戻す（見かけ上同じサイズを維持）
          const baseCropSize = baseSize.width; // 基準cropRectサイズ

          updateData({
            ...currentData,
            containerSize,
            containerPosition,
            scale: { x: newScaleX, y: newScaleY },
            cropRect: {
              x:
                (initialData.cropRect.x / newScaleX) *
                (initialData.scale?.x || 1),
              y:
                (initialData.cropRect.y / newScaleY) *
                (initialData.scale?.y || 1),
              width: baseCropSize / newScaleX,
              height:
                (baseCropSize * baseSize.height) / baseSize.width / newScaleY,
            },
          });
        }
      }
    },
    [
      isDragging,
      isResizing,
      activeHandle,
      currentMode,
      currentData,
      updateData,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setActiveHandle(null);
    // eslint-disable-next-line functional/immutable-data
    dragStartRef.current = null;
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // eslint-disable-next-line functional/immutable-data
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        data: currentData,
      };
      setIsDragging(true);
    },
    [currentData],
  );

  const handleResizeStart = useCallback(
    (handle: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // eslint-disable-next-line functional/immutable-data
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        data: currentData,
      };
      setIsResizing(true);
      setActiveHandle(handle);
    },
    [currentData],
  );

  // イベントリスナーの管理
  useEffect(() => {
    if (!isDragging && !isResizing) return undefined;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className={classNames(className, "relative")}>
      {/* 表示コンポーネント */}
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
            Container: {currentData.containerSize.width}×
            {currentData.containerSize.height}
            <br />
            Crop: {currentData.cropRect.x},{currentData.cropRect.y}{" "}
            {currentData.cropRect.width}×{currentData.cropRect.height}
          </div>
        </div>
      </div>

      {/* 操作レイヤー（interactiveの場合のみ） */}
      <div
        className='absolute select-none cursor-move'
        style={{
          left: currentData.containerPosition.x,
          top: currentData.containerPosition.y,
          width: currentData.containerSize.width,
          height: currentData.containerSize.height,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        role='button'
        tabIndex={0}
        aria-label={`${currentMode === "resize" ? "Move" : "Pan content"}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
      >
        <div className='group/transform-display size-full'>
          {/* リサイズハンドル */}
          {isHovered && (
            <>
              <ResizeHandle
                handle='nw'
                onMouseDown={handleResizeStart}
                mode={currentMode}
              />
              <ResizeHandle
                handle='ne'
                onMouseDown={handleResizeStart}
                mode={currentMode}
              />
              <ResizeHandle
                handle='sw'
                onMouseDown={handleResizeStart}
                mode={currentMode}
              />
              <ResizeHandle
                handle='se'
                onMouseDown={handleResizeStart}
                mode={currentMode}
              />
            </>
          )}

          {/* クロップモード表示 */}
          {currentMode === "crop" && isHovered && (
            <div className='absolute inset-0 pointer-events-none border-2 border-dashed border-yellow-400 opacity-50' />
          )}
        </div>
      </div>
    </div>
  );
};

// 後方互換性のため
export const StreamBoxDisplay = TransformDisplay;
