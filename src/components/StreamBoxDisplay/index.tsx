import classNames from "classnames";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { Mode, StreamBoxData } from "../../types/streamBox";
import { calculateDisplayProperties } from "../../utils/streamBoxDisplay";

type HandleType = "nw" | "ne" | "sw" | "se";

interface ResizeHandleProps {
  handle: HandleType;
  onMouseDown: (handle: HandleType, e: React.MouseEvent) => void;
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
  const [activeHandle, setActiveHandle] = useState<HandleType | null>(null);
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
            screenPosition: {
              x: initialData.screenPosition.x + deltaX,
              y: initialData.screenPosition.y + deltaY,
            },
          });
          return;
        } else {
          // クロップモード：cropRectの位置を変更（パン）
          updateData({
            ...currentData,
            crop: {
              ...currentData.crop,
              x: initialData.crop.x - deltaX / initialData.scale,
              y: initialData.crop.y - deltaY / initialData.scale,
            },
          });
          return;
        }
      }

      if (isResizing && activeHandle) {
        const screenPosition = (() => {
          switch (activeHandle) {
            case "se": // 右下
              return initialData.screenPosition;
            case "sw": // 左下
              return {
                ...initialData.screenPosition,
                x: initialData.screenPosition.x + deltaX,
              };
            case "ne": // 右上
              return {
                ...initialData.screenPosition,
                y: initialData.screenPosition.y + deltaY,
              };
            case "nw": // 左上
              return {
                x: initialData.screenPosition.x + deltaX,
                y: initialData.screenPosition.y + deltaY,
              };
          }
        })();

        if (currentMode === "resize") {
          const MIN_SIZE = 50;
          const scaleX =
            initialData.scale +
            (activeHandle === "sw" || activeHandle === "nw" ? -1 : 1) *
              (deltaX / initialData.crop.width);
          const scaleY =
            initialData.scale +
            (activeHandle === "ne" || activeHandle === "nw" ? -1 : 1) *
              (deltaY / initialData.crop.height);
          const scale = Math.min(
            Math.max(scaleX, MIN_SIZE / initialData.crop.width),
            Math.max(scaleY, MIN_SIZE / initialData.crop.height),
          );

          const screenPosition = (() => {
            switch (activeHandle) {
              case "se": // 右下
                return initialData.screenPosition;
              case "sw": // 左下
                return {
                  ...initialData.screenPosition,
                  x:
                    initialData.screenPosition.x -
                    initialData.crop.width * (scale - initialData.scale),
                };
              case "ne": // 右上
                return {
                  ...initialData.screenPosition,
                  y:
                    initialData.screenPosition.y -
                    initialData.crop.height * (scale - initialData.scale),
                };
              case "nw": // 左上
                return {
                  x:
                    initialData.screenPosition.x -
                    initialData.crop.width * (scale - initialData.scale),
                  y:
                    initialData.screenPosition.y -
                    initialData.crop.height * (scale - initialData.scale),
                };
            }
          })();
          // リサイズ時は、cropRectをコンテナサイズに比例して調整
          updateData({
            ...currentData,
            scale,
            screenPosition,
          });
          return;
        }

        // 新しいcropRect（基準座標系で）
        const getNewCropRect = () => {
          const minCropSize = 10;
          switch (activeHandle) {
            case "se": // 右下 - cropRectの右端・下端を調整
              return {
                x: initialData.crop.x,
                y: initialData.crop.y,
                width: Math.max(minCropSize, initialData.crop.width + deltaX),
                height: Math.max(minCropSize, initialData.crop.height + deltaY),
              };
            case "sw": {
              // 左下 - cropRectの左端・下端を調整
              const newWidth = Math.max(
                minCropSize,
                initialData.crop.width - deltaX,
              );
              return {
                x: initialData.crop.x + initialData.crop.width - newWidth,
                y: initialData.crop.y,
                width: newWidth,
                height: Math.max(minCropSize, initialData.crop.height + deltaY),
              };
            }
            case "ne": {
              // 右上 - cropRectの右端・上端を調整
              const newHeight = Math.max(
                minCropSize,
                initialData.crop.height - deltaY,
              );
              return {
                x: initialData.crop.x,
                y: initialData.crop.y + initialData.crop.height - newHeight,
                width: Math.max(minCropSize, initialData.crop.width + deltaX),
                height: newHeight,
              };
            }
            case "nw": {
              // 左上 - cropRectの左端・上端を調整
              const newW = Math.max(
                minCropSize,
                initialData.crop.width - deltaX,
              );
              const newH = Math.max(
                minCropSize,
                initialData.crop.height - deltaY,
              );
              return {
                x: initialData.crop.x + initialData.crop.width - newW,
                y: initialData.crop.y + initialData.crop.height - newH,
                width: newW,
                height: newH,
              };
            }
          }
        };

        updateData({
          ...currentData,
          screenPosition,
          crop: getNewCropRect(),
        });
        return;
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

      // eslint-disable-next-line functional/immutable-data -- TODO これrefじゃなくていいのでは
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
    (handle: HandleType, e: React.MouseEvent) => {
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
            className='size-full pointer-events-none absolute'
            style={displayProps.contentStyle}
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
        </div>
      </div>

      <div
        className='absolute select-none cursor-move'
        style={displayProps.containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        role='button'
        tabIndex={0}
        aria-label={`${currentMode === "resize" ? "Move" : "Pan content"}`}
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
