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
import { FlexibleBox } from "../FlexibleBox";

interface Props {
  media: MediaStream;
  color: string;
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  onClickSwitchVideo?: () => void;
}

function detectContentSize(videoWidth: number, videoHeight: number) {
  const aspectRatio = videoWidth / videoHeight;
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;
  const maxAspectRatio = maxWidth / maxHeight;

  if (aspectRatio >= maxAspectRatio && videoWidth > maxWidth) {
    // 横長すぎる場合は横幅を基準にする
    return { width: maxWidth, height: maxWidth / aspectRatio };
  }
  if (aspectRatio < maxAspectRatio && videoHeight > maxHeight) {
    // 縦長すぎる場合は高さを基準にする
    return { width: maxHeight * aspectRatio, height: maxHeight };
  }

  return { width: videoWidth, height: videoHeight };
}

export const StreamBox: FC<Props> = ({
  media,
  color,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  onClickSwitchVideo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] =
    useState<ComponentProps<typeof FlexibleBox>["mode"]>("resize");

  const [contentSize, setContentSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && media) {
      // eslint-disable-next-line functional/immutable-data
      videoElement.srcObject = media;

      (async () => {
        // videoのサイズが即座に取得できないことがあるため、取得可能になるまで何回か繰り返す
        for (const _ of Array.from({ length: 20 })) {
          await new Promise((r) => setTimeout(r, 50));
          if (videoElement.videoWidth && videoElement.videoHeight) {
            setContentSize(
              detectContentSize(
                videoElement.videoWidth,
                videoElement.videoHeight,
              ),
            );
            return;
          }
        }
        // サイズが取得できなかったらしょうがないのでウィンドウサイズベースで決める
        setContentSize({
          width: window.innerWidth * 0.8,
          height: window.innerHeight * 0.8,
        });
      })();
    }

    return () => {
      if (videoElement) {
        // eslint-disable-next-line functional/immutable-data
        videoElement.srcObject = null;
      }
    };
  }, [media]);

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
        onClick={onClickSwitchVideo}
        title={t("streamBox.switchVideo")}
      />
      <Button
        className='pointer-events-auto'
        iconType='move_up'
        iconColor={color}
        onClick={onClickMoveUp}
        title={t("streamBox.bringToFront")}
      />
      <Button
        className='pointer-events-auto'
        iconType='move_down'
        iconColor={color}
        onClick={onClickMoveDown}
        title={t("streamBox.sendToBack")}
      />
      <Button
        className='pointer-events-auto'
        iconType='close'
        iconColor={color}
        onClick={onClickClose}
        title={t("streamBox.closeStream")}
      />
    </div>
  );

  return (
    <FlexibleBox
      contentWidth={contentSize.width}
      contentHeight={contentSize.height}
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
    </FlexibleBox>
  );
};
