import classNames from "classnames";
import {
  ComponentProps,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { t } from "../../i18n";
import { Button } from "../Button";
import { StreamBoxInner } from "./StreamBoxInner";

interface Props {
  id: string;
  media: MediaStream;
  contentWidth: number;
  contentHeight: number;
  color: string;
  onClickClose?: (id: string) => void;
  onClickMoveUp?: (id: string) => void;
  onClickMoveDown?: (id: string) => void;
  onClickSwitchVideo?: (id: string) => void;
}

export const StreamBox: FC<Props> = ({
  id,
  media,
  contentWidth,
  contentHeight,
  color,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  onClickSwitchVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] =
    useState<ComponentProps<typeof StreamBoxInner>["mode"]>("resize");

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
        "pointer-events-none absolute right-0 top-0 flex flex-row gap-2 p-4",
        "transition-opacity duration-200 ease-in-out",
      )}
    >
      <Button
        className='pointer-events-auto'
        iconType={mode === "resize" ? "crop" : "fullscreen_exit"}
        iconColor={color}
        onClick={toggleMode}
        title={
          mode === "resize"
            ? t("streamBox.switchToCrop")
            : t("streamBox.switchToResize")
        }
      />
      <Button
        className='pointer-events-auto'
        iconType='switch_video'
        iconColor={color}
        onClick={switchVideoHandler}
        title={t("streamBox.switchVideo")}
      />
      <Button
        className='pointer-events-auto'
        iconType='move_up'
        iconColor={color}
        onClick={moveUpHandler}
        title={t("streamBox.bringToFront")}
      />
      <Button
        className='pointer-events-auto'
        iconType='move_down'
        iconColor={color}
        onClick={moveDownHandler}
        title={t("streamBox.sendToBack")}
      />
      <Button
        className='pointer-events-auto'
        iconType='close'
        iconColor={color}
        onClick={closeHandler}
        title={t("streamBox.closeStream")}
      />
    </div>
  );

  return (
    <StreamBoxInner
      contentWidth={contentWidth}
      contentHeight={contentHeight}
      mode={mode}
      borderColor={color}
      buttons={buttons}
    >
      <video
        ref={videoRef}
        className='pointer-events-none size-full'
        autoPlay
        muted
      />
    </StreamBoxInner>
  );
};
