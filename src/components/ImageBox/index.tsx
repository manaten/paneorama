import classNames from "classnames";
import { ComponentProps, FC, useCallback, useState } from "react";

import { t } from "../../i18n";
import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

interface Props {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  color: string;
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
}

function detectContentSize(imageWidth: number, imageHeight: number) {
  const aspectRatio = imageWidth / imageHeight;
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;
  const maxAspectRatio = maxWidth / maxHeight;

  if (aspectRatio >= maxAspectRatio && imageWidth > maxWidth) {
    return { width: maxWidth, height: maxWidth / aspectRatio };
  }
  if (aspectRatio < maxAspectRatio && imageHeight > maxHeight) {
    return { width: maxHeight * aspectRatio, height: maxHeight };
  }

  return { width: imageWidth, height: imageHeight };
}

export const ImageBox: FC<Props> = ({
  src,
  naturalWidth,
  naturalHeight,
  color,
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
}) => {
  const [mode, setMode] =
    useState<ComponentProps<typeof FlexibleBox>["mode"]>("resize");

  const contentSize = detectContentSize(naturalWidth, naturalHeight);

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
            ? t("imageBox.switchToCrop")
            : t("imageBox.switchToResize")
        }
      />
      <Button
        className='pointer-events-auto'
        iconType='move_up'
        iconColor={color}
        onClick={onClickMoveUp}
        title={t("imageBox.bringToFront")}
      />
      <Button
        className='pointer-events-auto'
        iconType='move_down'
        iconColor={color}
        onClick={onClickMoveDown}
        title={t("imageBox.sendToBack")}
      />
      <Button
        className='pointer-events-auto'
        iconType='close'
        iconColor={color}
        onClick={onClickClose}
        title={t("imageBox.closeImage")}
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
      <img
        src={src}
        className='pointer-events-none size-full object-contain'
        alt=''
        draggable={false}
      />
    </FlexibleBox>
  );
};
