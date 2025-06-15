"use client";

import classNames from "classnames";
import { FC, useCallback, useState } from "react";
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

  const videoRef = (videoElem: HTMLVideoElement) => {
    videoElem.srcObject = media; // eslint-disable-line functional/immutable-data
    return () => {
      videoElem.srcObject = null; // eslint-disable-line functional/immutable-data
    };
  };

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
        {isHovered && (
          <div
            className='pointer-events-none absolute inset-0 border-4 transition-opacity duration-200'
            style={{ borderColor: color }}
          />
        )}

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
          />
          <Button
            className='pointer-events-auto'
            iconType='move_up'
            iconColor={color}
            onClick={moveUpHandler}
          />
          <Button
            className='pointer-events-auto'
            iconType='move_down'
            iconColor={color}
            onClick={moveDownHandler}
          />
          <Button
            className='pointer-events-auto'
            iconType='close'
            iconColor={color}
            onClick={closeHandler}
          />
        </div>

        <video className='size-full' ref={videoRef} autoPlay muted />
      </div>
    </Rnd>
  );
};
