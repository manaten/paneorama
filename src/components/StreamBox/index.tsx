import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { useDragResize } from "../../hooks/useDragResize";
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

  // 新しいデータモデル（仮の初期値）
  const [streamBoxData, _setStreamBoxData] = useState<StreamBoxData>(
    createDefaultStreamBoxData(),
  );
  const [mode, setMode] = useState<Mode>("resize");

  // 既存のドラッグ&リサイズロジック（後で修正予定）
  const {
    state,
    handleMouseDown,
    handleResizeStart,
    addEventListeners,
    removeEventListeners,
  } = useDragResize();

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

  useEffect(() => {
    if (state.isDragging || state.isResizing) {
      addEventListeners();
      return removeEventListeners;
    }
    return undefined;
  }, [
    state.isDragging,
    state.isResizing,
    addEventListeners,
    removeEventListeners,
  ]);

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
