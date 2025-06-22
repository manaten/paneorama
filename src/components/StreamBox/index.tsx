import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Mode, StreamBoxData } from "../../types/streamBox";
import { createDefaultStreamBoxData } from "../../utils/streamBoxDisplay";
import { Button } from "../Button";
import { StreamBoxDisplay } from "../StreamBoxDisplay";

interface Props {
  id: string;
  media: MediaStream;
  color: string;
  onClickClose?: (id: string) => void;
  onClickMoveUp?: (id: string) => void;
  onClickMoveDown?: (id: string) => void;
  onClickSwitchVideo?: (id: string) => void;
}

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

export const StreamBox: FC<Props> = ({
  id,
  media,
  color,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  onClickSwitchVideo,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // データモデル状態
  const [streamBoxData, setStreamBoxData] = useState<StreamBoxData>(
    createDefaultStreamBoxData(),
  );
  const [mode, setMode] = useState<Mode>("resize");

  // ドラッグ状態
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    data: StreamBoxData;
  } | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && media) {
      // eslint-disable-next-line functional/immutable-data
      videoElement.srcObject = media;
    }

    return () => {
      if (videoElement) {
        // eslint-disable-next-line functional/immutable-data
        videoElement.srcObject = null;
      }
    };
  }, [media]);

  // マウスイベントハンドラー
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      const initialData = dragStartRef.current.data;

      if (isDragging) {
        if (mode === "resize") {
          // コンテナの移動
          setStreamBoxData((prev) => ({
            ...prev,
            containerPosition: {
              x: initialData.containerPosition.x + deltaX,
              y: initialData.containerPosition.y + deltaY,
            },
          }));
        } else {
          // クロップモード：cropRectの位置を変更（パン）
          setStreamBoxData((prev) => ({
            ...prev,
            cropRect: {
              ...prev.cropRect,
              x: initialData.cropRect.x - deltaX,
              y: initialData.cropRect.y - deltaY,
            },
          }));
        }
      } else if (isResizing && activeHandle) {
        if (mode === "resize") {
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
          setStreamBoxData((prev) => ({
            ...prev,
            containerSize,
            containerPosition,
          }));
        } else {
          // クロップモード：cropRectのサイズを変更（ズーム）
          const scaleFactor = 1 + (deltaX + deltaY) / 200;
          const newWidth = Math.max(
            50,
            Math.min(800, initialData.cropRect.width / scaleFactor),
          );
          const newHeight = Math.max(
            50,
            Math.min(600, initialData.cropRect.height / scaleFactor),
          );

          // 中心を維持しながらリサイズ
          const centerX =
            initialData.cropRect.x + initialData.cropRect.width / 2;
          const centerY =
            initialData.cropRect.y + initialData.cropRect.height / 2;

          setStreamBoxData((prev) => ({
            ...prev,
            cropRect: {
              x: centerX - newWidth / 2,
              y: centerY - newHeight / 2,
              width: newWidth,
              height: newHeight,
            },
          }));
        }
      }
    },
    [isDragging, isResizing, activeHandle, mode],
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
        data: streamBoxData,
      };
      setIsDragging(true);
    },
    [streamBoxData],
  );

  const handleResizeStart = useCallback(
    (handle: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // eslint-disable-next-line functional/immutable-data
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        data: streamBoxData,
      };
      setIsResizing(true);
      setActiveHandle(handle);
    },
    [streamBoxData],
  );

  // イベントリスナーの管理
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
    return undefined;
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const closeHandler = useCallback(() => {
    onClickClose?.(id);
  }, [id, onClickClose]);

  const moveUpHandler = useCallback(() => {
    onClickMoveUp?.(id);
  }, [id, onClickMoveUp]);

  const moveDownHandler = useCallback(() => {
    onClickMoveDown?.(id);
  }, [id, onClickMoveDown]);

  const switchVideoHandler = useCallback(() => {
    onClickSwitchVideo?.(id);
  }, [id, onClickSwitchVideo]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "resize" ? "crop" : "resize"));
  }, []);

  return (
    <div className='relative'>
      {/* 表示コンポーネント */}
      <StreamBoxDisplay
        data={streamBoxData}
        borderColor={color}
        isHovered={isHovered}
      >
        <video
          ref={videoRef}
          className='size-full pointer-events-none'
          autoPlay
          muted
        />
      </StreamBoxDisplay>

      {/* 操作レイヤー */}
      <div
        className='absolute select-none cursor-move'
        style={{
          left: streamBoxData.containerPosition.x,
          top: streamBoxData.containerPosition.y,
          width: streamBoxData.containerSize.width,
          height: streamBoxData.containerSize.height,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        role='button'
        tabIndex={0}
        aria-label={`${mode === "resize" ? "Move" : "Pan video"} stream ${id}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
      >
        <div className='group/video-box size-full'>
          {/* コントロールボタン */}
          <div
            className={classNames(
              "pointer-events-none absolute right-0 top-0 z-50 flex flex-row gap-1 p-2",
              "transition-opacity duration-200 ease-in-out",
              "opacity-0 group-hover/video-box:opacity-100",
            )}
          >
            <Button
              className='pointer-events-auto'
              iconType={mode === "resize" ? "crop" : "fullscreen_exit"}
              iconColor={color}
              onClick={toggleMode}
              title={
                mode === "resize"
                  ? "Switch to crop mode"
                  : "Switch to resize mode"
              }
            />
            <Button
              className='pointer-events-auto'
              iconType='switch_video'
              iconColor={color}
              onClick={switchVideoHandler}
              title='Switch to different screen/window'
            />
            <Button
              className='pointer-events-auto'
              iconType='move_up'
              iconColor={color}
              onClick={moveUpHandler}
              title='Bring to front'
            />
            <Button
              className='pointer-events-auto'
              iconType='move_down'
              iconColor={color}
              onClick={moveDownHandler}
              title='Send to back'
            />
            <Button
              className='pointer-events-auto'
              iconType='close'
              iconColor={color}
              onClick={closeHandler}
              title='Close stream'
            />
          </div>

          {/* リサイズハンドル */}
          {isHovered && (
            <>
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

          {/* クロップモード表示 */}
          {mode === "crop" && isHovered && (
            <div className='absolute inset-0 pointer-events-none border-2 border-dashed border-yellow-400 opacity-50' />
          )}
        </div>
      </div>
    </div>
  );
};
