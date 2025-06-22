import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { useDragResize, Mode } from "../../hooks/useDragResize";
import { Button } from "../Button";

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

  const {
    state,
    handleMouseDown,
    handleResizeStart,
    setMode,
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
    setMode(state.mode === "resize" ? "crop" : "resize");
  }, [state.mode, setMode]);

  return (
    <div
      className='absolute select-none'
      style={{
        left: state.position.x,
        top: state.position.y,
        width: state.size.width,
        height: state.size.height,
      }}
    >
      <div
        className='group/video-box relative flex size-full items-center justify-center bg-black overflow-hidden cursor-move'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        role='button'
        tabIndex={0}
        aria-label={`${state.mode === "resize" ? "Move" : "Pan video"} stream ${id}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
      >
        <div
          className='pointer-events-none absolute inset-0 border-4 transition-opacity duration-200'
          style={{ borderColor: color, opacity: isHovered ? 1 : 0 }}
        />

        <div
          className={classNames(
            "pointer-events-none absolute right-0 top-0 z-50 flex flex-row gap-1 p-2",
            "transition-opacity duration-200 ease-in-out",
            "opacity-0 group-hover/video-box:opacity-100",
          )}
        >
          <Button
            className='pointer-events-auto'
            iconType={state.mode === "resize" ? "crop" : "fullscreen_exit"}
            iconColor={color}
            onClick={toggleMode}
            title={
              state.mode === "resize"
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

        <video
          className='size-full object-cover pointer-events-none'
          ref={videoRef}
          autoPlay
          muted
          style={{
            transform: `translate(${state.cropTransform.x}px, ${state.cropTransform.y}px) scale(${state.cropTransform.scale})`,
            transformOrigin: "center center",
          }}
        />
      </div>

      {isHovered && (
        <>
          <ResizeHandle
            handle='nw'
            onMouseDown={handleResizeStart}
            mode={state.mode}
          />
          <ResizeHandle
            handle='ne'
            onMouseDown={handleResizeStart}
            mode={state.mode}
          />
          <ResizeHandle
            handle='sw'
            onMouseDown={handleResizeStart}
            mode={state.mode}
          />
          <ResizeHandle
            handle='se'
            onMouseDown={handleResizeStart}
            mode={state.mode}
          />
        </>
      )}

      {state.mode === "crop" && isHovered && (
        <div className='absolute inset-0 pointer-events-none border-2 border-dashed border-yellow-400 opacity-50' />
      )}
    </div>
  );
};
