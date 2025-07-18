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
  createDefaultTransform,
  handleDragOnCrop,
  handleDragOnResize,
} from "./functions";
import { Mode, StreamBoxTransform } from "./types";
import { t } from "../../../i18n";

type HandleType = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";

interface ResizeHandleProps {
  handle: HandleType;
  onMouseDown: (handle: HandleType, e: React.MouseEvent) => void;
  mode: Mode;
  borderColor?: string;
}

const ResizeHandle: FC<ResizeHandleProps> = ({
  handle,
  onMouseDown,
  mode,
  borderColor,
}) => {
  const position = useMemo(() => {
    switch (handle) {
      case "nw":
        return "top-0 left-0 -translate-x-1 -translate-y-1";
      case "ne":
        return "top-0 right-0 translate-x-1 -translate-y-1";
      case "sw":
        return "bottom-0 left-0 -translate-x-1 translate-y-1";
      case "se":
        return "bottom-0 right-0 translate-x-1 translate-y-1";
      case "n":
        return "top-0 left-1/2 -translate-x-1/2 -translate-y-1";
      case "s":
        return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1";
      case "e":
        return "right-0 top-1/2 translate-x-1 -translate-y-1/2";
      case "w":
        return "left-0 top-1/2 -translate-x-1 -translate-y-1/2";
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
      case "n":
      case "s":
        return "cursor-ns-resize";
      case "e":
      case "w":
        return "cursor-ew-resize";
    }
  }, [handle]);

  const isCornerHandle = ["nw", "ne", "sw", "se"].includes(handle);
  const isEdgeHandle = ["n", "s", "e", "w"].includes(handle);

  return (
    <button
      type='button'
      className={classNames(
        "absolute border-3 border-black bg-white",
        "hover:bg-gray-300 transition-colors",
        {
          // Corner handles: round
          "w-5 h-5 rounded-sm": isCornerHandle,
          // Edge handles: rectangular
          "w-16 h-3 rounded-sm":
            isEdgeHandle && (handle === "n" || handle === "s"),
          "w-3 h-16 rounded-sm":
            isEdgeHandle && (handle === "e" || handle === "w"),
        },
        position,
        cursor,
      )}
      style={{ borderColor }}
      onMouseDown={(e) => onMouseDown(handle, e)}
      title={mode === "resize" ? t("streamBox.resize") : t("streamBox.crop")}
      aria-label={`${mode === "resize" ? t("streamBox.resizeHandle") : t("streamBox.cropHandle")} ${handle}`}
    />
  );
};

interface Props {
  className?: string;

  /**
   * StreamBoxの初期トランスフォーム
   */
  initialTransform?: StreamBoxTransform;

  /**
   * 表示するコンテンツ
   */
  children: ReactNode;

  /**
   * コンテンツの幅
   */
  contentWidth: number;

  /**
   * コンテンツの高さ
   */
  contentHeight: number;

  /**
   * モード
   */
  mode: Mode;

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
  initialTransform,
  contentWidth,
  contentHeight,
  children,
  mode,
  borderColor = "#3b82f6",
  buttons,
}) => {
  // 内部状態
  const [currentTransform, setCurrentTransform] = useState<StreamBoxTransform>(
    () =>
      initialTransform ?? createDefaultTransform(contentWidth, contentHeight),
  );
  const [isHovered, setIsHovered] = useState(false);

  const [dragStartData, setDragStartData] = useState<{
    initialTransform: StreamBoxTransform;
    x: number;
    y: number;
    dragOrResize: "drag" | "resize";
    handle?: HandleType;
  } | null>(null);

  // マウスイベントハンドラー（interactiveの場合のみ）
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartData) return;
      const { initialTransform } = dragStartData;
      const delta = {
        x: e.clientX - dragStartData.x,
        y: e.clientY - dragStartData.y,
        handle: dragStartData.handle,
      } as const;

      const contentSize = {
        width: contentWidth,
        height: contentHeight,
      } as const;

      if (dragStartData.dragOrResize === "drag") {
        if (mode === "resize") {
          setCurrentTransform(contentDragOnResize(initialTransform, delta));
        }
        if (mode === "crop") {
          setCurrentTransform(
            contentDragOnCrop(initialTransform, delta, contentSize),
          );
        }
      }

      if (dragStartData.dragOrResize === "resize") {
        if (mode === "resize") {
          setCurrentTransform(handleDragOnResize(initialTransform, delta));
        }
        if (mode === "crop") {
          setCurrentTransform(
            handleDragOnCrop(initialTransform, delta, contentSize),
          );
        }
      }
    },
    [mode, dragStartData, contentWidth, contentHeight],
  );

  const handleMouseUp = useCallback(() => {
    setDragStartData(null);
  }, []);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragStartData({
        initialTransform: currentTransform,
        x: e.clientX,
        y: e.clientY,
        dragOrResize: "drag",
      });
    },
    [currentTransform],
  );

  const handleResizeStart = useCallback(
    (handle: HandleType, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setDragStartData({
        initialTransform: currentTransform,
        x: e.clientX,
        y: e.clientY,
        dragOrResize: "resize",
        handle,
      });
    },
    [currentTransform],
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
  const { containerStyle, contentStyle } = calculateDisplayProperties(
    {
      width: contentWidth,
      height: contentHeight,
    },
    currentTransform,
  );

  const handleProps = {
    mode,
    borderColor,
    onMouseDown: handleResizeStart,
  } as const;

  return (
    <div
      className={classNames(className, "absolute select-none cursor-move")}
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleDragStart}
      role='presentation'
      aria-label={`${mode === "resize" ? t("streamBox.move") : t("streamBox.panContent")}`}
    >
      <div
        className={`
          relative flex size-full items-center justify-center overflow-hidden
          bg-black
        `}
      >
        {/* コンテンツ */}
        <div
          className='pointer-events-none absolute size-full'
          style={contentStyle}
        >
          {children}
        </div>
      </div>

      {(isHovered || dragStartData !== null) && (
        <>
          {/* ボーダー */}
          <div
            className='pointer-events-none absolute inset-0 border-6'
            style={{ borderColor }}
          />

          {/* コーナーハンドル */}
          <ResizeHandle handle='nw' {...handleProps} />
          <ResizeHandle handle='ne' {...handleProps} />
          <ResizeHandle handle='sw' {...handleProps} />
          <ResizeHandle handle='se' {...handleProps} />

          {/* エッジハンドル（クロップモード時のみ表示） */}
          {mode === "crop" && (
            <>
              <ResizeHandle handle='n' {...handleProps} />
              <ResizeHandle handle='s' {...handleProps} />
              <ResizeHandle handle='e' {...handleProps} />
              <ResizeHandle handle='w' {...handleProps} />
            </>
          )}

          {/* ユーザー定義ボタン */}
          {buttons}
        </>
      )}
    </div>
  );
};
