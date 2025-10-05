import { FC } from "react";

import { Button } from "../Button";

import { t } from "@/i18n";

type Props = {
  color: string;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  onClickClose?: () => void;
};

export const BoxControlButtons: FC<Props> = ({
  color,
  onClickMoveUp,
  onClickMoveDown,
  onClickClose,
}) => {
  return (
    <div
      className={`
        pointer-events-none absolute top-0 right-0 flex flex-row gap-2 p-4
      `}
    >
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
};
