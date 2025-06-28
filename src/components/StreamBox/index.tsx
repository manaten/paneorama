import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";

import { Mode } from "../../types/streamBox";
import { Button } from "../Button";
import { StreamBoxInner } from "./StreamBoxInner";

interface Props {
  id: string;
  media: MediaStream;
  color: string;
  onClickClose?: (id: string) => void;
  onClickMoveUp?: (id: string) => void;
  onClickMoveDown?: (id: string) => void;
  onClickSwitchVideo?: (id: string) => void;
}

export const StreamBox: FC<Props> = ({
  id,
  media,
  color,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  onClickSwitchVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("resize");

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

  const buttons = (
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
          mode === "resize" ? "Switch to crop mode" : "Switch to resize mode"
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
  );

  return (
    <StreamBoxInner
      className='group/video-box relative'
      mode={mode}
      borderColor={color}
      buttons={buttons}
    >
      <video
        ref={videoRef}
        className='size-full pointer-events-none'
        autoPlay
        muted
      />
    </StreamBoxInner>
  );
};
