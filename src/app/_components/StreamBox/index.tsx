"use client";

import classNames from "classnames";
import { FC, useCallback } from "react";
import { Rnd } from "react-rnd";

import { Button } from "../Button";

interface Props {
  id: string;
  media: MediaStream;
  onClickClose?: (id: string) => void;
  onClickMoveUp?: (id: string) => void;
  onClickMoveDown?: (id: string) => void;
}

export const StreamBox: FC<Props> = ({
  id,
  media,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
}) => {
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

  return (
    <Rnd>
      <div className='group/video-box relative flex size-full items-center justify-center bg-black'>
        <div
          className={classNames(
            "pointer-events-none fixed right-0 top-0 z-50 flex flex-row gap-1 p-2",
            "transition-opacity duration-200 ease-in-out",
            "opacity-0 group-hover/video-box:opacity-100",
          )}
        >
          <Button
            className='pointer-events-auto'
            iconType='move_up'
            onClick={moveUpHandler}
          />
          <Button
            className='pointer-events-auto'
            iconType='move_down'
            onClick={moveDownHandler}
          />
          <Button
            className='pointer-events-auto'
            iconType='close'
            onClick={closeHandler}
          />
        </div>

        <video className='size-full' ref={videoRef} autoPlay muted />
      </div>
    </Rnd>
  );
};
