import classNames from "classnames";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

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

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && media) {
      // eslint-disable-next-line functional/immutable-data
      videoElement.srcObject = media;
    }

    return () => {
      if (videoElement) {
        // eslint-disable-next-line functional/immutable-data
        videoElement.srcObject = null; // Clean up the media stream
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

  return (
    <Rnd>
      <div
        className='group/video-box relative flex size-full items-center justify-center bg-black'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className='pointer-events-none absolute inset-0 border-4 transition-opacity duration-200'
          style={{ borderColor: color, opacity: isHovered ? 1 : 0 }}
        />

        <div
          className={classNames(
            "pointer-events-none fixed right-0 top-0 z-50 flex flex-row gap-1 p-2",
            "transition-opacity duration-200 ease-in-out",
            "opacity-0 group-hover/video-box:opacity-100",
          )}
        >
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

        <video className='size-full' ref={videoRef} autoPlay muted />
      </div>
    </Rnd>
  );
};
