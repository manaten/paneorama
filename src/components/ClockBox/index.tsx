import { FC, useState, useEffect } from "react";

import { Button } from "../Button";
import { FlexibleBox } from "../FlexibleBox";

type Props = {
  onClickClose?: () => void;
  onClickMoveUp?: () => void;
  onClickMoveDown?: () => void;
  color: string;
};

export const ClockBox: FC<Props> = ({
  onClickClose,
  onClickMoveUp,
  onClickMoveDown,
  color,
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 100);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const formatTime = (date: Date | null) => {
    if (!date) {
      return "";
    }
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "";
    }
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <FlexibleBox
      contentWidth={280}
      contentHeight={100}
      mode='resize'
      borderColor={color}
      buttons={
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
            title='前面に移動'
          />
          <Button
            className='pointer-events-auto'
            iconType='move_down'
            iconColor={color}
            onClick={onClickMoveDown}
            title='背面に移動'
          />
          <Button
            className='pointer-events-auto'
            iconType='close'
            iconColor={color}
            onClick={onClickClose}
            title='閉じる'
          />
        </div>
      }
    >
      <div
        className={`
          pointer-events-auto flex h-full w-full flex-col items-center
          justify-center overflow-hidden p-4
        `}
      >
        <div className='mb-2 text-center'>
          <div
            className='font-mono text-5xl font-bold text-gray-200'
            style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}
          >
            {formatTime(currentTime)}
          </div>
        </div>

        <div
          className='mb-4 text-center text-gray-200'
          style={{ fontSize: "clamp(0.875rem, 2vw, 1.125rem)" }}
        >
          {formatDate(currentTime)}
        </div>
      </div>
    </FlexibleBox>
  );
};
