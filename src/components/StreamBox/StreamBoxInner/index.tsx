import classNames from "classnames";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  calculateDisplayProperties,
  contentDragOnCrop,
  contentDragOnResize,
  createDefaultStreamBoxData,
  handleDragOnCrop,
  handleDragOnResize,
} from "./functions";
import { Mode, StreamBoxData } from "../../../types/streamBox";

type HandleType = "nw" | "ne" | "sw" | "se";

interface ResizeHandleProps {
  handle: HandleType;
  onMouseDown: (handle: HandleType, e: React.MouseEvent) => void;
  mode: Mode;
}

const ResizeHandle: FC<ResizeHandleProps> = ({ handle, onMouseDown, mode }) => {
  const position = useMemo(() => {
    switch (handle) {
      case "nw":
        return "top-0 left-0 -translate-x-1/2 -translate-y-1/2";
      case "ne":
        return "top-0 right-0 translate-x-1/2 -translate-y-1/2";
      case "sw":
        return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2";
      case "se":
        return "bottom-0 right-0 translate-x-1/2 translate-y-1/2";
    }
  }, [handle]);

  const cursor = useMemo(() => {
    switch (handle) {
      case "nw":
      case "se":
        return "cursor-nw-resize";
      case "ne":
      case "sw":
        return "cursor-ne-resize";
    }
  }, [handle]);

  return (
    <button
      type='button'
      className={classNames(
        "absolute w-3 h-3 border-2 border-white bg-blue-500 rounded-full z-50",
        "hover:bg-blue-600 transition-colors",
        position,
        cursor,
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
  data?: StreamBoxData;

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
   * オプションで表示できるボタン
   */
  buttons?: ReactNode;
}

/**
 * コンテンツの変形・クロッピング表示コンポーネント
 *
 * StreamBoxDataに基づいて、コンテナサイズとクロッピング変形を適用してコンテンツを表示します。
 * interactive=trueの場合、ユーザー操作も可能です。
 */
export const StreamBoxInner: FC<Props> = ({
  className,
  data,
  children,
  mode = "resize",
  borderColor = "#3b82f6",
  buttons,
}) => {
  // 内部状態
  const [currentData, setCurrentData] = useState<StreamBoxData>(
    () => data ?? createDefaultStreamBoxData(),
  );
  const [isHovered, setIsHovered] = useState(false);

  const [dragStartData, setDragStartData] = useState<{
    initialData: StreamBoxData;
    x: number;
    y: number;
    dragOrResize: "drag" | "resize";
    handle?: HandleType;
  } | null>(null);

  // マウスイベントハンドラー（interactiveの場合のみ）
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartData) return;
      const { initialData } = dragStartData;
      const delta = {
        x: e.clientX - dragStartData.x,
        y: e.clientY - dragStartData.y,
        handle: dragStartData.handle,
      } as const;

      if (dragStartData.dragOrResize === "drag") {
        if (mode === "resize") {
          setCurrentData(contentDragOnResize(initialData, delta));
        }
        if (mode === "crop") {
          setCurrentData(contentDragOnCrop(initialData, delta));
        }
      }

      if (dragStartData.dragOrResize === "resize") {
        if (mode === "resize") {
          setCurrentData(handleDragOnResize(initialData, delta));
        }
        if (mode === "crop") {
          setCurrentData(handleDragOnCrop(initialData, delta));
        }
      }
    },
    [mode, dragStartData],
  );

  const handleMouseUp = useCallback(() => {
    setDragStartData(null);
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragStartData({
        initialData: currentData,
        x: e.clientX,
        y: e.clientY,
        dragOrResize: "drag",
      });
    },
    [currentData],
  );

  const handleResizeStart = useCallback(
    (handle: HandleType, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragStartData({
        initialData: currentData,
        x: e.clientX,
        y: e.clientY,
        dragOrResize: "resize",
        handle,
      });
    },
    [currentData],
  );

  // イベントリスナーの管理
  useEffect(() => {
    if (!dragStartData) return undefined;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragStartData, handleMouseMove, handleMouseUp]);

  // 表示用プロパティを計算
  const { containerStyle, contentStyle } =
    calculateDisplayProperties(currentData);

  return (
    <div
      className={classNames(className, "absolute select-none cursor-move")}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleDragStart}
      role='presentation'
      aria-label={`${mode === "resize" ? "Move" : "Pan content"}`}
    >
      <div className='relative flex size-full items-center justify-center bg-black overflow-hidden'>
        {/* コンテンツ */}
        <div
          className='size-full pointer-events-none absolute'
          style={contentStyle}
        >
          {children}
        </div>
      </div>

      {buttons}

      {/* ボーダー */}
      <div
        className='pointer-events-none absolute inset-0 border-4 transition-opacity duration-200'
        style={{
          borderColor,
          opacity: isHovered ? 1 : 0.3,
        }}
      />

      {isHovered && (
        <>
          {/* リサイズハンドル */}
          <ResizeHandle
            handle='nw'
            onMouseDown={handleResizeStart}
            mode={mode}
          />
          <ResizeHandle
            handle='ne'
            onMouseDown={handleResizeStart}
            mode={mode}
          />
          <ResizeHandle
            handle='sw'
            onMouseDown={handleResizeStart}
            mode={mode}
          />
          <ResizeHandle
            handle='se'
            onMouseDown={handleResizeStart}
            mode={mode}
          />
        </>
      )}
    </div>
  );
};
